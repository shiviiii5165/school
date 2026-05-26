export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = session.user.id;
    const { classId, date, records, headCount } = await req.json();

    if (!classId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify teacher is assigned to this class
    const isAssigned = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: teacherId,
      },
    });

    if (!isAssigned) {
      return NextResponse.json({ error: "Not assigned to this class" }, { status: 403 });
    }

    // Verify date is not in future
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedDate > today) {
      return NextResponse.json({ error: "Cannot mark attendance for future dates" }, { status: 400 });
    }

    // Check if attendance already exists for today
    const existing = await prisma.attendance.findFirst({
      where: {
        classId,
        date: parsedDate,
      }
    });

    if (existing) {
      // In a real app we might allow updates, but let's allow it as an upsert/update
      // First, delete old records
      await prisma.attendance.deleteMany({
        where: {
          classId,
          date: parsedDate
        }
      });
    }

    const attendanceData = records.map((r: any) => ({
      studentId: r.studentId,
      classId,
      date: parsedDate,
      status: r.status,
      markedBy: teacherId,
      headCount: headCount
    }));

    await prisma.attendance.createMany({
      data: attendanceData,
    });

    // Update Attendance Summary for each student asynchronously
    // This could be moved to a background job in production
    for (const record of records) {
      const summary = await prisma.attendanceSummary.findUnique({
        where: { studentId: record.studentId }
      });

      if (summary) {
        await prisma.attendanceSummary.update({
          where: { studentId: record.studentId },
          data: {
            totalClasses: { increment: 1 },
            presentCount: record.status === 'PRESENT' ? { increment: 1 } : undefined,
            absentCount: record.status === 'ABSENT' ? { increment: 1 } : undefined,
            lateCount: record.status === 'LATE' ? { increment: 1 } : undefined,
            attendancePercentage: ((summary.presentCount + (record.status === 'PRESENT' ? 1 : 0)) / (summary.totalClasses + 1)) * 100
          }
        });
      } else {
        await prisma.attendanceSummary.create({
          data: {
            studentId: record.studentId,
            totalClasses: 1,
            presentCount: record.status === 'PRESENT' ? 1 : 0,
            absentCount: record.status === 'ABSENT' ? 1 : 0,
            lateCount: record.status === 'LATE' ? 1 : 0,
            attendancePercentage: record.status === 'PRESENT' ? 100 : 0
          }
        });
      }

      // Sync the attendance percentage back to Student model for quick access in UI
      const updatedSummary = await prisma.attendanceSummary.findUnique({ where: { studentId: record.studentId }});
      if (updatedSummary) {
        await prisma.student.update({
          where: { id: record.studentId },
          data: { attendancePercentage: updatedSummary.attendancePercentage }
        });
      }
    }

    return NextResponse.json({ success: true, message: "Attendance saved successfully" });

  } catch (error) {
    console.error("Attendance Submit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
