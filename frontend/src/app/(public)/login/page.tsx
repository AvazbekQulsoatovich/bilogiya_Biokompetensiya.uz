"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Noto'g'ri ma'lumotlar");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        router.push("/topics");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">BioEdu</span>
          </Link>
        </div>

        <div className="glass p-8 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
          
          <h2 className="text-3xl font-bold mb-2">Xush Kelibsiz</h2>
          <p className="text-foreground/60 mb-8">O'rganishni davom ettirish uchun tizimga kiring.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Elektron pochta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  placeholder="ali@misol.uz"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground/80">Parol</label>
                <Link href="#" className="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Kirish
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-foreground/60">
            Akkauntingiz yo'qmi?{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
