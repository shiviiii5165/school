export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const { id } = params;
    const { adminNote } = await req.json();

    const report = await prisma.disciplineReport.findUnique({
      where: { id },
      include: {
        student: { include: { user: true, parent: { include: { user: true } } } },
        teacher: { include: { user: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const [updatedReport, updatedStudent] = await prisma.$transaction([
      prisma.disciplineReport.update({
        where: { id },
        data: {
          status: "SUSPENDED",
          adminNote,
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
          actionTaken: "SUSPENDED",
        },
      }),
      prisma.student.update({
        where: { id: report.studentId },
        data: {
          isSuspended: true,
          suspendedReason: report.category,
          suspendedAt: new Date(),
        },
      }),
    ]);

    // Create notifications for Student, Parent, and Teacher
    const notifications = [];
    
    // Teacher notification
    notifications.push({
      userId: report.teacher.userId,
      title: "Student Suspended",
      message: `Action taken on your report: Student ${report.student.user.name} has been suspended.`,
      type: "DISCIPLINE" as "DISCIPLINE",
    });

    // Student notification
    notifications.push({
      userId: report.student.userId,
      title: "Account Suspended",
      message: `You have been suspended for: ${report.category}. Please contact administration.`,
      type: "DISCIPLINE" as "DISCIPLINE",
    });

    // Parent notification (if linked)
    if (report.student.parent?.userId) {
      notifications.push({
        userId: report.student.parent.userId,
        title: "Ward Suspended",
        message: `Your ward ${report.student.user.name} has been suspended. Please contact the school.`,
        type: "DISCIPLINE" as "DISCIPLINE",
      });
    }

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
    }

    return NextResponse.json({ success: true, report: updatedReport, student: updatedStudent });
  } catch (error) {
    console.error("Error suspending student:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
