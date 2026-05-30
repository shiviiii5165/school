import { 
  LayoutDashboard, Users, UserCog, GraduationCap, 
  CreditCard, ShieldAlert, FileText, ClipboardList,
  Settings, LogOut, ChevronLeft, ChevronRight, BookOpen,
  CalendarDays, Mail, FileCheck2, ShieldCheck, HelpCircle,
  Trophy
} from "lucide-react";

export const getNavItems = (role: string) => {
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
