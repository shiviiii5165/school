import MetricCard from "@/components/dashboard/MetricCard";
import { Users, UserCheck, IndianRupee, BellDot } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";

const AttendanceChart = dynamic(() => import("@/components/dashboard/AttendanceChart"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-surface border border-border rounded-xl animate-pulse flex items-center justify-center text-text-muted">Loading chart...</div>
});

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

  return (
    <div className="space-y-6">
      {/* Top Section - Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          iconColor="text-role-student"
          iconBg="bg-role-student/10"
          trend={{ value: 0, direction: "up", label: "Live data" }}
        />
        <MetricCard
          title="Attendance Today"
          value={`${attendancePercentage}%`}
          icon={UserCheck}
          iconColor="text-status-success-text"
          iconBg="bg-status-success-bg"
          trend={{ value: 0, direction: "up", label: "Live data" }}
        />
        <MetricCard
          title="Fee Collection"
          value="₹45.2L"
          icon={IndianRupee}
          iconColor="text-role-teacher"
          iconBg="bg-role-teacher/10"
          trend={{ value: 5.4, direction: "up", label: "vs last month" }}
        />
        <MetricCard
          title="Pending Actions"
          value={14}
          icon={BellDot}
          iconColor="text-status-warning-text"
          iconBg="bg-status-warning-bg"
          trend={{ value: 2, direction: "down", label: "vs yesterday" }}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div className="lg:col-span-1">
          {/* Recent Activity Feed */}
          <div className="bg-surface p-6 rounded-xl shadow-card border border-border h-full">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { title: "New Admission", desc: "Rahul Kumar (Class 10-A)", time: "10 mins ago", color: "bg-role-student" },
                { title: "Fee Payment", desc: "₹4,500 by Priya Sharma", time: "1 hour ago", color: "bg-status-success" },
                { title: "Discipline Report", desc: "Submitted by Mr. Singh", time: "2 hours ago", color: "bg-status-warning" },
                { title: "Notice Posted", desc: "Upcoming Mid-terms schedule", time: "5 hours ago", color: "bg-role-admin" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${activity.color} z-10 relative`} />
                    {i !== 3 && <div className="absolute top-2.5 left-[4px] w-px h-full bg-border" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{activity.title}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{activity.desc}</p>
                    <span className="text-[11px] text-text-muted mt-1 block">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/activity" className="text-sm text-primary font-medium hover:underline mt-6 block text-center">
              View All Activity
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Discipline Reports */}
        <div className="bg-surface p-6 rounded-xl shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
              Discipline Center <span className="bg-status-danger-bg text-status-danger-text text-xs px-2 py-0.5 rounded-full">3 pending</span>
            </h3>
            <Link href="/admin/discipline" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-medium">RK</div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Rahul Kumar <span className="text-xs text-text-muted font-normal ml-1">Class 10-A</span></h4>
                    <span className="text-xs text-status-warning-text bg-status-warning-bg px-2 py-0.5 rounded mt-1 inline-block">Mobile Use in Class</span>
                  </div>
                </div>
                <span className="text-xs text-text-muted">Today, 10:45 AM</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Defaulters */}
        <div className="bg-surface p-6 rounded-xl shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-text-primary">Fee Defaulters</h3>
            <Link href="/admin/fees" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-background">
                <tr>
                  <th className="px-4 py-2 rounded-l-lg font-medium">Student</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 rounded-r-lg font-medium text-right">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Aarav Singh", class: "10-A", amount: "₹4,500", date: "10 Nov 2024" },
                  { name: "Vivaan Patel", class: "9-C", amount: "₹4,500", date: "10 Nov 2024" },
                  { name: "Aditya Verma", class: "11-Sci", amount: "₹5,200", date: "05 Nov 2024" },
                  { name: "Arjun Das", class: "8-B", amount: "₹3,800", date: "01 Nov 2024" },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{s.name}</div>
                      <div className="text-xs text-text-muted">{s.class}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-status-danger-text">{s.amount}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
