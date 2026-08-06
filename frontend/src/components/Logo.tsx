import Link from 'next/link';
import { Dna, Leaf } from 'lucide-react';

interface LogoProps {
  className?: string;
  isDark?: boolean; // Set to true if placed on a dark background (like the landing page hero)
}

export function Logo({ className = "", isDark = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Icon Container */}
      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlapping DNA and Leaf for a beautiful Bio-Tech feel */}
        <Leaf 
          className="w-5 h-5 text-white/90 absolute transform -translate-x-1.5 -translate-y-1.5 rotate-12 drop-shadow-sm group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500" 
          fill="currentColor" 
        />
        <Dna 
          className="w-7 h-7 text-white absolute transform translate-x-1 translate-y-1 -rotate-12 drop-shadow-md group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" 
        />
      </div>
      
      {/* Text Container */}
      <div className="flex flex-col">
        <span 
          className={`text-2xl font-black tracking-tight font-serif transition-colors duration-300 ${
            isDark 
              ? 'text-white drop-shadow-sm' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400'
          }`}
        >
          Biokompetensiya
        </span>
        <span 
          className={`text-[10px] uppercase tracking-[0.25em] font-bold -mt-1 transition-colors duration-300 ${
            isDark 
              ? 'text-white/70' 
              : 'text-foreground/50 dark:text-foreground/60'
          }`}
        >
          Ta'lim Platformasi
        </span>
      </div>
    </Link>
  );
}
