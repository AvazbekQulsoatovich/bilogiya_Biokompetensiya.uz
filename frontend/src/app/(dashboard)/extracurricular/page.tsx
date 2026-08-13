"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, X, ListTodo, CheckCircle } from "lucide-react";

export default function ExtracurricularPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newXp, setNewXp] = useState(50);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/extracurricular`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks(data?.tasks || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/extracurricular`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          xpReward: newXp
        })
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewTitle("");
        setNewDesc("");
        setNewXp(50);
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/extracurricular/${selectedTaskId}/submit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content: reportContent })
      });
      if (res.ok) {
        setIsSubmitModalOpen(false);
        setReportContent("");
        setSelectedTaskId(null);
        alert("Topshiriq muvaffaqiyatli yuborildi! XP qo'shildi.");
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi. Balki tizimga kirmagandirsiz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="bg-teal-500 rounded-[2rem] p-6 md:p-8 mb-8 text-white shadow-lg shadow-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Darsdan tashqari topshiriqlar</h1>
            <p className="text-white/80 mt-1">Mustaqil izlanishlar va amaliy ishlar orqali qo'shimcha XP ishlang.</p>
          </div>
        </div>

        {userRole === "SUPER_ADMIN" && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-white text-teal-600 hover:bg-teal-50 px-5 py-3 rounded-xl transition-all shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            Yangi Topshiriq
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <ListTodo className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hozircha topshiriqlar yo'q</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl border border-border/50 relative overflow-hidden group flex flex-col h-full hover:shadow-xl hover:shadow-teal-500/10 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-500" />
              
              <h3 className="text-xl font-bold mb-2">{task.title}</h3>
              <p className="text-foreground/60 text-sm mb-6 flex-grow whitespace-pre-wrap">
                {task.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                  <span>+{task.xpReward} XP</span>
                </div>
                
                <button 
                  onClick={() => { setSelectedTaskId(task.id); setIsSubmitModalOpen(true); }}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-teal-500/20 text-sm font-medium"
                >
                  Boshlash
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Admin Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border/50 p-6 rounded-3xl shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Yangi Topshiriq</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sarlavha</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Masalan: Biologiya muzeyiga tashrif"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Ta'rif</label>
                <textarea 
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Batafsil ma'lumot..."
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Beriladigan XP</label>
                <input 
                  type="number" 
                  required
                  min={1}
                  value={newXp}
                  onChange={(e) => setNewXp(parseInt(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 rounded-xl shadow-lg"
              >
                Yaratish
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Student Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border/50 p-6 rounded-3xl shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => { setIsSubmitModalOpen(false); setReportContent(""); }}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-2">Hisobot topshirish</h2>
            <p className="text-foreground/60 text-sm mb-6">Topshiriqni bajarganingiz haqida qisqacha ma'lumot yozing.</p>
            <form onSubmit={handleSubmitReport}>
              <div className="mb-6">
                <textarea 
                  required
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  placeholder="Men bugun muzeyga bordim va..."
                  rows={4}
                />
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl shadow-lg"
              >
                {submitting ? "Yuborilmoqda..." : <><CheckCircle className="w-5 h-5" /> Yuborish va XP olish</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

