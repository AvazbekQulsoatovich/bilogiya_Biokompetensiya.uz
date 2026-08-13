"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookMarked, FileText, Eye, User, Download } from "lucide-react";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`/api/books`);
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookMarked className="text-violet-500 w-8 h-8" />
            Darsliklar va kitoblar
          </h1>
          <p className="text-foreground/60 mt-2">Kitoblarni shu yerda o'qing va yuklab oling</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border-dashed border-2 border-border/50">
          <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Hali kitoblar yo'q</h3>
          <p className="text-foreground/60">Tez orada kitoblar qo'shiladi.</p>
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
                  <img src={`${book.coverUrl}`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookMarked className="w-16 h-16 text-foreground/20" />
                )}
                
                {/* Overlay with read button */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={`${book.pdfUrl}`} 
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
                
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
                  <a 
                    href={`${book.pdfUrl}`} 
                    download
                    className="text-foreground/50 hover:text-foreground hover:bg-foreground/5 p-2 rounded-lg transition-colors"
                    title="Yuklab olish"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
