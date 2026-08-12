"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, File, FileText, Image as ImageIcon, Video, PlaySquare } from "lucide-react";
import Link from "next/link";

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(5);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/topics`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTopics(data);
      } else {
        setTopics(data?.topics || []);
      }
    } catch (error) {
      console.error("Failed to fetch topics", error);
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

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="bg-indigo-500 rounded-[2rem] p-6 md:p-8 mb-8 text-white shadow-lg shadow-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Mavzular va O'quv Materiallari</h1>
            <p className="text-white/80 mt-1">Darslarni o'qing, video va materiallar bilan tanishing</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab(5)}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 5 ? 'bg-indigo-500 text-white shadow-lg' : 'bg-card border border-border/50 text-foreground/70 hover:bg-indigo-500/10'}`}
        >
          5-sinf Botanika
        </button>
        <button 
          onClick={() => setActiveTab(6)}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 6 ? 'bg-indigo-500 text-white shadow-lg' : 'bg-card border border-border/50 text-foreground/70 hover:bg-indigo-500/10'}`}
        >
          6-sinf Biologiya
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(topics) || topics.filter(t => (t.course?.gradeLevel || 5) === activeTab).length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <BookOpen className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hali mavzular yo'q</h3>
          <p className="text-foreground/60">Yaqin orada mavzular qo'shiladi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {(Array.isArray(topics) ? topics : []).filter(t => (t.course?.gradeLevel || 5) === activeTab).map((topic) => (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
              <div className="flex flex-col justify-between items-start pl-4 gap-2">
                <Link href={`/topics/${topic.id}`} className="hover:text-indigo-600 transition-colors">
                  <h3 className="text-xl font-bold">{topic.title}</h3>
                </Link>
                <p className="text-foreground/60 text-sm">
                  Yaratilgan vaqt: {new Date(topic.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Video Player */}
              {topic.videoUrl && (
                <div className="mt-6 pl-4">
                  <div className="aspect-video w-full max-w-3xl rounded-xl overflow-hidden shadow-lg border border-border/50">
                    {topic.videoUrl.startsWith('/uploads/') ? (
                      <video 
                        src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${topic.videoUrl}`} 
                        controls 
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <iframe 
                        src={getYoutubeEmbedUrl(topic.videoUrl)} 
                        title={topic.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                </div>
              )}

              {/* Attachments List */}
              {topic.attachments && topic.attachments.length > 0 && (
                <div className="mt-6 pl-4">
                  <h4 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                    Biriktirilgan fayllar ({topic.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {topic.attachments.map((file: any) => (
                      <a 
                        key={file.id} 
                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${file.fileUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 bg-background/50 border border-border/50 px-4 py-2 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      >
                        {getFileIcon(file.fileType)}
                        <span className="text-sm font-medium">{file.fileName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
