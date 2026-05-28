import { prisma } from "@/lib/prisma";
import AdminFeesClient from "./AdminFeesClient";

export default async function AdminFeesPage() {
  const fees = await prisma.feeRecord.findMany({
    orderBy: { dueDate: 'desc' }
  });

  const students = await prisma.student.findMany({
    where: {
      id: {
        in: fees.map(f => f.studentId)
      }
    },
    include: {
      user: true,
      class: true
    }
  });

  const studentMap = new Map(students.map(s => [s.id, s]));

  const data = fees.map(fee => {
    const student = studentMap.get(fee.studentId);
    return {
      id: fee.id,
      studentName: student?.user.name || "Unknown",
      rollNo: student?.rollNo || "N/A",
      className: student?.class ? `${student.class.name} - ${student.class.section}` : "N/A",
      amount: fee.amount,
      feeType: fee.feeType,
      dueDate: fee.dueDate,
      status: fee.status,
    };
  });

  const stats = {
    totalCollection: fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0),
    pendingDues: fees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0),
    overdue: fees.filter(f => f.status === 'OVERDUE').reduce((sum, f) => sum + f.amount, 0),
  };

  return <AdminFeesClient data={data} stats={stats} />;
}
