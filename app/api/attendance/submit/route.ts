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

    // Verify teacher is assigned to this class
    const isAssigned = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: teacherRecord.id,
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

    const studentIds = records.map((r: any) => r.studentId);

    // Auto-lift expired suspensions at runtime before processing
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

    // Block attendance for currently suspended students
    const suspendedStudents = await prisma.student.findMany({
      where: { id: { in: studentIds }, isSuspended: true },
      select: { id: true },
    });
    const suspendedIds = new Set(suspendedStudents.map(s => s.id));

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
      status: suspendedIds.has(r.studentId) ? "BLOCKED" : r.status,
      markedBy: teacherRecord.id,
      headCount: headCount
    }));

    await prisma.attendance.createMany({
      data: attendanceData,
    });

    // Update Attendance Summary for each student asynchronously
    // Recalculate summary from scratch to prevent inflation on edits
    for (const record of records) {
      const allStudentAttendance = await prisma.attendance.groupBy({
        by: ['status'],
        where: { studentId: record.studentId },
        _count: true,
      });

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let totalClasses = 0;

      allStudentAttendance.forEach((group) => {
        const count = group._count;
        totalClasses += count;
        if (group.status === 'PRESENT') presentCount += count;
        if (group.status === 'ABSENT') absentCount += count;
        if (group.status === 'LATE') lateCount += count;
      });

      const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

      await prisma.attendanceSummary.upsert({
        where: { studentId: record.studentId },
        update: {
          totalClasses,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage,
          lastUpdated: new Date()
        },
        create: {
          studentId: record.studentId,
          totalClasses,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage,
        }
      });

      // Sync the attendance percentage back to Student model for quick access in UI
      await prisma.student.update({
        where: { id: record.studentId },
        data: { attendancePercentage }
      });
    }
    // Create or update DailyAttendanceLog
    let present = 0;
    let absent = 0;
    let late = 0;
    let blocked = 0;

    for (const r of attendanceData) {
      if (r.status === "PRESENT") present++;
      if (r.status === "ABSENT") absent++;
      if (r.status === "LATE") late++;
      if (r.status === "BLOCKED") blocked++;
    }

    await prisma.dailyAttendanceLog.upsert({
      where: {
        classId_date: {
          classId,
          date: parsedDate,
        }
      },
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

    // Prepare notifications for absentees
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

    // Notify Admin about attendance submission
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
    if (admins.length > 0) {
      await createNotifications(admins.map(admin => ({
        userId: admin.id,
        title: 'Attendance Submitted',
        message: `Teacher ${teacherRecord.user.name} submitted attendance for class. Present: ${present}, Absent: ${absent}`,
        type: 'ATTENDANCE' as any,
        link: '/admin/attendance'
      })));
    }

    return NextResponse.json({ success: true, message: "Attendance saved successfully" });

  } catch (error) {
    console.error("Attendance Submit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
