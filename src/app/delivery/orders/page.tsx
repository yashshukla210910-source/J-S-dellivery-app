"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Package, MapPin, CheckCircle, Clock } from "lucide-react";

export default function DeliveryOrdersList() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/delivery/orders");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  if (loading) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card" style={{ height: '150px' }}></div>
      </div>
    </main>
  );

  if (!data) return null;

  const displayOrders = tab === 'active' ? data.activeOrders : data.completedOrders;

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Deliveries</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setTab('active')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: tab === 'active' ? 'white' : 'transparent', color: tab === 'active' ? 'var(--text)' : 'var(--text-muted)', boxShadow: tab === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
          >
            Active
          </button>
          <button 
            onClick={() => setTab('completed')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: tab === 'completed' ? 'white' : 'transparent', color: tab === 'completed' ? 'var(--text)' : 'var(--text-muted)', boxShadow: tab === 'completed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
          >
            Completed
          </button>
        </div>

        {/* Order List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <p>No {tab} deliveries found.</p>
            </div>
          ) : (
            displayOrders.map((order: any) => (
              <div key={order.id} onClick={() => router.push(`/delivery/orders/${order.id}`)} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>#{order.orderNumber}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{order.customerName}</p>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{order.finalPrice?.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={16} /> {order.shop.area}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Package size={16} /> {order.orderItems.length} items
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: order.status === 'DELIVERED' ? '#16a34a' : order.status === 'OUT_FOR_DELIVERY' ? '#eab308' : '#3b82f6' }}>
                    {order.status === 'DELIVERED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    {order.status === 'DELIVERED' ? 'Delivered' : order.status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Assigned'}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>View &rarr;</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
