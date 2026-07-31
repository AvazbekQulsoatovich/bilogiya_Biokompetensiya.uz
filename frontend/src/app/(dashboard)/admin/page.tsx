"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, BrainCircuit, Wand2, Search, CheckCircle2, Save, FileJson } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("QUIZ"); // QUIZ, CROSSWORD, LAB, GAME
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "SUPER_ADMIN") {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setGeneratedData(null);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ type: activeTab, prompt })
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedData(data);
      } else {
        setMessage("Kechirasiz, xatolik yuz berdi.");
      }
    } catch (err) {
      setMessage("Tarmoq xatosi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;
    
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      if (activeTab === "CROSSWORD") endpoint = "/api/admin/crosswords";
      if (activeTab === "GAME") endpoint = "/api/admin/games";
      if (activeTab === "LAB") endpoint = "/api/admin/labs";
      if (activeTab === "QUIZ") endpoint = "/api/admin/quizzes"; // Need to implement in backend, but mock for now

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(generatedData)
      });
      
      if (res.ok) {
        setMessage("Ma'lumotlar muvaffaqiyatli saqlandi!");
        setGeneratedData(null);
        setPrompt("");
      } else {
        setMessage("Saqlashda xatolik yuz berdi.");
      }
    } catch (err) {
      setMessage("Tarmoq xatosi.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="glass p-8 rounded-3xl text-center">
          <Settings className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">Ruxsat yo'q</h2>
          <p className="text-foreground/60 mt-2">Bu sahifaga faqat Super Admin kira oladi.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "QUIZ", name: "Testlar" },
    { id: "CROSSWORD", name: "Krossvordlar" },
    { id: "LAB", name: "Virtual Lab" },
    { id: "GAME", name: "O'yinlar" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
              Boshqaruv Paneli
            </h1>
            <p className="text-foreground/60 mt-1 font-medium text-sm md:text-base">Sun'iy Intelekt yordamida avtomatik kontent yaratish</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setGeneratedData(null); setPrompt(""); }}
            className={`px-6 py-3.5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                : 'glass hover:bg-foreground/5 text-foreground/70 hover:text-foreground'
            }`}
          >
            {activeTab === tab.id && <Wand2 className="w-4 h-4" />}
            {tab.name} yaratish
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input */}
        <div className="lg:col-span-5 glass p-6 md:p-8 rounded-[2rem] border border-indigo-500/20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-indigo-500" />
            </div>
            AI Prompt (So'rov)
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-3 ml-1">
                Nima haqida yaratmoqchisiz?
              </label>
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Masalan: "Odam anatomiyasi haqida o'rta qiyinlikdagi ${tabs.find(t=>t.id===activeTab)?.name.toLowerCase()} tuzib ber"`}
                  className="w-full h-40 p-5 bg-background/50 border-2 border-border/50 rounded-2xl focus:border-indigo-500 focus:bg-background outline-none resize-none transition-all custom-scrollbar shadow-inner text-foreground/90 placeholder:text-foreground/40"
                  required
                />
                <div className="absolute bottom-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Wand2 className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI o'ylamoqda...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-6 h-6" />
                  Yaratish (Generate)
                </>
              )}
            </button>
          </form>

          {message && !generatedData && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-medium text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {message}
            </div>
          )}
        </div>

        {/* Right: Preview & Save */}
        <div className="lg:col-span-7 glass p-6 md:p-8 rounded-[2rem] border border-border/50 flex flex-col min-h-[500px] lg:h-[600px] shadow-2xl bg-gradient-to-b from-background/40 to-background/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 shrink-0">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Search className="w-6 h-6 text-emerald-500" />
            </div>
            Natija (Oldindan ko'rish)
          </h2>

          <div className="flex-1 overflow-y-auto bg-card/50 rounded-2xl border border-border/50 p-5 mb-6 custom-scrollbar shadow-inner relative group">
            {generatedData ? (
              <pre className="text-sm text-foreground/80 font-mono whitespace-pre-wrap">
                {JSON.stringify(generatedData, null, 2)}
              </pre>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/40">
                <div className="w-24 h-24 mb-4 rounded-full bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <FileJson className="w-10 h-10 text-foreground/30" />
                </div>
                <p className="font-medium text-lg">Natija bu yerda ko'rinadi</p>
                <p className="text-sm mt-1 opacity-70">Chap tomondan so'rov yuboring</p>
              </div>
            )}
          </div>

          {message && generatedData && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold flex items-center gap-3"
            >
              <div className="p-1 bg-emerald-500/20 rounded-full">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              </div>
              {message}
            </motion.div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !generatedData}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {saving ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-6 h-6" />
            )}
            <span className="text-lg">Bazaga Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  );
}
