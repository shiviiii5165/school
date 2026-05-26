import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.systemSettings.create({
        data: {}, // Uses defaults from schema
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {},
      });
    }

    const updatedSettings = await prisma.systemSettings.update({
      where: { id: settings.id },
      data: {
        schoolName: body.schoolName !== undefined ? body.schoolName : undefined,
        schoolEmail: body.schoolEmail !== undefined ? body.schoolEmail : undefined,
        schoolPhone: body.schoolPhone !== undefined ? body.schoolPhone : undefined,
        minimumAttendance: body.minimumAttendance !== undefined ? parseInt(body.minimumAttendance) : undefined,
        detentionThreshold: body.detentionThreshold !== undefined ? parseInt(body.detentionThreshold) : undefined,
        attendanceEnabled: body.attendanceEnabled !== undefined ? body.attendanceEnabled : undefined,
        notificationEnabled: body.notificationEnabled !== undefined ? body.notificationEnabled : undefined,
        gradingSystem: body.gradingSystem !== undefined ? body.gradingSystem : undefined,
      },
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
