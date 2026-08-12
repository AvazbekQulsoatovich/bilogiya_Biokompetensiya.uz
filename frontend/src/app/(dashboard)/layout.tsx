import { Sidebar } from "@/components/Sidebar";
import { GlobalAudio } from "@/components/GlobalAudio";
import { ThemeWrapper } from "@/components/ThemeWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full md:ml-72 md:w-[calc(100%-18rem)] min-h-screen flex flex-col pt-16 md:pt-0">
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </div>
      <GlobalAudio />
    </div>
  );
}
