"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import { ShoppingBag, Clock, Store } from "lucide-react";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '4rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <div style={{ 
            width: '100%', 
            height: '240px', 
            backgroundColor: '#dcfce7', 
            borderRadius: '24px', 
            marginBottom: '2rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ShoppingBag size={80} color="var(--primary)" opacity={0.8} />
          </div>
          
          <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            {language === 'en' ? 'Your local market, one tap away.' : 'आपका स्थानीय बाज़ार, एक टैप दूर।'}
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Trusted local shops near you in Kothi, Jaitwar, and Maihar. Get fresh groceries delivered fast.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
            <Link href="/login" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              {t.Login}
            </Link>
            <Link href="/signup" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: 'var(--primary)', border: '2px solid var(--primary)', fontSize: '1.1rem' }}>
              {t.Signup}
            </Link>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)' }}>
                <Clock size={24} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>10 Min Delivery</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)' }}>
                <Store size={24} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Local Shops</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)' }}>
                <ShoppingBag size={24} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Fresh Products</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
