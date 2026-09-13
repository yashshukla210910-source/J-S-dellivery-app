"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Package, Clock, CheckCircle, Truck, RefreshCw, Power } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function DeliveryDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityUpdating, setAvailabilityUpdating] = useState(false);

  const fetchDashboard = async () => {
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

  useEffect(() => {
    fetchDashboard();
  }, []);

  const toggleAvailability = async () => {
    setAvailabilityUpdating(true);
    const newStatus = data.stats.availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    try {
      const res = await fetch("/api/delivery/profile/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newStatus })
      });
      if (res.ok) {
        setData({
          ...data,
          stats: { ...data.stats, availability: newStatus }
        });
      }
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setAvailabilityUpdating(false);
    }
  };

  if (loading) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
      </div>
    </main>
  );

  if (!data) return null;

  const isAvailable = data.stats.availability === 'AVAILABLE';
  const currentOrder = data.activeOrders?.[0]; // Show the most recent active order

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
          Good morning, {data.stats.name?.split(' ')[0] || 'Partner'}
        </h1>

        {/* Availability Toggle */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.DeliveryStatus}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: isAvailable ? '#16a34a' : '#64748b' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isAvailable ? '#16a34a' : '#64748b' }}></div>
              {isAvailable ? t.StatusActive : t.GoOffline}
            </div>
          </div>
          <button 
            onClick={toggleAvailability}
            disabled={availabilityUpdating}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '12px', border: 'none', background: isAvailable ? '#fee2e2' : '#dcfce7', color: isAvailable ? '#dc2626' : '#16a34a', fontWeight: 'bold', cursor: 'pointer', opacity: availabilityUpdating ? 0.7 : 1 }}
          >
            <Power size={18} />
            {isAvailable ? t.GoOffline : t.GoOnline}
          </button>
        </div>

        {/* Today's Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>{t.Assigned}</h3>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>{data.stats.assignedToday}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>{t.Delivered}</h3>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: '#16a34a' }}>{data.stats.deliveredToday}</p>
          </div>
        </div>

        {/* Current Active Delivery */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{t.CurrentDelivery}</h2>
        
        {currentOrder ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: currentOrder.status === 'OUT_FOR_DELIVERY' ? '#eab308' : '#3b82f6' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', background: currentOrder.status === 'OUT_FOR_DELIVERY' ? '#fef08a' : '#dbeafe', color: currentOrder.status === 'OUT_FOR_DELIVERY' ? '#a16207' : '#1e40af', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {currentOrder.status === 'OUT_FOR_DELIVERY' ? t.OutForDelivery : t.Assigned}
                </span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.OrderHash}{currentOrder.orderNumber}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{currentOrder.customerName}</p>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{currentOrder.deliveryAddress}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><span style={{ color: 'var(--text-muted)' }}>Area:</span> {currentOrder.shop.area}</p>
            </div>

            <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t.ToCollect}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{currentOrder.finalPrice?.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => router.push(`/delivery/orders/${currentOrder.id}`)}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
            >
              {t.ViewOrder}
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem 1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle size={32} color="#94a3b8" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: 'var(--text)' }}>{t.NoActiveDeliveries}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}></p>
          </div>
        )}

        {/* View All Deliveries */}
        <button 
          onClick={() => router.push('/delivery/orders')}
          style={{ width: '100%', padding: '1rem', marginTop: '1rem', borderRadius: '12px', background: 'white', color: 'var(--text)', border: '1px solid var(--border)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
        >
          {t.ViewAllDeliveries}
        </button>

      </div>
    </main>
  );
}
