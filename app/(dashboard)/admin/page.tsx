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

  return (
    <AdminDashboardClient 
      totalStudents={totalStudents} 
      attendancePercentage={attendancePercentage} 
      classesMarked={classesMarked}
      totalClassesCount={totalClassesCount}
    />
  );
}
