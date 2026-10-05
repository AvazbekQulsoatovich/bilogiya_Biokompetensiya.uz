"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, FileText, Image as ImageIcon, File, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Page, Loading, BackButton, EmptyState } from "@/components/ui";

function FileIcon({ type }: { type: string }) {
  const t = type || "";
  if (t.includes("image")) return <ImageIcon className="w-5 h-5 text-info" />;
  if (t.includes("video")) return <Video className="w-5 h-5 text-accent" />;
  if (t.includes("pdf")) return <FileText className="w-5 h-5 text-danger" />;
  return <File className="w-5 h-5 text-muted" />;
}

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/topics/${id}`);
        if (res.ok) setTopic(await res.json());
        else setNotFound(true);
      } catch (e) {
        console.error("Mavzuni yuklab boʻlmadi", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Page narrow><Loading /></Page>;
  if (notFound || !topic)
    return (
      <Page narrow>
        <EmptyState icon={FileText} title="Mavzu topilmadi" text="Bu mavzu oʻchirilgan yoki havola notoʻgʻri boʻlishi mumkin." />
        <div className="text-center mt-6">
          <button onClick={() => router.push("/topics")} className="btn btn-primary">Mavzular roʻyxatiga qaytish</button>
        </div>
      </Page>
    );

  const isEmbedUrl = (u: string) => u.includes("youtube") || u.includes("youtu.be");
  const isPdf = topic.videoUrl?.includes(".pdf");

  return (
    <Page narrow>
      <BackButton onClick={() => router.back()}>Orqaga qaytish</BackButton>

      <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <header className="page-hero !rounded-none !border-0 !border-b !border-line px-6 md:px-10 pt-8 pb-7">
          <span className="chip chip-brand mb-4 relative z-[1]">{topic.course?.title || "Biologiya"}</span>
          <h1 className="relative z-[1] font-display text-3xl md:text-4xl font-semibold leading-tight text-balance">{topic.title}</h1>
        </header>

        <div className="px-6 md:px-10 py-8">
          {topic.videoUrl && (
            <div
              className={`mb-10 rounded-2xl overflow-hidden border border-line bg-black ${
                isPdf ? "h-[80vh]" : "aspect-video"
              }`}
            >
              <iframe
                src={
                  isEmbedUrl(topic.videoUrl)
                    ? topic.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
                    : topic.videoUrl
                }
                title={topic.title}
                loading="lazy"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="md">
            <ReactMarkdown
              components={{
                img: ({ src: raw, alt }) => {
                  // JPEG2000 (.jpx) brauzerda ochilmaydi — oldindan JPEG nusxasi yaratilgan
                  const src = typeof raw === "string" ? raw.replace(/\.jpx$/i, ".jpx.jpg") : undefined;
                  return (
                  <a href={src} target="_blank" rel="noreferrer" title="Katta ochish">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt || "Darslik sahifasi"} loading="lazy" decoding="async" />
                  </a>
                  );
                },
              }}
            >{topic.contentMd || "*Maʼlumot kiritilmagan*"}</ReactMarkdown>
          </div>

          {topic.attachments?.length > 0 && (
            <section className="mt-12 pt-8 border-t border-line">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-brand" /> Biriktirilgan fayllar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topic.attachments.map((file: any) => (
                  <a
                    key={file.id}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-4 hover:border-brand transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-surface">
                      <FileIcon type={file.fileType} />
                    </div>
                    <span className="font-medium truncate flex-1 group-hover:text-brand">{file.fileName}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.article>
    </Page>
  );
}
