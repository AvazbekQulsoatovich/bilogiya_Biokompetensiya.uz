import { Sidebar } from "@/components/Sidebar";
import { GlobalAudio } from "@/components/GlobalAudio";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full md:ml-64 md:w-[calc(100%-16rem)] min-h-screen flex flex-col pt-16 md:pt-0">
        {children}
      </div>
      <GlobalAudio />
    </div>
  );
}
