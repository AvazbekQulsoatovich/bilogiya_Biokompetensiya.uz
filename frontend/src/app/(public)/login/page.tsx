"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, Dna } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user?.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user?.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Login yoki parol noto'g'ri");
      }
    } catch {
      setError("Tarmoq xatosi. Server ishlayotganiga ishonch hosil qiling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ── LEFT PANEL (Decorative) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col items-center justify-center p-16 overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[80px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[80px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-400/15 blur-[60px]" />

        {/* Hex grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5L55 20v30L30 55 5 40V20z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-white/15 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
              <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Biokompetensiya.uz
          </h1>
          <p className="text-blue-100 text-lg font-medium max-w-sm mx-auto leading-relaxed">
            Biologiyani zamonaviy usulda o'rganing. 3D modellar, virtual laboratoriyalar va interaktiv testlar.
          </p>

          {/* Feature badges */}
          <div className="flex flex-col gap-3 mt-10">
            {[
              { emoji: "🔬", text: "Virtual laboratoriyalar" },
              { emoji: "🧬", text: "3D biologiya modellari" },
              { emoji: "📚", text: "Interaktiv darsliklar" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 text-white font-semibold text-sm">
                <span className="text-xl">{item.emoji}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 relative">

        {/* Mobile background */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >

          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src="/logo.png" alt="Logo" className="h-16 object-contain" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Xush kelibsiz! 👋
            </h2>
            <p className="text-gray-500 font-medium">
              Hisobingizga kiring yoki{" "}
              <button onClick={() => router.push("/register")} className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                ro'yxatdan o'ting
              </button>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Elektron pochta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@bioedu.uz"
                  className="w-full pl-11 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-semibold"
              >
                <span className="text-xl">⚠️</span>
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-base rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Kirish
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
            >
              ← Bosh sahifaga qaytish
            </button>
          </div>

          {/* Admin hint (small) */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <p className="text-xs text-blue-500 font-semibold">
              Admin: admin@bioedu.uz / admin
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
