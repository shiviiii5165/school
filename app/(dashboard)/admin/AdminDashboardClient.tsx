"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { Users, UserCheck, IndianRupee, BellDot } from "lucide-react";
import Link from "next/link";
import TodayAttendanceTable from "@/components/admin/dashboard/TodayAttendanceTable";

export default function AdminDashboardClient({ 
  totalStudents, 
  attendancePercentage, 
  classesMarked, 
  totalClassesCount,
  pendingActionsCount,
  totalFeeCollection,
  pendingDiscipline,
  feeDefaulters,
  recentActivity
}: { 
  totalStudents: number, 
  attendancePercentage: number, 
  classesMarked: number, 
  totalClassesCount: number,
  pendingActionsCount: number,
  totalFeeCollection: number,
  pendingDiscipline: any[],
  feeDefaulters: any[],
  recentActivity: any[]
}) {
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
          trend={{ value: 0, direction: "up", label: `${classesMarked}/${totalClassesCount} classes marked today` }}
        />
        <MetricCard
          title="Fee Collection"
          value={`₹${(totalFeeCollection / 100000).toFixed(2)}L`}
          icon={IndianRupee}
          iconColor="text-role-teacher"
          iconBg="bg-role-teacher/10"
          trend={{ value: 5.4, direction: "up", label: "vs last month" }}
        />
        <MetricCard
          title="Pending Actions"
          value={pendingActionsCount}
          icon={BellDot}
          iconColor="text-status-warning-text"
          iconBg="bg-status-warning-bg"
          trend={{ value: 0, direction: "up", label: "Live data" }}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <TodayAttendanceTable />
        </div>
        <div className="lg:col-span-1">
          {/* Recent Activity Feed */}
          <div className="bg-surface p-6 rounded-xl shadow-card border border-border h-full">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivity.map((activity, i) => {
                const timeAgo = Math.floor((new Date().getTime() - new Date(activity.time).getTime()) / 60000);
                const timeString = timeAgo < 60 ? `${timeAgo} mins ago` : timeAgo < 1440 ? `${Math.floor(timeAgo/60)} hours ago` : `${Math.floor(timeAgo/1440)} days ago`;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="relative mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${activity.color} z-10 relative`} />
                      {i !== recentActivity.length - 1 && <div className="absolute top-2.5 left-[4px] w-px h-full bg-border" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{activity.title}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{activity.desc}</p>
                      <span className="text-[11px] text-text-muted mt-1 block">{timeString}</span>
                    </div>
                  </div>
                );
              })}
              {recentActivity.length === 0 && <p className="text-sm text-text-muted">No recent activity.</p>}
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
              Discipline Center {pendingActionsCount > 0 && <span className="bg-status-danger-bg text-status-danger-text text-xs px-2 py-0.5 rounded-full">{pendingActionsCount} pending</span>}
            </h3>
            <Link href="/admin/discipline" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {pendingDiscipline.map((report) => {
              const initials = report.studentName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
              const dateObj = new Date(report.time);
              const isToday = dateObj.toDateString() === new Date().toDateString();
              const timeStr = isToday ? `Today, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : dateObj.toLocaleDateString();
              
              return (
                <div key={report.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-medium">{initials}</div>
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{report.studentName} <span className="text-xs text-text-muted font-normal ml-1">{report.className}</span></h4>
                      <span className="text-xs text-status-warning-text bg-status-warning-bg px-2 py-0.5 rounded mt-1 inline-block">{report.category}</span>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted">{timeStr}</span>
                </div>
              );
            })}
            {pendingDiscipline.length === 0 && <p className="text-sm text-text-muted text-center py-4">No pending discipline reports.</p>}
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
                {feeDefaulters.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{s.studentName}</div>
                      <div className="text-xs text-text-muted">{s.className}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-status-danger-text">₹{s.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{new Date(s.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
                {feeDefaulters.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-text-muted">No fee defaulters found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
