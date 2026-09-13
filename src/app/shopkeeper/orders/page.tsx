"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { Package, Clock, CheckCircle, XCircle, ChevronRight, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopkeeperOrders() {
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/shopkeeper/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const otherOrders = orders.filter(o => o.status !== 'PENDING');

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': 
      case 'ADMIN_PENDING':
        return 'badge-warning';
      case 'SHOPKEEPER_APPROVED': 
      case 'ADMIN_APPROVED':
      case 'AUTO_APPROVED':
        return 'badge-success';
      case 'SHOPKEEPER_REJECTED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hr ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t.Orders}</h1>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton skeleton-card" style={{ height: '120px' }}></div>
            <div className="skeleton skeleton-card" style={{ height: '120px' }}></div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Package size={64} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>No new orders</h2>
            <p style={{ color: 'var(--text-muted)' }}>New customer orders will appear here.</p>
          </div>
        ) : (
          <>
            {pendingOrders.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} /> Needs Action ({pendingOrders.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="card" 
                      style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid #fdba74', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.1)', background: '#fffedd' }}
                      onClick={() => router.push(`/shopkeeper/orders/${order.id}`)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ea580c', backgroundColor: '#ffedd5', padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: '0.5rem', display: 'inline-block' }}>NEW ORDER</span>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 'bold' }}>#{order.orderNumber}</h3>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Received {formatTimeAgo(order.createdAt)}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <UserIcon size={16} color="var(--text-muted)" />
                          <span>{order.customerName}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>•</div>
                        <div>{order.orderItems.length} Items</div>
                      </div>

                      <div style={{ borderTop: '1px dashed #fdba74', margin: '1rem 0' }}></div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Value</span>
                          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#ea580c' }}>₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                        <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Review Order</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherOrders.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Past Orders</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {otherOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="card" 
                      style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                      onClick={() => router.push(`/shopkeeper/orders/${order.id}`)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 'bold' }}>#{order.orderNumber}</h3>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`badge ${getStatusClass(order.status)}`}>
                          {order.status === 'ADMIN_PENDING' ? 'Waiting for Admin' : order.status === 'SHOPKEEPER_REJECTED' ? 'Rejected' : 'Approved'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{order.customerName} • {order.orderItems.length} items</span>
                        <span style={{ fontWeight: 'bold' }}>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
