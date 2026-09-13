"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, MapPin, Phone, User, Store, Banknote, CheckCircle, Navigation, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DeliveryOrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { t } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/delivery/orders/${resolvedParams.id}`);
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setOrder(json.order);
      } catch (e) {
        console.error(e);
        alert("Failed to load order");
        router.push("/delivery");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [resolvedParams.id, router]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/delivery/orders/${resolvedParams.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (res.ok) {
        setOrder(json.order);
        setShowConfirm(false);
      } else {
        alert(json.error || "Failed to update status");
      }
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card" style={{ height: '300px' }}></div>
      </div>
    </main>
  );

  if (!order) return null;

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '120px' }}>
      <Navbar />
      
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: '0', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{t.OrderHash}{order.orderNumber}</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem' }}>
        
        {/* Status Banner */}
        <div style={{ 
          background: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'OUT_FOR_DELIVERY' ? '#fef08a' : '#dbeafe', 
          color: order.status === 'DELIVERED' ? '#16a34a' : order.status === 'OUT_FOR_DELIVERY' ? '#a16207' : '#1e40af', 
          padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' 
        }}>
          {order.status === 'DELIVERED' ? <CheckCircle size={20} /> : <Navigation size={20} />}
          {order.status === 'DELIVERED' ? t.Delivered : order.status === 'OUT_FOR_DELIVERY' ? t.OutForDelivery : t.Assigned}
        </div>

        {/* COD Block (Most important for delivery) */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid var(--primary)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Banknote size={20} /> {t.ToCollect}
          </p>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{order.finalPrice?.toFixed(2)}</p>
          {order.status === 'DELIVERED' && (
            <p style={{ margin: '0.5rem 0 0 0', color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>Collected ✓</p>
          )}
        </div>

        {/* Customer Details */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} /> {t.CustomerDetails}
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>{order.customerName}</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <MapPin size={18} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
            <p style={{ margin: 0, lineHeight: 1.4 }}>{order.deliveryAddress}<br/><span style={{ fontWeight: 'bold', color: 'var(--text)' }}>{order.shop.area}</span></p>
          </div>
          
          <a href={`tel:${order.customerPhone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f1f5f9', color: 'var(--text)', textDecoration: 'none', fontWeight: 'bold' }}>
            <Phone size={18} /> {t.CallCustomer}
          </a>
        </div>

        {/* Map Location */}
        {order.latitude && order.longitude && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> {t.DeliveryLocation}
            </h3>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <MapView lat={order.latitude} lng={order.longitude} />
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
            >
              <ExternalLink size={18} /> {t.GetDirections}
            </a>
          </div>
        )}

        {/* Shop Details */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={18} /> {t.PickupFrom}
          </h3>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{order.shop.name_en}</p>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{order.shop.address}</p>
          <a href={`tel:${order.shop.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            <Phone size={16} /> {t.CallShop}
          </a>
        </div>

        {/* Order Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>{t.Items} ({order.orderItems.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.orderItems.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f1f5f9', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                  {item.product?.image ? (
                    <Image src={item.product.image} alt={item.productName_en} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛒</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '0.95rem' }}>{item.productName_en}</p>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Action Bar */}
      {order.status !== 'DELIVERED' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', zIndex: 20 }}>
          <div className="container">
            {order.status === 'ASSIGNED' ? (
              <button 
                onClick={() => updateStatus('OUT_FOR_DELIVERY')}
                disabled={updating}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: updating ? 0.7 : 1 }}
              >
                <Navigation size={20} /> {t.StartDelivery}
              </button>
            ) : order.status === 'OUT_FOR_DELIVERY' ? (
              <button 
                onClick={() => setShowConfirm(true)}
                disabled={updating}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#16a34a', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: updating ? 0.7 : 1 }}
              >
                <CheckCircle size={20} /> {t.MarkAsDelivered}
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Banknote size={32} />
            </div>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>{t.ConfirmDelivery}</h2>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)' }}>
              {t.ConfirmDeliveryPrompt} (<strong>₹{order.finalPrice?.toFixed(2)}</strong>)
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#f1f5f9', color: 'var(--text)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t.Cancel}
              </button>
              <button 
                onClick={() => updateStatus('DELIVERED')}
                disabled={updating}
                style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#16a34a', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: updating ? 0.7 : 1 }}
              >
                {t.Confirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
