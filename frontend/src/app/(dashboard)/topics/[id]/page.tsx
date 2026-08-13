"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Video, FileText, Image as ImageIcon, File } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTopic();
    }
  }, [id]);

  const fetchTopic = async () => {
    try {
      const res = await fetch(`/api/topics/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTopic(data);
      } else {
        alert("Mavzu topilmadi");
        router.push("/topics");
      }
    } catch (error) {
      console.error("Failed to fetch topic:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (fileType.includes("video")) return <Video className="w-5 h-5 text-purple-500" />;
    if (fileType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-foreground/60 hover:text-indigo-600 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Orqaga qaytish
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-xl"
      >
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {topic.course?.title || "Biologiya"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{topic.title}</h1>
        </div>

        <div className="p-8">
          {topic.videoUrl && (
            <div className={`mb-10 rounded-2xl overflow-hidden shadow-lg border border-border ${topic.videoUrl.includes('.pdf') ? 'h-[80vh]' : 'aspect-video'}`}>
              <iframe 
                src={topic.videoUrl.includes('youtube') || topic.videoUrl.includes('youtu.be') ? topic.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') : `${topic.videoUrl}`}
                title={topic.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="prose prose-indigo dark:prose-invert max-w-none text-lg leading-relaxed">
            <ReactMarkdown
              components={{
                img: ({ node, ...props }) => (
                  <img {...props} className="w-full h-auto rounded-2xl shadow-lg border border-border/50 my-6" />
                )
              }}
            >
              {topic.contentMd || "*Ma'lumot kiritilmagan*"}
            </ReactMarkdown>
          </div>

          {topic.attachments && topic.attachments.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-500" /> Biriktirilgan Fayllar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topic.attachments.map((file: any) => (
                  <a 
                    key={file.id} 
                    href={`${file.fileUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-background border border-border p-4 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group"
                  >
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      {getFileIcon(file.fileType)}
                    </div>
                    <span className="font-medium truncate flex-1">{file.fileName}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
