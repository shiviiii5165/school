export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized — Admin only" }, { status: 401 });
    }

    const { id } = params;
    const { reason } = await req.json();

    const student = await prisma.student.update({
      where: { id },
      data: {
        examEligible: false,
        detainedAt: new Date(),
        detainedReason: reason || "Low attendance",
        detainedBy: session.user.id,
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      success: true,
      message: `${student.user?.name} has been detained`,
    });
  } catch (error) {
    console.error("Error detaining student:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
