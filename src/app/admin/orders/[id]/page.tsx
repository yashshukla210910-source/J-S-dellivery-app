"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChevronLeft, User as UserIcon, Phone, MapPin, Package, Clock, CheckCircle, Zap, Receipt, Store } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AdminOrderDetails() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        if (data.order.status === 'ADMIN_PENDING') {
          // Pre-fill with a suggested amount (cart + 20) or leave empty for them to type.
          // Let's leave empty as required, or prefill with current estimate.
          // We will leave it empty to force them to enter it, but show placeholder.
        } else if (data.order.finalPrice) {
          setFinalPrice(data.order.finalPrice.toString());
        }
      } else {
        router.push("/admin/orders");
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchOrder();
    
    // Refresh periodically in case it auto-approves while we are looking at it
    const interval = setInterval(() => {
      if (order?.status === 'ADMIN_PENDING') fetchOrder();
    }, 5000);
    return () => clearInterval(interval);
  }, [params.id, order?.status]);

  const handleApprove = async () => {
    if (!finalPrice || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) {
      alert("Please enter a valid final price");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalPrice: Number(finalPrice) })
      });
      const data = await res.json();
      
      if (res.ok) {
        setOrder(data.order);
      } else {
        alert(data.error || "Failed to approve order");
        // Re-fetch to see if it auto-approved
        fetchOrder();
      }
    } catch (e) {
      alert("Error approving order");
    } finally {
      setActionLoading(false);
    }
  };

  const CountdownTimer = ({ deadline }: { deadline: string }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = new Date(deadline).getTime() - new Date().getTime();
        setTimeLeft(Math.max(0, Math.floor(difference / 1000)));
      };
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }, [deadline]);

    if (timeLeft === 0) {
      return <span style={{ color: '#dc2626', fontWeight: 'bold' }}>00:00 (Processing...)</span>;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isUrgent = timeLeft <= 10;

    return (
      <span style={{ color: isUrgent ? '#dc2626' : '#ea580c', fontWeight: 'bold', fontSize: '1.2rem' }}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    );
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

  if (!order) return null;

  const isPending = order.status === 'ADMIN_PENDING';

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Order #{order.orderNumber}</h1>
      </div>

      <div className="container" style={{ marginTop: '1rem' }}>

        {/* Status Alert */}
        {isPending ? (
          <div style={{ background: '#fffedd', border: '2px solid #fef08a', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ea580c' }}>
              <Clock size={24} />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Admin Approval Required</h2>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Please set the final price.</p>
              </div>
            </div>
            {order.adminDeadline && (
              <div style={{ textAlign: 'right' }}>
                <CountdownTimer deadline={order.adminDeadline} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Remaining</div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: order.approvalType === 'AUTO' ? '#f5f3ff' : '#f0fdf4', border: `2px solid ${order.approvalType === 'AUTO' ? '#ddd6fe' : '#bbf7d0'}`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: order.approvalType === 'AUTO' ? '#7c3aed' : '#16a34a' }}>
            {order.approvalType === 'AUTO' ? <Zap size={24} /> : <CheckCircle size={24} />}
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
                {order.approvalType === 'AUTO' ? 'Automatically Approved' : 'Admin Approved'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Final price has been set.</p>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        {order.delivery && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} color="var(--primary)" /> Delivery Assignment
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{order.delivery.deliveryBoy.name}</p>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}><Phone size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> {order.delivery.deliveryBoy.phone}</p>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Area: {order.delivery.deliveryBoy.location}</p>
              </div>
              <div style={{ background: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'OUT_FOR_DELIVERY' ? '#fef08a' : '#dbeafe', color: order.status === 'DELIVERED' ? '#16a34a' : order.status === 'OUT_FOR_DELIVERY' ? '#a16207' : '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {order.status}
              </div>
            </div>
          </div>
        )}

        {/* Financials & Approval Form */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '2px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={20} color="var(--primary)" /> Final Financials
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Cart Value (Items)</span>
            <span>₹{order.cartValue.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Final Price to Collect (₹)</label>
            <input 
              type="number" 
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              disabled={!isPending || actionLoading}
              placeholder={`e.g. ${order.cartValue + 20}`}
              style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', background: isPending ? '#f8fafc' : '#f1f5f9' }}
            />
            {isPending && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter the exact amount the delivery boy should collect.</p>}
          </div>

          {isPending && (
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', opacity: actionLoading ? 0.7 : 1 }}
              onClick={handleApprove}
              disabled={actionLoading}
            >
              {actionLoading ? 'Approving...' : 'Approve & Set Final Price'}
            </button>
          )}
        </div>

        {/* Shop Info */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={20} /> Shop Details
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', flexShrink: 0 }}>
              {order.shop.image ? (
                <img src={order.shop.image} alt="Shop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Store size={20} color="var(--text-muted)" />
              )}
            </div>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{language === 'en' ? order.shop.name_en : (order.shop.name_hi || order.shop.name_en)}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Owner: {order.shop.owner.name} • {order.shop.owner.phone}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Customer Details</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <UserIcon size={18} color="var(--text-muted)" />
            <span style={{ fontWeight: 'bold' }}>{order.customerName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Phone size={18} color="var(--text-muted)" />
            <span>{order.customerPhone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <MapPin size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
            <span style={{ lineHeight: 1.4 }}>{order.deliveryAddress}</span>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Products ({order.orderItems.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.orderItems.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', flexShrink: 0 }}>
                    {item.product?.image ? (
                      <img src={item.product.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={16} color="var(--text-muted)" />
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{item.productName_en}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
                <span style={{ fontWeight: 'bold' }}>₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
