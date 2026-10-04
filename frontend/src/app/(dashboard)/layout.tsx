import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { GlobalAudio } from "@/components/GlobalAudio";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="md:ml-72 min-h-screen flex flex-col min-w-0 overflow-x-clip">
        <Topbar />
        <main className="flex-1 pt-14 md:pt-0">{children}</main>
      </div>
      <GlobalAudio />
    </div>
  );
}
