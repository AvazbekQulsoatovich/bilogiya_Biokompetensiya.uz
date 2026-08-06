"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BookOpen, Home, Microscope, BrainCircuit, Activity, LogIn, UserPlus, 
  ClipboardList, LayoutGrid, Library, Lightbulb, Trophy, Gamepad2, Box, Medal, Target, Settings, Menu, X, LogOut, User, FileText, BookMarked
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

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
      if (userStr) {
        setUserProfile(JSON.parse(userStr));
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('profileUpdated', checkAuth);
    return () => window.removeEventListener('profileUpdated', checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const menuItems = [
    { name: "Asosiy", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Profilim", href: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Mavzular", href: "/topics", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Darsliklar", href: "/books", icon: <BookMarked className="w-5 h-5" /> },
    { name: "Virtual Laboratoriyalar", href: "/labs", icon: <Microscope className="w-5 h-5" /> },
    { name: "3D Modellar", href: "/models", icon: <Box className="w-5 h-5" /> },
    { name: "Test Topshiriqlari", href: "/quizzes", icon: <ClipboardList className="w-5 h-5" /> },
    { name: "Darsdan tashqari topshiriqlar", href: "/extracurricular", icon: <FileText className="w-5 h-5" /> },
    { name: "Krossvordlar", href: "/crosswords", icon: <LayoutGrid className="w-5 h-5" /> },
    { name: "O'yinlar", href: "/games", icon: <Gamepad2 className="w-5 h-5" /> },
    { name: "AI Yordamchi", href: "/tutor", icon: <BrainCircuit className="w-5 h-5" /> },
    { name: "Lug'at", href: "/glossary", icon: <Library className="w-5 h-5" /> },
    { name: "Qiziqarli Faktlar", href: "/facts", icon: <Lightbulb className="w-5 h-5" /> },
    { name: "O'zlashtirish", href: "/progress", icon: <Activity className="w-5 h-5" /> },
    { name: "Yutuqlar", href: "/achievements", icon: <Trophy className="w-5 h-5" /> },
    { name: "Reyting", href: "/leaderboard", icon: <Medal className="w-5 h-5" /> },
    { name: "Mening Maqsadlarim", href: "/goals", icon: <Target className="w-5 h-5" /> },
    { name: "Qo'llanma", href: "/guide", icon: <FileText className="w-5 h-5" /> },
    { name: "Sozlamalar", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const authItems = [
    { name: "Tizimga kirish", href: "/login", icon: <LogIn className="w-5 h-5" /> },
    { name: "Ro'yxatdan o'tish", href: "/register", icon: <UserPlus className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-[60] print:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2.5 glass bg-background/50 backdrop-blur-xl rounded-xl border border-border/50 shadow-sm"
        >
          {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        print:hidden
        w-64 h-screen fixed left-0 top-0 bg-background border-r border-border shadow-[0_0_30px_rgba(0,0,0,0.05)] flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <Logo className="scale-90" />
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-4 px-2">Menyu</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                isActive 
                  ? "text-primary-600 font-bold bg-primary-500/10 shadow-sm" 
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary-500/10 rounded-xl border border-primary-500/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
        {userProfile?.role === "SUPER_ADMIN" && (
          <>
            <div className="text-xs font-semibold text-red-500/80 uppercase tracking-wider mt-6 mb-2 px-2">Admin</div>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                pathname === "/admin" 
                  ? "text-red-600 font-bold bg-red-500/10 shadow-sm" 
                  : "text-red-500/70 hover:text-red-500 hover:bg-red-500/5"
              }`}
            >
              {pathname === "/admin" && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-red-500/10 rounded-xl border border-red-500/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10"><Settings className="w-5 h-5" /></span>
              <span className="relative z-10">Boshqaruv Paneli</span>
            </Link>
          </>
        )}
      </div>

      {/* Auth Menu & Theme Toggle */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">Rejim</span>
          <ThemeToggle />
        </div>
        {isAuthenticated ? (
          <div className="space-y-2">
            <Link 
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-foreground/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center shrink-0">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-foreground/50" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-foreground truncate">{userProfile?.firstName || "Foydalanuvchi"}</span>
                <span className="text-xs text-foreground/50 truncate">{userProfile?.email || "Tahrirlash"}</span>
              </div>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Tizimdan chiqish</span>
            </button>
          </div>
        ) : (
          authItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))
        )}
      </div>
    </aside>
    </>
  );
}
