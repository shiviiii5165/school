import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";
export default async function AdminDashboard() {
  const totalStudents = await prisma.student.count();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAttendance = await prisma.attendance.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      }
    }
  });

  const presentCount = todayAttendance.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = todayAttendance.length > 0 
    ? Math.round((presentCount / todayAttendance.length) * 100) 
    : 100;

  const totalClassesCount = await prisma.class.count();
  const classesMarked = await prisma.dailyAttendanceLog.count({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      }
    }
  });

  const pendingActionsCount = await prisma.disciplineReport.count({
    where: { status: 'PENDING' }
  });

  const feeCollectionAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'SUCCESS' }
  });
  const totalFeeCollection = feeCollectionAgg._sum.amount || 0;

  const pendingDiscipline = await prisma.disciplineReport.findMany({
    where: { status: 'PENDING' },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      student: { include: { user: true, class: true } }
    }
  });

  const feeDefaulters = await prisma.feeRecord.findMany({
    where: { status: { in: ['PENDING', 'OVERDUE'] }, dueDate: { lt: new Date() } },
    take: 5,
    orderBy: { dueDate: 'asc' },
    include: {
      student: { include: { user: true, class: true } }
    }
  });

  const recentPayments = await prisma.payment.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { student: { include: { user: true, class: true } } }
  });

  const recentReports = await prisma.disciplineReport.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { student: { include: { user: true, class: true } }, teacher: { include: { user: true } } }
  });

  const recentAdmissions = await prisma.student.findMany({
    take: 3,
    orderBy: { admissionDate: 'desc' },
    include: { user: true, class: true }
  });

  const activity = [
    ...recentPayments.map(p => ({ type: 'FEE', title: 'Fee Payment', desc: `₹${p.amount} by ${p.student?.user?.name}`, time: p.createdAt, color: 'bg-status-success' })),
    ...recentReports.map(d => ({ type: 'DISCIPLINE', title: 'Discipline Report', desc: `Submitted by ${d.teacher?.user?.name || 'Staff'}`, time: d.createdAt, color: 'bg-status-warning' })),
    ...recentAdmissions.map(a => ({ type: 'ADMISSION', title: 'New Admission', desc: `${a.user?.name} (Class ${a.class?.name}-${a.class?.section})`, time: a.admissionDate, color: 'bg-role-student' }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  return (
    <AdminDashboardClient 
      totalStudents={totalStudents} 
      attendancePercentage={attendancePercentage} 
      classesMarked={classesMarked}
      totalClassesCount={totalClassesCount}
      pendingActionsCount={pendingActionsCount}
      totalFeeCollection={totalFeeCollection}
      pendingDiscipline={pendingDiscipline.map(d => ({
        id: d.id,
        studentName: d.student?.user?.name || 'Unknown',
        className: `${d.student?.class?.name || ''}-${d.student?.class?.section || ''}`,
        category: d.category,
        time: d.createdAt,
      }))}
      feeDefaulters={feeDefaulters.map(f => ({
        id: f.id,
        studentName: f.student?.user?.name || 'Unknown',
        className: `${f.student?.class?.name || ''}-${f.student?.class?.section || ''}`,
        amount: f.amount - f.paidAmount,
        dueDate: f.dueDate,
      }))}
      recentActivity={activity}
    />
  );
}
