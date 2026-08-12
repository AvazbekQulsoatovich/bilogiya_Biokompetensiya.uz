"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen, Home, Microscope,
  ClipboardList, LayoutGrid, Library, Lightbulb, Gamepad2, Box,
  Settings, Menu, X, LogOut, User, FileText, BookMarked, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

const menuItems = [
  { name: "Saytga qaytish", href: "/", icon: Home, color: "#1f2937", bg: "#f3f4f6" },
  { name: "Asosiy", href: "/dashboard", icon: LayoutGrid, color: "#3b82f6", bg: "#eff6ff" },
  { name: "Profilim", href: "/profile", icon: User, color: "#64748b", bg: "#f1f5f9", authOnly: true },
  { name: "Mavzular", href: "/topics", icon: BookOpen, color: "#6366f1", bg: "#eef2ff" },
  { name: "Darsliklar", href: "/books", icon: BookMarked, color: "#8b5cf6", bg: "#f5f3ff" },
  { name: "Virtual Laboratoriyalar", href: "/labs", icon: Microscope, color: "#10b981", bg: "#ecfdf5" },
  { name: "3D Modellar", href: "/models", icon: Box, color: "#a855f7", bg: "#faf5ff" },
  { name: "Test Topshiriqlari", href: "/quizzes", icon: ClipboardList, color: "#f97316", bg: "#fff7ed" },
  { name: "Darsdan tashqari", href: "/extracurricular", icon: FileText, color: "#14b8a6", bg: "#f0fdfa" },
  { name: "Krossvordlar", href: "/crosswords", icon: LayoutGrid, color: "#06b6d4", bg: "#ecfeff" },
  { name: "Interaktiv mashqlar", href: "/games", icon: Gamepad2, color: "#ec4899", bg: "#fdf2f8" },
  { name: "Lug'at", href: "/glossary", icon: Library, color: "#f43f5e", bg: "#fff1f2" },
  { name: "Qiziqarli faktlar", href: "/facts", icon: Lightbulb, color: "#f59e0b", bg: "#fffbeb" },
  { name: "Sozlamalar", href: "/settings", icon: Settings, color: "#374151", bg: "#f9fafb", adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      const userStr = localStorage.getItem("user");
      if (userStr) setUserProfile(JSON.parse(userStr));
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("profileUpdated", checkAuth);
    return () => window.removeEventListener("profileUpdated", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 flex flex-col items-center">
        <div className="rounded-3xl bg-white p-4 shadow-xl border border-gray-100 w-36 h-36 flex items-center justify-center">
          <div style={{ transform: "scale(2.5)", transformOrigin: "center" }}>
            <Logo />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Section label */}
      <div className="px-6 py-3">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Menyu</span>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
        {menuItems.map((item) => {
          if (item.authOnly && !isAuthenticated) return null;
          if (item.adminOnly && userProfile?.role !== "SUPER_ADMIN") return null;

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 group transition-all duration-200 relative border-b border-gray-100 last:border-b-0"
              style={{
                background: isActive ? item.color : "transparent",
                borderRadius: isActive ? "16px" : "0px"
              }}
            >
              {/* Hover background */}
              {!isActive && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: item.bg, borderRadius: "16px" }}
                />
              )}

              {/* Icon */}
              <div
                className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive ? "rgba(255,255,255,0.25)" : item.bg,
                  color: isActive ? "#fff" : item.color,
                  boxShadow: isActive ? `0 0 0 1px rgba(255,255,255,0.2) inset` : "none",
                }}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>

              {/* Name */}
              <span
                className="relative z-10 text-[14px] font-bold flex-1 transition-colors duration-200"
                style={{
                  color: isActive ? "#fff" : "#000",
                }}
              >
                {item.name}
              </span>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-dot"
                  className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover arrow */}
              {!isActive && (
                <ChevronRight
                  className="relative z-10 w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0"
                  style={{ color: item.color }}
                />
              )}
            </Link>
          );
        })}

        {/* Admin link */}
        {userProfile?.role === "SUPER_ADMIN" && (
          <>
            <div className="mx-2 my-3 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl group transition-all duration-200 relative"
              style={{ background: pathname === "/admin" ? "#dc2626" : "transparent" }}
            >
              {!( pathname === "/admin") && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-50" />
              )}
              <div className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center bg-red-100 text-red-500"
                style={{ background: pathname === "/admin" ? "rgba(255,255,255,0.25)" : "#fee2e2", color: pathname === "/admin" ? "#fff" : "#ef4444" }}>
                <Settings className="w-[18px] h-[18px]" />
              </div>
              <span className="relative z-10 text-[13.5px] font-semibold" style={{ color: pathname === "/admin" ? "#fff" : "#ef4444" }}>
                Boshqaruv Paneli
              </span>
            </Link>
          </>
        )}
      </div>

      {/* Logout */}
      {isAuthenticated && userProfile?.role === "SUPER_ADMIN" && (
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 font-semibold text-sm hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Tizimdan chiqish
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile button */}
      <div className="md:hidden fixed top-4 left-4 z-[60] print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          print:hidden w-72 h-screen fixed left-0 top-0 z-50
          bg-white border-r border-gray-100
          shadow-[4px_0_32px_rgba(0,0,0,0.05)]
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
