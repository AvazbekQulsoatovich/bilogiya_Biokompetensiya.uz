import Link from "next/link";

interface LogoProps {
  className?: string;
  /** "mark" — faqat belgi, "full" — belgi + nom */
  variant?: "mark" | "full";
  size?: number;
}

export function Logo({ className = "", variant = "full", size = 44 }: LogoProps) {
  const src = variant === "mark" ? "/logo-mark.png" : "/logo-full.png";
  const ratio = variant === "mark" ? 286 / 240 : 417 / 314;
  return (
    <Link href="/" aria-label="Biokompetensiya — bosh sahifa" className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Biokompetensiya.uz"
        width={Math.round(size * ratio)}
        height={size}
        style={{ height: size, width: "auto" }}
      />
    </Link>
  );
}
