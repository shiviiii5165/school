"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const getPageTitle = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "Dashboard";
  
  const lastPart = parts[parts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

export default function Topbar({ user }: { user: { name: string; role: string; avatar?: string } }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="text-xl font-display font-bold text-text-primary">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-secondary hover:bg-background rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full border-2 border-surface"></span>
          </button>

          <div className="h-8 w-px bg-border"></div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-text-primary leading-tight">{user.name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm mt-0.5 ${
                user.role === 'ADMIN' ? 'bg-role-admin text-white' :
                user.role === 'TEACHER' ? 'bg-role-teacher text-white' :
                user.role === 'STUDENT' ? 'bg-role-student text-white' :
                'bg-role-parent text-white'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center overflow-hidden border-2 border-surface shadow-sm">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-text-secondary">{user.name.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
