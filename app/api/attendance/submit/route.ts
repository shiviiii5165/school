export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotifications } from "@/lib/notifications";

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

    const teacherRecord = await prisma.teacher.findUnique({
      where: { userId: teacherId },
      include: { user: true }
    });

    if (!teacherRecord) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 403 });
    }

    const isAssigned = await prisma.class.findFirst({
      where: { id: classId, teacherId: teacherRecord.id },
    });

    if (!isAssigned) {
      return NextResponse.json({ error: "Not assigned to this class" }, { status: 403 });
    }

    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedDate > today) {
      return NextResponse.json({ error: "Cannot mark attendance for future dates" }, { status: 400 });
    }

    const studentIds = records.map((r: any) => r.studentId);

    // Auto-lift expired suspensions
    const now = new Date();
    const allStudents = await prisma.student.findMany({
      where: { id: { in: studentIds } },
    });
    
    for (const student of allStudents) {
      if (student.isSuspended && student.suspendedUntil && student.suspendedUntil <= now) {
        await prisma.student.update({
          where: { id: student.id },
          data:  { isSuspended: false, suspendedUntil: null, suspendedFrom: null, suspendedReason: null }
        });
      }
    }

    const suspendedStudents = await prisma.student.findMany({
      where: { id: { in: studentIds }, isSuspended: true },
      select: { id: true },
    });
    const suspendedIds = new Set(suspendedStudents.map(s => s.id));

    const attendanceData = records.map((r: any) => ({
      studentId: r.studentId,
      classId,
      date: parsedDate,
      status: suspendedIds.has(r.studentId) ? "BLOCKED" : r.status,
      markedBy: teacherRecord.id,
      headCount: headCount
    }));

    // Start Transaction for accuracy
    await prisma.$transaction(async (tx) => {
      // 1. Save/upsert individual Attendance record for each student
      await tx.attendance.deleteMany({
        where: { classId, date: parsedDate }
      });
      await tx.attendance.createMany({
        data: attendanceData,
      });

      // 2. Upsert DailyAttendanceLog for this class+date
      let present = 0, absent = 0, late = 0, blocked = 0;
      for (const r of attendanceData) {
        if (r.status === "PRESENT") present++;
        if (r.status === "ABSENT") absent++;
        if (r.status === "LATE") late++;
        if (r.status === "BLOCKED") blocked++;
      }

      await tx.dailyAttendanceLog.upsert({
        where: { classId_date: { classId, date: parsedDate } },
        update: {
          teacherId: teacherRecord.id,
          submittedAt: new Date(),
          totalStudents: records.length,
          presentCount: present,
          absentCount: absent,
          lateCount: late,
          blockedCount: blocked,
          headCount: headCount || records.length,
        },
        create: {
          classId,
          date: parsedDate,
          teacherId: teacherRecord.id,
          submittedAt: new Date(),
          totalStudents: records.length,
          presentCount: present,
          absentCount: absent,
          lateCount: late,
          blockedCount: blocked,
          headCount: headCount || records.length,
        }
      });

    }); // End of transaction

    // 3. For EVERY student in that class, recalculate AttendanceSummary outside transaction to avoid timeouts
    await Promise.all(allStudents.map(async (student) => {
      // totalClassesHeld = count of distinct days teacher has submitted attendance for that class since student joined
      const totalClassesHeld = await prisma.dailyAttendanceLog.count({
        where: {
          classId: classId,
          date: { gte: student.admissionDate } // Only count classes AFTER their join date
        }
      });

      // Get count of PRESENT and LATE from actual Attendance table
      const presentCount = await prisma.attendance.count({
        where: { studentId: student.id, classId: classId, status: 'PRESENT' }
      });
      const lateCount = await prisma.attendance.count({
        where: { studentId: student.id, classId: classId, status: 'LATE' }
      });

      // Calculate missing absent
      const absentCount = totalClassesHeld - presentCount - lateCount;
      
      // Calculate Percentage (LATE counts as PRESENT for percentage calculation)
      const attendancePercentage = totalClassesHeld > 0 
        ? ((presentCount + lateCount) / totalClassesHeld) * 100 
        : 100; // Database expects Float with default 100, UI will handle totalClassesHeld === 0 case

      // 4. UPDATE student.attendancePercentage
      await prisma.student.update({
        where: { id: student.id },
        data: { attendancePercentage }
      });

      // 5. UPDATE AttendanceSummary table
      await prisma.attendanceSummary.upsert({
        where: { studentId: student.id },
        update: {
          totalClasses: totalClassesHeld,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage,
          lastUpdated: new Date()
        },
        create: {
          studentId: student.id,
          totalClasses: totalClassesHeld,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage,
        }
      });
    }));

    // Notifications (Run outside transaction)
    const absentStudentIds = attendanceData.filter((r: any) => r.status === 'ABSENT').map((r: any) => r.studentId);
    if (absentStudentIds.length > 0) {
      const absentStudents = await prisma.student.findMany({
        where: { id: { in: absentStudentIds } },
        include: { user: true, parent: true }
      });
      
      const notifications = absentStudents.map(student => ({
        userId: student.parent?.userId,
        title: 'Attendance Alert',
        message: `${student.user.name} was marked ABSENT today (${parsedDate.toLocaleDateString()}).`,
        type: 'ATTENDANCE' as any,
        link: '/parent/attendance'
      }));
      await createNotifications(notifications);
    }

    return NextResponse.json({ success: true, message: "Attendance saved successfully" });

  } catch (error) {
    console.error("Attendance Submit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
