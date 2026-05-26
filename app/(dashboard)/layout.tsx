import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name || "User",
    role: session.user.role as string,
    avatar: session.user.image || undefined,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col md:ml-[72px] lg:ml-[240px] transition-all duration-300">
        <Topbar user={user} />
        <main className="flex-1 p-6 max-w-content mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
