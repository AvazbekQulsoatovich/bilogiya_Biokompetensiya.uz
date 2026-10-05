"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookMarked, FileText, Eye, User, Download } from "lucide-react";
import { Page, PageHeader, EmptyState, CardGridSkeleton } from "@/components/ui";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/books`);
        if (res.ok) setBooks(await res.json());
      } catch (e) {
        console.error("Kitoblarni yuklab boʻlmadi", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const list = Array.isArray(books) ? books : [];

  return (
    <Page>
      <PageHeader
        icon={BookMarked}
        eyebrow="Oʻrganish"
        title="Darsliklar va kitoblar"
        subtitle="Darsliklarni shu yerda oʻqing yoki qurilmangizga yuklab oling."
      />

      {loading ? (
        <CardGridSkeleton count={4} />
      ) : list.length === 0 ? (
        <EmptyState icon={FileText} title="Hozircha kitoblar yoʻq" text="Tez orada kitoblar qoʻshiladi." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((book, i) => (
            <motion.article
              key={book.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card card-hover group flex flex-col overflow-hidden"
            >
              <div className="aspect-[3/4] w-full bg-surface-2 relative overflow-hidden flex items-center justify-center">
                {book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} muqovasi`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white bg-gradient-to-br from-[var(--brand)] to-[var(--brand-strong)]">
                    <BookMarked className="w-9 h-9 opacity-80" strokeWidth={1.6} />
                    <div>
                      <p className="font-display text-2xl font-semibold leading-tight text-balance">{book.title}</p>
                      {book.author && <p className="text-white/75 text-sm mt-2">{book.author}</p>}
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10" aria-hidden />
                    <div className="absolute right-6 top-6 w-16 h-16 rounded-full border-2 border-white/20" aria-hidden />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                  <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <Eye className="w-4 h-4" /> Oʻqish
                  </a>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-semibold leading-snug line-clamp-2" title={book.title}>
                    {book.title}
                  </h2>
                  {book.author && (
                    <p className="text-muted text-sm mt-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> {book.author}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-soft btn-sm flex-1">
                    <Eye className="w-4 h-4" /> Oʻqish
                  </a>
                  <a href={book.pdfUrl} download className="btn btn-ghost btn-sm" title="Yuklab olish" aria-label="Yuklab olish">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </Page>
  );
}
