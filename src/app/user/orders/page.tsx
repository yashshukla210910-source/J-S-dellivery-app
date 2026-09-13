"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserOrders() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} />;
      case 'SHOPKEEPER_APPROVED': return <Clock size={16} />;
      case 'ADMIN_PENDING': return <Clock size={16} />;
      case 'SHOPKEEPER_REJECTED': return <XCircle size={16} />;
      case 'ADMIN_APPROVED': return <CheckCircle size={16} />;
      case 'AUTO_APPROVED': return <CheckCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': 
      case 'SHOPKEEPER_APPROVED': 
      case 'ADMIN_PENDING': 
        return 'badge-warning';
      case 'SHOPKEEPER_REJECTED': return 'badge-danger';
      case 'ADMIN_APPROVED': 
      case 'AUTO_APPROVED': 
        return 'badge-success';
      default: return 'badge-warning';
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'PENDING': return 'दुकानदार की प्रतीक्षा';
        case 'SHOPKEEPER_APPROVED': return 'दुकानदार ने स्वीकार किया';
        case 'ADMIN_PENDING': return 'एडमिन की स्वीकृति का इंतज़ार';
        case 'SHOPKEEPER_REJECTED': return 'दुकानदार ने अस्वीकार किया';
        case 'ADMIN_APPROVED': return 'एडमिन द्वारा स्वीकृत';
        case 'AUTO_APPROVED': return 'स्वचालित रूप से स्वीकृत';
        default: return status;
      }
    }
    switch (status) {
      case 'PENDING': return 'Waiting for Shopkeeper';
      case 'SHOPKEEPER_APPROVED': return 'Shopkeeper Approved';
      case 'ADMIN_PENDING': return 'Waiting for Admin Approval';
      case 'SHOPKEEPER_REJECTED': return 'Shopkeeper Rejected';
      case 'ADMIN_APPROVED': return 'Admin Approved';
      case 'AUTO_APPROVED': return 'Automatically Approved';
      default: return status;
    }
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {language === 'en' ? 'Your Orders' : 'आपके ऑर्डर'}
        </h1>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton skeleton-card" style={{ height: '120px' }}></div>
            <div className="skeleton skeleton-card" style={{ height: '120px' }}></div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Package size={64} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {language === 'en' ? 'No orders yet' : 'अभी कोई ऑर्डर नहीं'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {language === 'en' ? 'Your local shopping journey starts here.' : 'आपकी स्थानीय खरीदारी की यात्रा यहाँ से शुरू होती है।'}
            </p>
            <button onClick={() => router.push('/user')} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              {language === 'en' ? 'Explore Shops' : 'दुकानें खोजें'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div 
                key={order.id} 
                className="card" 
                style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                onClick={() => router.push(`/user/orders/${order.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', flexShrink: 0 }}>
                      {order.shop.image ? (
                        <img src={order.shop.image} alt="Shop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Store size={20} color="var(--text-muted)" />
                      )}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                        {language === 'en' ? order.shop.name_en : (order.shop.name_hi || order.shop.name_en)}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusClass(order.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{language === 'hi' ? 'कुल राशि' : 'Total Amount'}</span>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    {language === 'en' ? 'View Details' : 'विवरण देखें'} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
