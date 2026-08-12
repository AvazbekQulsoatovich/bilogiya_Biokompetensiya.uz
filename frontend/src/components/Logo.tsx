import Link from "next/link";

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export function Logo({ className = "", isDark = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center h-full py-1">
        <img 
          src="/logo.png" 
          alt="Biologiya" 
          className="h-10 sm:h-12 w-auto object-contain"
        />
      </div>
    </Link>
  );
}
