"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (e) {
      }
    };
    if (params.id) fetchOrder();
  }, [params.id]);

  if (!order) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton skeleton-card" style={{ width: '90%', maxWidth: '400px', height: '400px' }}></div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#f0fdf4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem 1.5rem', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 40px rgba(22, 163, 74, 0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <CheckCircle size={80} color="#16a34a" />
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#16a34a' }}>
          {language === 'en' ? 'Order Placed Successfully!' : 'आपका ऑर्डर सफलतापूर्वक भेज दिया गया है।'}
        </h1>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {language === 'en' ? 'Waiting for shopkeeper approval' : 'दुकानदार की स्वीकृति का इंतज़ार'}
        </p>

        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order ID</span>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{order.orderNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Shop</span>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{language === 'en' ? order.shop.name_en : (order.shop.name_hi || order.shop.name_en)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Payment</span>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Cash on Delivery</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}
            onClick={() => router.push(`/user/orders/${order.id}`)}
          >
            {language === 'en' ? 'View Order' : 'ऑर्डर देखें'}
          </button>
          <button 
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'none', border: '1px solid var(--border)', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => router.push('/user')}
          >
            {language === 'en' ? 'Continue Shopping' : 'खरीदारी जारी रखें'}
          </button>
        </div>

      </div>
    </main>
  );
}
