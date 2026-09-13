"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { Store, Package, ShoppingCart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopkeeperDashboard() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem" }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)' }}>
            <Store size={32} />
          </div>
          <div>
            <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>{t.Shopkeeper} Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your store and products</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="card" onClick={() => router.push('/shopkeeper/my-shop')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '16px', color: '#0284c7' }}>
              <Store size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>My Shop</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Edit shop details</p>
            </div>
          </div>
          
          <div className="card" onClick={() => router.push('/shopkeeper/products')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: '16px', color: '#16a34a' }}>
              <Package size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Products</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage inventory</p>
            </div>
          </div>

          <div className="card" onClick={() => router.push('/shopkeeper/orders')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#fef08a', padding: '1rem', borderRadius: '16px', color: '#ca8a04' }}>
              <ShoppingCart size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{t.Orders}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage incoming orders</p>
            </div>
          </div>
          <div className="card" onClick={() => router.push('/shopkeeper/catalog')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '16px', color: '#059669' }}>
              <MessageCircle size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>WhatsApp Catalog</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage public catalog</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
