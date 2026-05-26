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

    const results = await prisma.result.findMany();
    
    // Fetch related students and classes manually because Result model lacks relations
    const studentIds = Array.from(new Set(results.map(r => r.studentId)));
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      include: { user: true, class: true }
    });
    
    const studentMap = students.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {} as any);

    const subjectAveragesMap: Record<string, { total: number, count: number }> = {};
    const topPerformersMap: Record<string, { name: string, className: string, totalMarks: number, maxMarks: number }> = {};

    results.forEach(res => {
      // Subject averages
      if (!subjectAveragesMap[res.subjectId]) {
        subjectAveragesMap[res.subjectId] = { total: 0, count: 0 };
      }
      subjectAveragesMap[res.subjectId].total += (res.marks / res.maxMarks) * 100;
      subjectAveragesMap[res.subjectId].count += 1;

      // Top performers
      const student = studentMap[res.studentId];
      if (student) {
        if (!topPerformersMap[res.studentId]) {
          topPerformersMap[res.studentId] = { 
            name: student.user.name, 
            className: `${student.class.name} ${student.class.section}`,
            totalMarks: 0,
            maxMarks: 0
          };
        }
        topPerformersMap[res.studentId].totalMarks += res.marks;
        topPerformersMap[res.studentId].maxMarks += res.maxMarks;
      }
    });

    const topPerformers = Object.values(topPerformersMap)
      .map(p => ({
        name: p.name,
        className: p.className,
        percentage: (p.totalMarks / p.maxMarks) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    const subjectComparisonChart = Object.keys(subjectAveragesMap).map(subId => ({
      name: `Subject ${subId.substring(0,4)}`, 
      average: subjectAveragesMap[subId].total / subjectAveragesMap[subId].count
    }));

    return NextResponse.json({
      topPerformers,
      subjectComparisonChart
    });

  } catch (error) {
    console.error("Error fetching academic analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
