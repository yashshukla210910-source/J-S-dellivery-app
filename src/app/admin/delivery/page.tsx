"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Users, MapPin, Truck, Phone } from "lucide-react";

export default function AdminDeliveryPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        const res = await fetch("/api/admin/delivery");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        setData(json.deliveryBoys);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryBoys();
  }, [router]);

  if (loading) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
      </div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck size={24} /> Delivery Boys
        </h1>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--text-muted)' }}>No delivery partners found.</p>
            </div>
          ) : (
            data.map((db) => (
              <div key={db.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>{db.name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                      <Phone size={14} /> {db.phone}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: db.availability === 'AVAILABLE' ? '#16a34a' : '#64748b', background: db.availability === 'AVAILABLE' ? '#dcfce7' : '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: db.availability === 'AVAILABLE' ? '#16a34a' : '#64748b' }}></div>
                    {db.availability === 'AVAILABLE' ? 'Available' : 'Offline'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={16} color="var(--text-muted)" /> {db.location}
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Orders</p>
                    <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{db.activeOrderCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 5</span></p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Completed Today</p>
                    <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>{db.completedToday}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
