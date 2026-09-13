"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { Package, Clock, CheckCircle, Zap, User as UserIcon, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const { language } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh pending queue every 10 seconds
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders/pending");
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
        if (data.stats) setStats(data.stats);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

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
      return <span style={{ color: '#dc2626', fontWeight: 'bold' }}>Expired</span>;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isWarning = timeLeft <= 30;
    const isUrgent = timeLeft <= 10;

    return (
      <span style={{ 
        color: isUrgent ? '#dc2626' : (isWarning ? '#ea580c' : '#22c55e'), 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <Clock size={16} />
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    );
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Admin Orders</h1>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton skeleton-card" style={{ height: '100px' }}></div>
            <div className="skeleton skeleton-card" style={{ height: '150px' }}></div>
          </div>
        ) : (
          <>
            {/* Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.25rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ea580c', marginBottom: '0.5rem' }}>
                  <Clock size={20} />
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pending</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.pending || 0}</h2>
              </div>
              
              <div className="card" style={{ padding: '1.25rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', marginBottom: '0.5rem' }}>
                  <CheckCircle size={20} />
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Approved</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.approvedToday || 0}</h2>
              </div>

              <div className="card" style={{ padding: '1.25rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  <Zap size={20} />
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Auto Approved</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.autoApproved || 0}</h2>
              </div>

              <div className="card" style={{ padding: '1.25rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <Package size={20} />
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Total</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.total || 0}</h2>
              </div>
            </div>

            {/* Pending Queue */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Pending Approval ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <CheckCircle size={64} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>All caught up!</h2>
                  <p style={{ color: 'var(--text-muted)' }}>No orders currently require your approval.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div 
                      key={order.id} 
                      className="card" 
                      style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid #fdba74', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.1)' }}
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>#{order.orderNumber}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <UserIcon size={14} /> {order.customer.name}
                          </div>
                        </div>
                        {order.adminDeadline && (
                          <div style={{ background: '#fffedd', padding: '0.5rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                            <CountdownTimer deadline={order.adminDeadline} />
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        <Store size={16} color="var(--primary)" />
                        <span>{language === 'en' ? order.shop.name_en : (order.shop.name_hi || order.shop.name_en)}</span>
                      </div>

                      <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cart Value</span>
                          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>₹{order.cartValue.toFixed(2)}</p>
                        </div>
                        <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Review & Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
