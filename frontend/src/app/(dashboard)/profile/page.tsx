"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatarUrl: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "",
          avatarUrl: data.avatarUrl || ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsError(false);
        setMessage("Ma'lumotlar muvaffaqiyatli saqlandi!");
        // Update local storage user info
        const updatedUser = await res.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify Sidebar to update avatar
        window.dispatchEvent(new Event('profileUpdated'));
        
        // Clear password field
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        setIsError(true);
        if (res.status === 413) {
          setMessage("Rasm hajmi juda katta!");
        } else {
          setMessage("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
        }
      }
    } catch (err) {
      setIsError(true);
      setMessage("Tarmoq xatosi!");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 max-w-4xl mx-auto w-full animate-pulse flex flex-col gap-6">
      <div className="w-full h-32 glass rounded-3xl"></div>
      <div className="w-full h-96 glass rounded-3xl"></div>
    </div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 relative z-10">
          <User className="w-8 h-8 text-primary-500" />
          Mening Profilim
        </h1>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-background flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-foreground/20" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
                <Camera className="w-8 h-8" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-sm text-foreground/50 mt-3">Rasmni almashtirish uchun ustiga bosing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70">Ism</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-foreground"
                  placeholder="Ismingiz"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/70">Familiya</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-foreground"
                  placeholder="Familiyangiz"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-foreground/70">Elektron pochta (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-foreground"
                  placeholder="email@misol.com"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-foreground/70">Yangi Parol (ixtiyoriy)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-foreground"
                  placeholder="Yangi parolni kiriting (o'zgartirish uchun)"
                />
              </div>
              <p className="text-xs text-foreground/50">Agar parolni o'zgartirishni xohlamasangiz, bu joyni bo'sh qoldiring.</p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <div className="flex-1">
              {message && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-2 font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
                  {isError ? <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> : <CheckCircle2 className="w-5 h-5" />}
                  {message}
                </motion.div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-primary text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Saqlash
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
