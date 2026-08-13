"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, User, Bell, Globe, Volume2, Shield, Monitor, Sun, Lock, Save, Loader2, Music } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("system");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // System State (LocalStorage)
  const [system, setSystem] = useState({
    language: "O'zbek (Lotin)",
    soundEffects: true,
    backgroundMusic: false,
  });

  // Notifications State (LocalStorage)
  const [notifications, setNotifications] = useState({
    newLessons: true,
    dailyReminders: true,
    achievements: false,
    news: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      // Load System Settings
      const savedLang = localStorage.getItem("bioedu_lang");
      const savedSound = localStorage.getItem("bioedu_sound");
      const savedMusic = localStorage.getItem("bioedu_music");
      
      setSystem({
        language: savedLang || "O'zbek (Lotin)",
        soundEffects: savedSound !== "false",
        backgroundMusic: savedMusic === "true",
      });

      // Load Notifications
      const savedNotifs = localStorage.getItem("bioedu_notifications");
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      }

      if (storedToken) fetchProfile(storedToken);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/me`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: localStorage.getItem("bioedu_phone") || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Save phone to localStorage as it is not in the DB schema currently
      localStorage.setItem("bioedu_phone", profile.phone);
      
      const res = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email
        })
      });
      if (res.ok) {
        alert("Profil muvaffaqiyatli saqlandi!");
      } else {
        alert("Xatolik yuz berdi.");
      }
    } catch (error) {
      alert("Tarmoq xatosi.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("Yangi parollar mos emas!");
      return;
    }
    if (security.newPassword.length < 6) {
      alert("Parol kamida 6ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          password: security.newPassword
        })
      });
      if (res.ok) {
        alert("Parol muvaffaqiyatli yangilandi!");
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert("Parolni yangilashda xatolik yuz berdi.");
      }
    } catch (error) {
      alert("Tarmoq xatosi.");
    } finally {
      setSaving(false);
    }
  };

  const updateSystem = (key: string, value: any) => {
    const updated = { ...system, [key]: value };
    setSystem(updated);
    if (key === 'language') localStorage.setItem("bioedu_lang", value);
    if (key === 'soundEffects') localStorage.setItem("bioedu_sound", String(value));
    if (key === 'backgroundMusic') {
      localStorage.setItem("bioedu_music", String(value));
      window.dispatchEvent(new Event("bioedu_music_changed"));
    }
  };

  const updateNotification = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem("bioedu_notifications", JSON.stringify(updated));
  };

  const allTabs = [
    { id: "system", name: "Tizim sozlamalari", icon: <Monitor className="w-5 h-5" /> },
    { id: "profile", name: "Profil sozlamalari", icon: <User className="w-5 h-5" />, requiresAuth: true },
    { id: "notifications", name: "Bildirishnomalar", icon: <Bell className="w-5 h-5" /> },
    { id: "security", name: "Xavfsizlik", icon: <Shield className="w-5 h-5" />, requiresAuth: true },
  ];
  
  const tabs = allTabs.filter(t => !t.requiresAuth || !!token);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-8 rounded-3xl border border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="p-2.5 bg-primary-500/10 rounded-xl">
                <Settings className="w-6 h-6 text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold font-serif">Sozlamalar</h1>
            </div>
            
            <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-left ${
                    activeTab === tab.id 
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/20 font-medium" 
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-background/50 rounded-2xl border border-border/50 p-6 md:p-8 min-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "system" && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-secondary-500" /> Ovoz va Effektlar
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                          <div>
                            <p className="font-medium">O'yin effektlari</p>
                            <p className="text-sm text-foreground/50">Test ishlash va yutuqlardagi ovozlar</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={system.soundEffects} 
                              onChange={(e) => updateSystem("soundEffects", e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                          <div>
                            <p className="font-medium flex items-center gap-2">Orqa fon musiqasi {system.backgroundMusic && <Music className="w-4 h-4 text-primary-500 animate-pulse" />}</p>
                            <p className="text-sm text-foreground/50">Platformada sokin musiqa chalib turishi</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={system.backgroundMusic} 
                              onChange={(e) => updateSystem("backgroundMusic", e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <hr className="border-border/50" />

                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-secondary-500" /> Mavzu (Theme)
                      </h2>
                      <p className="text-sm text-foreground/60 mb-4">Tizim ko'rinishini o'zgartirish uchun chap tomon quyi qismidagi rejim tugmasidan foydalaning.</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Shaxsiy ma'lumotlar</h2>
                    
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-3xl font-bold border-4 border-background shadow-lg uppercase">
                        {profile.firstName ? profile.firstName[0] : "U"}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors mb-2">
                          Rasm yuklash
                        </button>
                        <p className="text-xs text-foreground/50">Tez kunda ishga tushadi</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ism</label>
                        <input 
                          type="text" 
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Familiya</label>
                        <input 
                          type="text" 
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" 
                          placeholder="Familiyangizni kiriting" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Elektron pochta</label>
                        <input 
                          type="email" 
                          value={profile.email}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all opacity-50" 
                          disabled 
                        />
                        <p className="text-xs text-foreground/50">Pochtani o'zgartirish uchun qo'llab-quvvatlash xizmatiga yozing.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefon raqam</label>
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" 
                          placeholder="+998 90 123 45 67" 
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-secondary-500 text-primary-950 rounded-xl font-bold hover:bg-secondary-400 transition-colors shadow-lg shadow-secondary-500/20 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Saqlash
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Bildirishnomalar</h2>
                    <div className="space-y-4">
                      {[
                        { id: "newLessons", title: "Yangi darslar va laboratoriyalar", desc: "Platformaga yangi materiallar qo'shilganda xabar berish" },
                        { id: "dailyReminders", title: "Kunlik eslatmalar", desc: "O'qishni davom ettirish uchun kunlik eslatmalar" },
                        { id: "achievements", title: "Yutuqlar va reyting", desc: "Yangi darajaga chiqqanda yoki reytingda ko'tarilganda xabar berish" },
                        { id: "news", title: "Yangiliklar va yangilanishlar", desc: "Tizimdagi texnik va boshqa yangiliklar" }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-foreground/50">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={notifications[item.id as keyof typeof notifications]}
                              onChange={(e) => updateNotification(item.id, e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Xavfsizlik va Parol</h2>
                    
                    <div className="max-w-md space-y-4">
                      {/* Joriy parol hozircha tekshirilmaydi chunki backendda currentPassword verify endpointi yo'q */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Yangi parol</label>
                        <div className="relative">
                          <Lock className="w-5 h-5 absolute left-3 top-3.5 text-foreground/40" />
                          <input 
                            type="password" 
                            value={security.newPassword}
                            onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" 
                            placeholder="Yangi parolni kiriting" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Yangi parolni tasdiqlang</label>
                        <div className="relative">
                          <Lock className="w-5 h-5 absolute left-3 top-3.5 text-foreground/40" />
                          <input 
                            type="password" 
                            value={security.confirmPassword}
                            onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all" 
                            placeholder="Yangi parolni takrorlang" 
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={handleSaveSecurity}
                          disabled={saving}
                          className="w-full px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center"
                        >
                          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Parolni yangilash"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
