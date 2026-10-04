"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, ListTodo, CheckCircle } from "lucide-react";
import { Page, PageHeader, EmptyState, CardGridSkeleton, Modal, Field } from "@/components/ui";

export default function ExtracurricularPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newXp, setNewXp] = useState(50);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [report, setReport] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    try {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
    } catch {}
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/extracurricular`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data?.tasks || []);
    } catch (e) {
      console.error("Topshiriqlarni yuklab boʻlmadi", e);
    } finally {
      setLoading(false);
    }
  };

  const authHeaders = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/extracurricular`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ title: newTitle, description: newDesc, xpReward: newXp }),
      });
      if (res.ok) {
        setIsCreateOpen(false);
        setNewTitle("");
        setNewDesc("");
        setNewXp(50);
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeSubmit = () => {
    setIsSubmitOpen(false);
    setReport("");
    setSelectedTask(null);
    setMessage(null);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/extracurricular/${selectedTask.id}/submit`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ content: report }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Javobingiz toʻgʻri! Barakalla!" });
        setTimeout(() => {
          closeSubmit();
          window.dispatchEvent(new Event("profileUpdated"));
        }, 1800);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: err.error || "Nomaʼlum xato yuz berdi." });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Tarmoq bilan muammo yuz berdi. Qayta urinib koʻring." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <PageHeader
        icon={FileText}
        eyebrow="Amaliyot"
        title="Darsdan tashqari topshiriqlar"
        subtitle="Mustaqil izlanish va amaliy ishlar orqali qoʻshimcha XP toʻplang."
        actions={
          userRole === "SUPER_ADMIN" && (
            <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" /> Yangi topshiriq
            </button>
          )
        }
      />

      {loading ? (
        <CardGridSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="Hozircha topshiriqlar yoʻq" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task, i) => (
            <motion.article
              key={task.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 9) * 0.04 }}
              className="card card-hover flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  <ListTodo className="w-5 h-5" />
                </span>
                <span className="chip chip-accent">★ +{task.xpReward} XP</span>
              </div>
              <h2 className="font-display text-lg font-semibold leading-snug mb-2">{task.title}</h2>
              <p className="text-muted text-sm flex-1 mb-5 whitespace-pre-wrap">{task.description}</p>
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setIsSubmitOpen(true);
                }}
                className="btn btn-primary w-full"
              >
                Bajarishni boshlash
              </button>
            </motion.article>
          ))}
        </div>
      )}

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Yangi topshiriq">
        <form onSubmit={handleCreate}>
          <Field label="Sarlavha">
            <input className="input" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Masalan: Biologiya muzeyiga tashrif" />
          </Field>
          <Field label="Taʼrif">
            <textarea className="input" required rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Batafsil maʼlumot…" />
          </Field>
          <Field label="Beriladigan XP">
            <input className="input" type="number" required min={1} value={newXp} onChange={(e) => setNewXp(parseInt(e.target.value) || 1)} />
          </Field>
          <button type="submit" className="btn btn-primary w-full">Yaratish</button>
        </form>
      </Modal>

      <Modal open={isSubmitOpen} onClose={closeSubmit} title="Hisobot topshirish">
        {selectedTask && <p className="font-semibold text-ink mb-1">{selectedTask.title}</p>}
        <p className="text-muted text-sm mb-5">Topshiriqni bajarganingiz haqida qisqacha maʼlumot yozing.</p>
        <form onSubmit={handleSubmitReport}>
          {message && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 mb-4 text-sm font-medium ${
                message.type === "error" ? "bg-danger-soft text-danger" : "bg-ok-soft text-ok"
              }`}
            >
              {message.text}
            </p>
          )}
          <textarea
            className="input mb-5"
            required
            rows={5}
            value={report}
            onChange={(e) => setReport(e.target.value)}
            placeholder="Men bugun muzeyga bordim va…"
            aria-label="Hisobot matni"
          />
          <button type="submit" disabled={submitting} className="btn btn-primary w-full">
            {submitting ? "Tekshirilmoqda…" : (<><CheckCircle className="w-4 h-4" /> Javobni tekshirish</>)}
          </button>
        </form>
      </Modal>
    </Page>
  );
}
