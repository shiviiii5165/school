"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function LayoutClientWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: string; avatar?: string };
}) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Bottom nav is used for Teacher, Student, Parent on mobile
  const hasBottomNav = user.role !== "ADMIN";

  return (
    <div className="min-h-[100dvh] bg-background flex w-full relative overflow-x-hidden">
      {/* Sidebar (Desktop and Mobile Drawer) */}
      <Sidebar 
        user={user} 
        isOpenMobile={isMobileDrawerOpen} 
        onCloseMobile={() => setIsMobileDrawerOpen(false)} 
      />

      <div className={`flex-1 flex flex-col min-h-[100dvh] transition-all duration-300 w-full ml-0 md:ml-[72px] lg:ml-[240px] ${hasBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        <Topbar 
          user={user} 
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} 
        />
        <main className="flex-1 p-4 sm:p-6 max-w-content mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Non-Admins on Mobile */}
      {hasBottomNav && <BottomNav user={user} onOpenMore={() => setIsMobileDrawerOpen(true)} />}
    </div>
  );
}
