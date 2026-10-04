"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, File, FileText, Image as ImageIcon, Video, Search, ArrowRight, Paperclip } from "lucide-react";
import Link from "next/link";
import { Page, PageHeader, Segmented, EmptyState, CardGridSkeleton } from "@/components/ui";
import { includesUz, formatDateUz } from "@/lib/text";

function getYoutubeEmbedUrl(url: string) {
  try {
    let videoId = "";
    if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
    else if (url.includes("youtube.com/watch")) videoId = new URL(url).searchParams.get("v") || "";
    else if (url.includes("youtube.com/embed/")) videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

function FileIcon({ type }: { type: string }) {
  const t = type || "";
  if (t.includes("image")) return <ImageIcon className="w-4 h-4 text-info" />;
  if (t.includes("video")) return <Video className="w-4 h-4 text-accent" />;
  if (t.includes("pdf")) return <FileText className="w-4 h-4 text-danger" />;
  return <File className="w-4 h-4 text-muted" />;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(5);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("topicsActiveTab");
      if (saved) setActiveTab(Number(saved));
    } catch {}
    (async () => {
      try {
        const res = await fetch(`/api/topics`);
        const data = await res.json();
        setTopics(Array.isArray(data) ? data : data?.topics || []);
      } catch (e) {
        console.error("Mavzularni yuklab boʻlmadi", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleTab = (tab: number) => {
    setActiveTab(tab);
    try {
      sessionStorage.setItem("topicsActiveTab", String(tab));
    } catch {}
  };

  const list = useMemo(() => {
    return topics
      .filter((t) => (t.course?.gradeLevel || 5) === activeTab)
      .filter((t) => !query.trim() || includesUz(t.title, query))
      .sort((a, b) => {
        const na = parseInt(a.title.replace(/\D/g, "")) || 0;
        const nb = parseInt(b.title.replace(/\D/g, "")) || 0;
        return na !== nb ? na - nb : a.title.localeCompare(b.title);
      });
  }, [topics, activeTab, query]);

  return (
    <Page>
      <PageHeader
        icon={BookOpen}
        eyebrow="Oʻrganish"
        title="Mavzular va oʻquv materiallari"
        subtitle="Darslik mavzularini oʻqing, video darslarni koʻring va qoʻshimcha fayllarni yuklab oling."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Segmented
          label="Sinf"
          value={activeTab}
          onChange={handleTab}
          options={[
            { value: 5, label: "5-sinf", hint: "Tabiiy fanlar" },
            { value: 6, label: "6-sinf", hint: "Biologiya" },
          ]}
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className="input !pl-10"
            placeholder="Mavzuni qidirish…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Mavzuni qidirish"
          />
        </div>
      </div>

      {loading ? (
        <CardGridSkeleton count={4} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={query ? "Hech narsa topilmadi" : "Hozircha mavzular yoʻq"}
          text={query ? "Boshqa soʻz bilan qidirib koʻring." : "Tez orada mavzular qoʻshiladi."}
        />
      ) : (
        <div className="grid gap-4">
          {list.map((topic, i) => (
            <motion.article
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.03 }}
              className="card p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/topics/${topic.id}`} className="group inline-block">
                    <h2 className="font-display text-xl font-semibold group-hover:text-brand transition-colors">
                      {topic.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-muted mt-1">Qoʻshilgan sana: {formatDateUz(topic.createdAt)}</p>
                </div>
                <Link href={`/topics/${topic.id}`} className="btn btn-soft btn-sm shrink-0 self-start">
                  Oʻqish <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {topic.videoUrl && (
                <div className="mt-5 aspect-video w-full max-w-3xl rounded-xl overflow-hidden border border-line bg-black">
                  {topic.videoUrl.startsWith("/uploads/") ? (
                    <video src={topic.videoUrl} controls preload="metadata" className="w-full h-full object-contain" />
                  ) : (
                    <iframe
                      src={getYoutubeEmbedUrl(topic.videoUrl)}
                      title={topic.title}
                      loading="lazy"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

              {topic.attachments?.length > 0 && (
                <div className="mt-5">
                  <p className="eyebrow !text-muted mb-2.5 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" /> Biriktirilgan fayllar ({topic.attachments.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topic.attachments.map((file: any) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-sm font-medium hover:border-brand hover:text-brand transition-colors"
                      >
                        <FileIcon type={file.fileType} />
                        <span className="max-w-[16rem] truncate">{file.fileName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </Page>
  );
}
