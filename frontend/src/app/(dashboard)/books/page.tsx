"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Plus, X, UploadCloud, FileText, Download, Trash2, Eye, User } from "lucide-react";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Book State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
      setToken(localStorage.getItem("token"));
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/books`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadGenericFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload/file`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.fileUrl;
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !title) return;

    setIsUploading(true);
    try {
      // Upload PDF
      const pdfUrl = await uploadGenericFile(pdfFile);
      
      // Upload Cover (if selected)
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadGenericFile(coverFile);
      }

      // Create Book
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/books`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, author, coverUrl, pdfUrl })
      });

      if (res.ok) {
        setTitle("");
        setAuthor("");
        setPdfFile(null);
        setCoverFile(null);
        setIsModalOpen(false);
        fetchBooks();
      } else {
        try {
          const errData = await res.json();
          alert(`Kitob qo'shishda xatolik: ${errData.error}`);
        } catch {
          alert(`Kitob qo'shishda xatolik: HTTP ${res.status}`);
        }
      }
    } catch (error) {
      console.error("Error creating book", error);
      alert("Tarmoq xatosi yoki fayl yuklash muammosi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham bu kitobni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/books/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        fetchBooks();
      }
    } catch (error) {
      console.error("Failed to delete book", error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookMarked className="text-violet-500 w-8 h-8" />
            Darsliklar va Kitoblar
          </h1>
          <p className="text-foreground/60 mt-2">Elektron kitoblarni to'g'ridan-to'g'ri tizimning o'zida o'qing</p>
        </div>
        
        {userRole === "SUPER_ADMIN" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-5 h-5" />
            Kitob qo'shish
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hali kitoblar yo'q</h3>
          <p className="text-foreground/60">Tizimga hozircha elektron darsliklar kiritilmagan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(Array.isArray(books) ? books : []).map((book) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-border/50 overflow-hidden group flex flex-col"
            >
              <div className="aspect-[3/4] w-full bg-foreground/5 relative overflow-hidden flex items-center justify-center">
                {book.coverUrl ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${book.coverUrl}`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookMarked className="w-16 h-16 text-foreground/20" />
                )}
                
                {/* Overlay with read button */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${book.pdfUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-full font-medium transition-all shadow-xl shadow-violet-500/30 translate-y-4 group-hover:translate-y-0"
                  >
                    <Eye className="w-5 h-5" />
                    O'qish
                  </a>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold line-clamp-2 leading-tight" title={book.title}>{book.title}</h3>
                  {book.author && <p className="text-foreground/60 text-sm mt-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> {book.author}</p>}
                </div>
                
                {userRole === "SUPER_ADMIN" && (
                  <div className="mt-4 pt-4 border-t border-border/50 flex justify-between">
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${book.pdfUrl}`} 
                      download
                      className="text-foreground/50 hover:text-foreground hover:bg-foreground/5 p-2 rounded-lg transition-colors"
                      title="Yuklab olish"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-foreground/50 hover:text-foreground p-2 rounded-full hover:bg-foreground/5"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookMarked className="w-6 h-6 text-violet-500" />
                Yangi kitob qo'shish
              </h2>
              
              <form onSubmit={handleCreateBook} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kitob nomi <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    placeholder="Masalan: 8-sinf Biologiya darsligi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Muallif(lar)</label>
                  <input 
                    type="text" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    placeholder="Masalan: O. Eshmurodov, A. Tursunov"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Kitob fayli (PDF) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".pdf"
                      required
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-foreground/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-violet-500/10 file:text-violet-500 hover:file:bg-violet-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Muqova rasmi (Ixtiyoriy, JPG/PNG)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-foreground/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-foreground/5 file:text-foreground/70 hover:file:bg-foreground/10"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className="w-full flex justify-center items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>Yuklanmoqda... (Kuting)</>
                    ) : (
                      <>
                        <UploadCloud className="w-5 h-5" />
                        Saqlash va Joylash
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

