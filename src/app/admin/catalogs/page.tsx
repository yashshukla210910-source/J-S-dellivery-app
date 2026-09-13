"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ChevronLeft, MessageCircle, AlertTriangle, ShieldCheck, Ban, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminCatalogs() {
  const router = useRouter();
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalogs");
      const data = await res.json();
      if (data.catalogs) {
        setCatalogs(data.catalogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/catalogs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappCatalogStatus: newStatus })
      });
      fetchCatalogs();
    } catch (e) {
      console.error(e);
    }
  };

  const verifyCatalog = async (id: string, isVerified: boolean) => {
    try {
      await fetch(`/api/admin/catalogs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappCatalogVerified: isVerified })
      });
      fetchCatalogs();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card" style={{ height: "400px" }}></div>
      </div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: "1rem" }}>
        <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#25D366', padding: '1rem', borderRadius: '50%', color: 'white', boxShadow: 'var(--shadow-sm)' }}>
            <MessageCircle size={28} />
          </div>
          <div>
            <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>WhatsApp Catalogs</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage public shop listings</p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>All Catalogs</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '0.75rem 0' }}>Shop Info</th>
                  <th style={{ padding: '0.75rem 0' }}>WhatsApp Settings</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {catalogs.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No catalogs found.</td>
                  </tr>
                )}
                {catalogs.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 'bold' }}>{c.name_en}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.owner.name} • {c.area}</div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {c.whatsappCatalogEnabled ? <span className="badge badge-success">Enabled</span> : <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Disabled</span>}
                        {c.whatsappCatalogVerified && <span title="Verified"><ShieldCheck size={16} color="#0284c7" /></span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {c.whatsappNumber ? `+91 ${c.whatsappNumber}` : 'No Number'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      {c.whatsappCatalogStatus === 'ACTIVE' ? (
                        <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}><CheckCircle size={14}/> Active</span>
                      ) : (
                        <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}><Ban size={14}/> Suspended</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => verifyCatalog(c.id, !c.whatsappCatalogVerified)}
                          style={{ 
                            background: c.whatsappCatalogVerified ? '#f1f5f9' : '#e0f2fe', 
                            color: c.whatsappCatalogVerified ? '#64748b' : '#0284c7', 
                            border: 'none', 
                            padding: '0.4rem 0.8rem', 
                            borderRadius: '8px', 
                            fontSize: '0.85rem', 
                            fontWeight: 'bold', 
                            cursor: 'pointer' 
                          }}
                        >
                          {c.whatsappCatalogVerified ? 'Unverify' : 'Verify'}
                        </button>
                        
                        {c.whatsappCatalogStatus === 'ACTIVE' ? (
                          <button 
                            onClick={() => updateStatus(c.id, 'SUSPENDED')}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus(c.id, 'ACTIVE')}
                            style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
