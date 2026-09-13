"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Store, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminShops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchShops = async () => {
    const res = await fetch("/api/admin/shops");
    const data = await res.json();
    setShops(data.shops || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchShops();
  };

  if (loading) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card"></div>
      </div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem" }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => router.back()} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <ChevronLeft size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Store size={28} color="var(--primary)" />
            <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>Manage Shops</h1>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead style={{ backgroundColor: '#f1f5f9' }}>
                <tr>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Shop Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Area</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Owner Phone</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No shops registered yet.</td>
                  </tr>
                )}
                {shops.map(shop => (
                  <tr key={shop.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{shop.name_en}</td>
                    <td style={{ padding: '1rem' }}>{shop.area}</td>
                    <td style={{ padding: '1rem' }}>{shop.owner?.phone}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${shop.status === 'ACTIVE' ? 'badge-success' : shop.status === 'SUSPENDED' ? 'badge-danger' : 'badge-warning'}`}>
                        {shop.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      {shop.status !== 'ACTIVE' && (
                        <button onClick={() => updateStatus(shop.id, 'ACTIVE')} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                          <CheckCircle size={16} /> Activate
                        </button>
                      )}
                      {shop.status !== 'SUSPENDED' && (
                        <button onClick={() => updateStatus(shop.id, 'SUSPENDED')} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                          <XCircle size={16} /> Suspend
                        </button>
                      )}
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
