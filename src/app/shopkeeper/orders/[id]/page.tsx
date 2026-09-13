"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChevronLeft, User as UserIcon, Phone, MapPin, Package, CheckCircle, XCircle } from "lucide-react";

export default function ShopkeeperOrderDetails() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.order) setOrder(data.order);
        else router.push("/shopkeeper/orders");
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id, router]);

  const handleAction = async (action: 'approve' | 'reject') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shopkeeper/orders/${order.id}/${action}`, {
        method: "PATCH"
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setShowRejectModal(false);
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (e) {
      alert("Error updating order");
    } finally {
      setActionLoading(false);
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

  if (!order) return null;

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Order #{order.orderNumber}</h1>
      </div>

      <div className="container" style={{ marginTop: '1rem' }}>
        
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Products</h2>
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

        {/* Summary */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Cart Value</span>
            <span>₹{order.cartValue.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>Delivery Fee</span>
            <span>₹{order.deliveryFee.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total to Collect</span>
            <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)} (COD)</span>
          </div>
        </div>

      </div>

      {/* Action Buttons for Pending */}
      {order.status === 'PENDING' && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', zIndex: 50 }}>
          <div className="container" style={{ margin: '0 auto', maxWidth: '600px', display: 'flex', gap: '1rem' }}>
            <button 
              style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: actionLoading ? 0.7 : 1 }}
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
            >
              <XCircle size={20} /> Reject Order
            </button>
            <button 
              style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#22c55e', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: actionLoading ? 0.7 : 1 }}
              onClick={() => handleAction('approve')}
              disabled={actionLoading}
            >
              <CheckCircle size={20} /> Accept Order
            </button>
          </div>
        </div>
      )}

      {/* Admin Status Notice */}
      {order.status === 'ADMIN_PENDING' && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: '1rem', background: '#fffedd', borderTop: '1px solid #fef08a', zIndex: 50 }}>
          <div className="container" style={{ margin: '0 auto', maxWidth: '600px', textAlign: 'center', color: '#ea580c', fontWeight: 'bold' }}>
            Waiting for Admin Approval
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '100%', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>Reject Order?</h3>
            <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)' }}>Are you sure you want to reject this order? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button onClick={() => handleAction('reject')} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontWeight: 'bold', cursor: 'pointer' }} disabled={actionLoading}>
                {actionLoading ? 'Rejecting...' : 'Yes, Reject Order'}
              </button>
              <button onClick={() => setShowRejectModal(false)} style={{ padding: '1rem', background: 'none', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
