import MetricCard from "@/components/dashboard/MetricCard";
import { Users, FileText, Calendar, Clock, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-role-teacher to-purple-800 rounded-2xl p-8 text-white shadow-dropdown relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, Mr. Singh!</h1>
          <p className="text-white/80 max-w-lg">You have 2 classes today and 3 assignments pending grading. Have a great day ahead!</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={85}
          icon={Users}
          iconColor="text-role-student"
          iconBg="bg-role-student/10"
        />
        <MetricCard
          title="Classes Today"
          value={4}
          icon={Calendar}
          iconColor="text-role-teacher"
          iconBg="bg-role-teacher/10"
        />
        <MetricCard
          title="Pending Grading"
          value={12}
          icon={FileText}
          iconColor="text-status-warning-text"
          iconBg="bg-status-warning-bg"
        />
        <MetricCard
          title="Next Class"
          value="10:30 AM"
          icon={Clock}
          iconColor="text-primary"
          iconBg="bg-primary-light"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-text-primary">Today&apos;s Schedule</h3>
            <Link href="#" className="text-sm text-primary font-medium hover:underline">View Timetable</Link>
          </div>
          <div className="space-y-4">
            {[
              { time: "08:30 AM - 09:15 AM", subject: "Mathematics", class: "Class 10 - A", room: "Room 101", status: "completed" },
              { time: "10:30 AM - 11:15 AM", subject: "Mathematics", class: "Class 10 - B", room: "Room 102", status: "upcoming" },
              { time: "01:00 PM - 01:45 PM", subject: "Physics", class: "Class 9 - C", room: "Lab 2", status: "upcoming" },
            ].map((cls, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <div className={`w-2 h-12 rounded-full ${cls.status === "completed" ? "bg-status-success" : "bg-primary"}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{cls.subject}</h4>
                  <p className="text-sm text-text-secondary mt-0.5">{cls.class} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-text-primary block">{cls.time.split(" - ")[0]}</span>
                  <span className="text-xs text-text-muted">{cls.status === "completed" ? "Completed" : "Upcoming"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl shadow-card border border-border">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/teacher/attendance" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary-light transition-all group">
                <Users className="w-6 h-6 text-text-muted group-hover:text-primary mb-2 transition-colors" />
                <span className="text-xs font-medium text-text-primary">Attendance</span>
              </Link>
              <Link href="/teacher/assignments" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary-light transition-all group">
                <FileText className="w-6 h-6 text-text-muted group-hover:text-primary mb-2 transition-colors" />
                <span className="text-xs font-medium text-text-primary">Assignments</span>
              </Link>
              <Link href="/teacher/results" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary-light transition-all group">
                <BookOpen className="w-6 h-6 text-text-muted group-hover:text-primary mb-2 transition-colors" />
                <span className="text-xs font-medium text-text-primary">Results</span>
              </Link>
              <Link href="/teacher/discipline" className="flex flex-col items-center justify-center p-4 rounded-xl border border-status-danger/30 hover:border-status-danger hover:bg-status-danger-bg transition-all group">
                <div className="w-6 h-6 rounded-full bg-status-danger/10 flex items-center justify-center mb-2 group-hover:bg-status-danger transition-colors">
                  <span className="text-status-danger font-bold text-xs group-hover:text-white transition-colors">!</span>
                </div>
                <span className="text-xs font-medium text-status-danger-text">Report</span>
              </Link>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow-card border border-border">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Recent Submissions</h3>
            <div className="space-y-3">
              {[
                { name: "Rahul Kumar", task: "Math Worksheet", time: "10 mins ago" },
                { name: "Priya Sharma", task: "Math Worksheet", time: "1 hour ago" },
                { name: "Aman Singh", task: "Physics Lab", time: "2 hours ago" },
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition-colors cursor-pointer group">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{sub.name}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{sub.task}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">{sub.time}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
