"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, UserCog, GraduationCap, 
  CreditCard, ShieldAlert, FileText, ClipboardList,
  Settings, LogOut, ChevronLeft, ChevronRight, BookOpen,
  CalendarDays, Mail, FileCheck2, ShieldCheck, HelpCircle,
  Trophy
} from "lucide-react";
import { signOut } from "next-auth/react";

const getNavItems = (role: string) => {
  switch (role) {
    case "ADMIN":
      return [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Attendance", href: "/admin/attendance", icon: FileCheck2 },
        { label: "Students", href: "/admin/students", icon: Users },
        { label: "Teachers", href: "/admin/teachers", icon: UserCog },
        { label: "Fees", href: "/admin/fees", icon: CreditCard },
        { label: "Exams", href: "/admin/exams", icon: Trophy },
        { label: "Discipline Center", href: "/admin/discipline", icon: ShieldAlert, alert: true },
        { label: "Reports", href: "/admin/reports", icon: FileText },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ];
    case "TEACHER":
      return [
        { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
        { label: "Attendance", href: "/teacher/attendance", icon: FileCheck2 },
        { label: "Assignments", href: "/teacher/assignments", icon: BookOpen },
        { label: "Exams", href: "/teacher/exams", icon: Trophy },
        { label: "Discipline", href: "/teacher/discipline", icon: ShieldAlert },
        { label: "Timetable", href: "/teacher/timetable", icon: CalendarDays },
      ];
    case "STUDENT":
      return [
        { label: "Dashboard", href: "/student", icon: LayoutDashboard },
        { label: "Attendance", href: "/student/attendance", icon: FileCheck2 },
        { label: "Assignments", href: "/student/assignments", icon: BookOpen },
        { label: "Exams", href: "/student/exams", icon: Trophy },
        { label: "Results", href: "/student/results", icon: FileText },
        { label: "Notices", href: "/student/notices", icon: ClipboardList },
        { label: "Fees", href: "/student/fees", icon: CreditCard },
      ];
    case "PARENT":
      return [
        { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
        { label: "Child Attendance", href: "/parent/attendance", icon: FileCheck2 },
        { label: "Child Exams", href: "/parent/exams", icon: Trophy },
        { label: "Child Results", href: "/parent/results", icon: FileText },
        { label: "Fees", href: "/parent/fees", icon: CreditCard },
        { label: "Messages", href: "/parent/messages", icon: Mail },
      ];
    default:
      return [];
  }
};

export default function Sidebar({ user }: { user: { name: string; role: string; avatar?: string } }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const navItems = getNavItems(user.role);

  const roleColors: Record<string, string> = {
    ADMIN: "bg-role-admin",
    TEACHER: "bg-role-teacher",
    STUDENT: "bg-role-student",
    PARENT: "bg-role-parent",
  };

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 72 : 240 }}
      className="h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="bg-primary p-2 rounded-lg flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="font-display font-bold text-lg text-text-primary">EduCore</span>}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-text-secondary">{user.name.charAt(0)}</span>
            )}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary truncate">{user.name}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${roleColors[user.role]}`} />
                <span className="text-xs text-text-muted capitalize">{user.role.toLowerCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} prefetch={true}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden whitespace-nowrap ${
                  isActive
                    ? "bg-primary-light text-primary font-medium"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : "text-text-muted group-hover:text-text-secondary"}`} />
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {item.alert && !collapsed && (
                  <div className="w-2 h-2 rounded-full bg-status-warning mr-1" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-border flex flex-col gap-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-status-danger hover:bg-status-danger-bg transition-all whitespace-nowrap overflow-hidden`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 w-full rounded-lg hover:bg-background text-text-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}
