import { prisma } from "@/lib/prisma";
import AdminStudentsClient from "./AdminStudentsClient";

export default async function AdminStudentsPage() {
  const students = await prisma.student.findMany({
    include: {
      user: true,
      class: true,
      attendanceSummary: true,
      disciplineReports: {
        where: { actionType: "SUSPENSION" },
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { rollNo: 'asc' }
  });

  const data = students.map(student => {
    // Check fee status
    // For simplicity without a complex query, we'll default to "PAID" for now
    // In a real system, you'd check FeeRecords.
    return {
      id: student.id,
      name: student.user.name,
      avatar: student.user.avatar || "",
      regId: student.user.regId,
      classInfo: student.class ? `${student.class.name} - ${student.class.section}` : "Unassigned",
      rollNo: student.rollNo,
      attendance: student.attendanceSummary?.attendancePercentage || 100,
      feeStatus: "PAID",
      status: student.isSuspended ? "SUSPENDED" : "ACTIVE",
    };
  });

  return <AdminStudentsClient data={data} />;
}
