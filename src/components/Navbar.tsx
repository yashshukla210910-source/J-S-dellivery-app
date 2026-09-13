"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { Globe, LogOut } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  // Don't show Navbar on purely mobile user pages if we want, but it's okay for desktop
  // Let's keep it minimal
  return (
    <nav style={{ padding: "1rem", backgroundColor: "var(--primary)", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link href="/" style={{ fontSize: "1.2rem", fontWeight: "bold", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>LM</span>
        LocalMart
      </Link>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button onClick={() => setLanguage(language === "en" ? "hi" : "en")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Globe size={18} />
          {language === "en" ? "हिंदी" : "EN"}
        </button>
        {pathname !== "/" && pathname !== "/login" && pathname !== "/signup" && (
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <LogOut size={18} />
          </button>
        )}
      </div>
    </nav>
  );
}
