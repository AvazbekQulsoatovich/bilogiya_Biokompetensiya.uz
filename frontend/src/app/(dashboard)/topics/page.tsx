"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, File, UploadCloud, X, FileText, Image as ImageIcon, Video, PlaySquare } from "lucide-react";

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  
  // Video url add state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoTopicId, setVideoTopicId] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
    }
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      // API manzili localhostga o'zgartirildi
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/topics`);
      const data = await res.json();
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/topics`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title: newTopicTitle })
      });
      if (res.ok) {
        setNewTopicTitle("");
        setIsModalOpen(false);
        fetchTopics();
      }
    } catch (error) {
      console.error("Error creating topic", error);
    }
  };

  const handleUpload = async (topicId: string) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload/${topicId}`, {
        method: "POST",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        setSelectedTopic(null);
        fetchTopics();
      } else {
        alert("Fayl yuklashda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTopicId || !videoFile) return;
    
    const formData = new FormData();
    formData.append("file", videoFile);
    setUploadingVideo(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload/video/${videoTopicId}`, {
        method: "POST",
        headers: { 
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData
      });
      if (res.ok) {
        setVideoFile(null);
        setIsVideoModalOpen(false);
        setVideoTopicId(null);
        fetchTopics();
      } else {
        alert("Video yuklashda xatolik yuz berdi.");
      }
    } catch (error) {
      console.error("Failed to upload video", error);
    } finally {
      setUploadingVideo(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (fileType.includes("video")) return <Video className="w-5 h-5 text-purple-500" />;
    if (fileType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  // Helper to extract youtube video ID for embedding
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="text-primary-500" />
            Mavzular va O'quv Materiallari
          </h1>
          <p className="text-foreground/60 mt-2">Darslarni o'qing, video va materiallar bilan tanishing</p>
        </div>
        
        {userRole === "SUPER_ADMIN" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
            Yangi Mavzu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : topics.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <BookOpen className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hali mavzular yo'q</h3>
          <p className="text-foreground/60">Yangi mavzu qo'shish tugmasi orqali darslik yarating.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {topics.map((topic) => (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-primary" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pl-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold">{topic.title}</h3>
                  <p className="text-foreground/60 text-sm mt-1">
                    Yaratilgan vaqt: {new Date(topic.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {userRole === "SUPER_ADMIN" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={() => { setVideoTopicId(topic.id); setIsVideoModalOpen(true); }}
                      className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                    >
                      <PlaySquare className="w-4 h-4" />
                      Video biriktirish
                    </button>
                    <button 
                      onClick={() => setSelectedTopic(topic.id)}
                      className="flex items-center gap-2 text-primary-500 bg-primary-500/10 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all text-sm font-medium"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Fayl biriktirish
                    </button>
                  </div>
                )}
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

              {/* Upload Interface for this Topic */}
              {selectedTopic === topic.id && (
                <div className="mt-6 pl-4 border-t border-border/30 pt-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <input 
                      type="file" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <button 
                      onClick={() => handleUpload(topic.id)}
                      disabled={!file || uploading}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {uploading ? "Yuklanmoqda..." : "Yuklash"}
                    </button>
                    <button 
                      onClick={() => { setSelectedTopic(null); setFile(null); }}
                      className="text-foreground/50 hover:text-foreground"
                    >
                      Bekor qilish
                    </button>
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
                        className="flex items-center gap-3 bg-background/50 border border-border/50 px-4 py-2 rounded-xl hover:border-primary-500/50 hover:bg-primary-500/5 transition-all"
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

      {/* Video URL Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border/50 p-6 rounded-3xl shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => { setIsVideoModalOpen(false); setVideoFile(null); setVideoTopicId(null); }}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <PlaySquare className="w-6 h-6 text-red-500" />
              Video yuklash
            </h2>
            <form onSubmit={handleAddVideo}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Video faylni tanlang (MP4, va h.k.)</label>
                <input 
                  type="file" 
                  accept="video/*"
                  required
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
              <button 
                type="submit"
                disabled={uploadingVideo || !videoFile}
                className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {uploadingVideo ? "Yuklanmoqda..." : "Yuklash va Saqlash"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Create Topic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border/50 p-6 rounded-3xl shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Yangi mavzu qo'shish</h2>
            <form onSubmit={handleCreateTopic}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Mavzu nomi</label>
                <input 
                  type="text" 
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  placeholder="Masalan: Hujayra tuzilishi..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20"
              >
                Yaratish
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
