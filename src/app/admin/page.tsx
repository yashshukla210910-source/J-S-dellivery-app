"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { Shield, Store, Users, PackageOpen, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem" }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', color: 'white' }}>
            <Shield size={32} />
          </div>
          <div>
            <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>{t.Admin} Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>System overview and management</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="card" onClick={() => router.push('/admin/shops')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '16px', color: '#0284c7' }}>
              <Store size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Shops</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage approvals</p>
            </div>
          </div>
          
          <div className="card" onClick={() => router.push('/admin/orders')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#fef08a', padding: '1rem', borderRadius: '16px', color: '#ca8a04' }}>
              <PackageOpen size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Orders</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage pending orders</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)', opacity: 0.7 }}>
            <div style={{ backgroundColor: '#f3e8ff', padding: '1rem', borderRadius: '16px', color: '#9333ea' }}>
              <Users size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Users</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage roles</p>
            </div>
          </div>

          <div className="card" onClick={() => router.push('/admin/delivery')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#ffedd5', padding: '1rem', borderRadius: '16px', color: '#ea580c' }}>
              <PackageOpen size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Deliveries</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Track riders</p>
            </div>
          </div>
          
          <div className="card" onClick={() => router.push('/admin/catalogs')} style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '16px', color: '#059669' }}>
              <Store size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Catalogs</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Manage WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Settings size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontWeight: 'bold' }}>System Settings</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>User Management</span>
              <span className="badge badge-warning">Phase 2</span>
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Shop Approval</span>
              <span className="badge badge-success">Active</span>
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Order Finalization</span>
              <span className="badge badge-success">Active</span>
            </li>
            <li style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>Admin Order Approval</span>
              <span className="badge badge-success">Active</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
