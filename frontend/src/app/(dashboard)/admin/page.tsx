"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Plus, Pencil, Trash2, X, RefreshCw, LogOut,
  BookOpen, BookMarked, FlaskConical, Lightbulb
} from "lucide-react";
import { useRouter } from "next/navigation";

const API = "";

// ─── MODEL CONFIGS ────────────────────────────────────────────────────────────
const MODELS = [
  {
    id: "topics", name: "Mavzular", endpoint: "/api/topics",
    icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50",
    displayKey: "title",
    subKey: (item: any) => item.contentMd?.slice(0, 80) + "..." || "—",
    fields: [
      { name: "title", label: "Mavzu sarlavhasi", type: "text", placeholder: "Masalan: Hujayraning tuzilishi", required: true },
      { name: "gradeLevel", label: "Sinf", type: "number", placeholder: "Masalan: 9", required: false },
      { name: "videoUrl", label: "Video URL (ixtiyoriy)", type: "text", placeholder: "https://youtube.com/...", required: false },
      { name: "contentMd", label: "Dars matni", type: "textarea", placeholder: "Bu yerga mavzu mazmunini yozing...", required: true, tall: true }
    ]
  },
  {
    id: "books", name: "Darsliklar", endpoint: "/api/books",
    icon: BookMarked, color: "text-purple-600", bg: "bg-purple-50",
    displayKey: "title",
    subKey: (item: any) => item.author || "Muallif ko'rsatilmagan",
    fields: [
      { name: "title", label: "Kitob nomi", type: "text", placeholder: "Masalan: Biologiya 9-sinf darsligi", required: true },
      { name: "author", label: "Muallif", type: "text", placeholder: "Masalan: Abduqodirov A.", required: false },
      { name: "coverUrl", label: "Muqova rasmi URL (ixtiyoriy)", type: "text", placeholder: "https://...", required: false },
      { name: "pdfUrl", label: "PDF fayl URL", type: "text", placeholder: "https://...kitob.pdf", required: true }
    ]
  },
  {
    id: "glossary", name: "Lug'at", endpoint: "/api/glossary",
    icon: FlaskConical, color: "text-teal-600", bg: "bg-teal-50",
    displayKey: "term",
    subKey: (item: any) => item.definition?.slice(0, 80) + "..." || "—",
    fields: [
      { name: "term", label: "Atama / So'z", type: "text", placeholder: "Masalan: Fotosintez", required: true },
      { name: "definition", label: "Ta'rif", type: "textarea", placeholder: "Atamaning to'liq ta'rifini yozing...", required: true, tall: true },
      { name: "imageUrl", label: "Rasm URL (ixtiyoriy)", type: "text", placeholder: "https://...", required: false }
    ]
  },
  {
    id: "facts", name: "Qiziqarli Faktlar", endpoint: "/api/facts",
    icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50",
    displayKey: "title",
    subKey: (item: any) => item.content?.slice(0, 80) + "..." || "—",
    fields: [
      { name: "title", label: "Sarlavha", type: "text", placeholder: "Masalan: Miya quvvati", required: true },
      { name: "content", label: "Fakt matni", type: "textarea", placeholder: "Qiziqarli fakt mazmunini yozing...", required: true, tall: true },
      { name: "category", label: "Turkum", type: "text", placeholder: "Masalan: BOTANIKA, ZOOLOGIYA, GENETIKA...", required: false },
      { name: "imageUrl", label: "Rasm URL (ixtiyoriy)", type: "text", placeholder: "https://...", required: false }
    ]
  }
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ModelConfig = typeof MODELS[0];
type Field = ModelConfig["fields"][0] & { tall?: boolean };

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(MODELS[0].id);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const router = useRouter();
  const model = MODELS.find(m => m.id === activeTab)!;

  // Auth check
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) { router.push("/login"); return; }
    const user = JSON.parse(userStr);
    if (user.role !== "SUPER_ADMIN") { router.push("/login"); return; }
    setIsAdmin(true);
  }, [router]);

  useEffect(() => { if (isAdmin) fetchItems(); }, [activeTab, isAdmin]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}${model.endpoint}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data?.[model.id] || []);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({});
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    const d: Record<string, string> = {};
    model.fields.forEach(f => { d[f.name] = item[f.name] ?? ""; });
    setFormData(d);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}${model.endpoint}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
        showToast("✅ Muvaffaqiyatli o'chirildi!");
      } else { alert("O'chirishda xatolik"); }
    } catch { alert("Tarmoq xatosi"); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `${API}${model.endpoint}/${editingItem.id}` : `${API}${model.endpoint}`;

      // Convert number fields
      const payload: Record<string, any> = { ...formData };
      model.fields.forEach(f => {
        if (f.type === "number" && payload[f.name]) payload[f.name] = Number(payload[f.name]);
      });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalOpen(false);
        showToast(editingItem ? "✅ Muvaffaqiyatli tahrirlandi!" : "✅ Muvaffaqiyatli qo'shildi!");
        fetchItems();
      } else {
        const err = await res.json();
        alert(err.error || "Saqlashda xatolik");
      }
    } catch { alert("Tarmoq xatosi"); } finally { setSaving(false); }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-6xl mx-auto w-full">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl font-semibold text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Boshqaruv Paneli</h1>
            <p className="text-gray-400 text-sm font-medium">Ma'lumotlarni qo'shish, tahrirlash, o'chirish</p>
          </div>
        </div>
        <button
          onClick={() => { localStorage.clear(); router.push("/login"); }}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Chiqish
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {MODELS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`p-2 rounded-xl ${active ? "bg-white/20" : tab.bg}`}>
                <Icon className={`w-4 h-4 ${active ? "text-white" : tab.color}`} />
              </div>
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-gray-900">{model.name}</h2>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
              {items.length} ta
            </span>
            <button onClick={fetchItems} className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-500" : ""}`} />
            </button>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Yangi qo'shish
          </button>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex justify-center p-16">
            <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className={`p-4 ${model.bg} rounded-2xl mb-4`}>
              <model.icon className={`w-8 h-8 ${model.color}`} />
            </div>
            <p className="text-gray-500 font-semibold">Hozircha hech nima yo'q</p>
            <p className="text-gray-400 text-sm mt-1">Birinchi yozuvni qo'shish uchun "Yangi qo'shish" tugmasini bosing</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className={`p-2.5 rounded-xl ${model.bg} flex-shrink-0 mt-0.5`}>
                  <model.icon className={`w-4 h-4 ${model.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 truncate">{item[model.displayKey] || "Nomsiz"}</div>
                  <div className="text-sm text-gray-400 truncate mt-0.5">{model.subKey(item)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold text-xs transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-semibold text-xs transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative z-10 bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${model.bg}`}>
                    <model.icon className={`w-5 h-5 ${model.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      {editingItem ? "Tahrirlash" : "Yangi qo'shish"}
                    </h3>
                    <p className="text-gray-400 text-xs">{model.name}</p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <div className="flex-1 overflow-y-auto p-6">
                <form id="crud-form" onSubmit={handleSave} className="space-y-4">
                  {model.fields.map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {!field.required && <span className="text-gray-400 text-xs ml-2">(ixtiyoriy)</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                          placeholder={field.placeholder}
                          required={field.required}
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 text-sm resize-none ${field.tall ? "h-44" : "h-28"}`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ""}
                          onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 text-sm font-medium"
                        />
                      )}
                    </div>
                  ))}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  form="crud-form"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
                  {editingItem ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
