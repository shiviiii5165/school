import ParentDashboardClient from "./ParentDashboardClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ParentDashboard() {
  const session = await auth();
  if (!session || session.user?.role !== "PARENT") {
    redirect("/login");
  }

  const parentData = await prisma.parent.findUnique({
    where: { userId: session.user.id },
    include: {
      students: {
        include: {
          user: true,
          class: true,
          attendanceSummary: true,
        }
      }
    }
  });

  if (!parentData) {
    return <div className="p-6">Parent profile not found.</div>;
  }

  const childrenData = parentData.students.map((student) => ({
    id: student.id,
    name: student.user ? student.user.name : "Child",
    class: `${student.class.name} - ${student.class.section}`,
    attendance: student.attendanceSummary ? `${Math.round(student.attendanceSummary.attendancePercentage)}%` : "100%",
    lastScore: "N/A"
  }));

  return <ParentDashboardClient childrenData={childrenData} parentName={session.user.name || "Parent"} />;
}
