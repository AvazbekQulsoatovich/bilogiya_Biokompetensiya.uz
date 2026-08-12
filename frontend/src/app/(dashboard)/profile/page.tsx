"use client";

import { useState, useEffect } from "react";
import { User, Camera, Edit2, Shield, Activity, Star, Save } from "lucide-react";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load local profile
    const localUser = localStorage.getItem("userProfile");
    if (localUser) {
      const u = JSON.parse(localUser);
      setFirstName(u.firstName || "");
      setLastName(u.lastName || "");
    }
    setXp(parseInt(localStorage.getItem("userXP") || "0"));
    setLevel(parseInt(localStorage.getItem("userLevel") || "1"));
  }, []);

  const handleSave = () => {
    const profile = { firstName, lastName, xp, level };
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsEditing(false);
    
    // Trigger event for sidebar to update
    window.dispatchEvent(new Event('profileUpdated'));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-slate-500/10 rounded-2xl">
          <User className="w-8 h-8 text-slate-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mening Profilim</h1>
          <p className="text-foreground/60 mt-1">Shaxsiy ma'lumotlar va yutuqlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          {/* Avatar Card */}
          <div className="glass rounded-3xl border border-border/50 p-6 text-center shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-5xl text-white font-bold shadow-lg">
                {firstName?.[0] || 'U'}
              </div>
            </div>
            <h2 className="text-2xl font-bold">{firstName || 'Foydalanuvchi'} {lastName}</h2>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{level}-daraja</span>
            </div>
          </div>

          {/* Stats Card */}
          <div className="glass rounded-3xl border border-border/50 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg mb-4">Statistika</h3>
            
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Star className="w-5 h-5 text-orange-500" />
                </div>
                <span className="font-medium">XP Ballar</span>
              </div>
              <span className="font-bold text-lg">{xp}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-medium">Topshiriqlar</span>
              </div>
              <span className="font-bold text-lg">0</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {/* Details Card */}
          <div className="glass rounded-3xl border border-border/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">Shaxsiy Ma'lumotlar</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Tahrirlash
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" /> Saqlash
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">Ism (Taxallus)</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-background/50 rounded-xl border border-transparent font-medium">
                      {firstName || "Ko'rsatilmagan"}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">Familiya</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Familiyangiz (ixtiyoriy)"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-background/50 rounded-xl border border-transparent font-medium">
                      {lastName || "Ko'rsatilmagan"}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 text-blue-700 items-start">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Maxfiylik:</strong> Ushbu ma'lumotlar faqat sizning qurilmangizda saqlanadi va serverga yuborilmaydi. Reytingda shu ism orqali ko'rinasiz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
