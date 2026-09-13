"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronLeft, Package, Clock, CheckCircle, XCircle, Store, MapPin, Receipt, Wallet } from "lucide-react";

export default function UserOrderDetails() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else {
          alert("Order not found");
          router.push("/user/orders");
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id, router]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': 
      case 'SHOPKEEPER_APPROVED':
      case 'ADMIN_PENDING':
        return <Clock size={20} color="#eab308" />;
      case 'ADMIN_APPROVED': 
      case 'AUTO_APPROVED':
        return <CheckCircle size={20} color="#22c55e" />;
      case 'SHOPKEEPER_REJECTED': return <XCircle size={20} color="#ef4444" />;
      default: return <Package size={20} />;
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'hi') {
      switch (status) {
        case 'PENDING': return 'दुकानदार की स्वीकृति का इंतज़ार';
        case 'SHOPKEEPER_APPROVED': return 'दुकानदार ने स्वीकार किया';
        case 'ADMIN_PENDING': return 'एडमिन की स्वीकृति का इंतज़ार';
        case 'ADMIN_APPROVED': return 'एडमिन ने ऑर्डर स्वीकृत कर दिया है';
        case 'AUTO_APPROVED': return 'ऑर्डर अपने आप स्वीकृत हो गया है';
        case 'SHOPKEEPER_REJECTED': return 'दुकानदार ने अस्वीकार किया';
        default: return status;
      }
    }
    switch (status) {
      case 'PENDING': return 'Waiting for shopkeeper approval';
      case 'SHOPKEEPER_APPROVED': return 'Shopkeeper Approved';
      case 'ADMIN_PENDING': return 'Waiting for admin approval';
      case 'ADMIN_APPROVED': return 'Order approved by admin';
      case 'AUTO_APPROVED': return 'Order automatically approved';
      case 'SHOPKEEPER_REJECTED': return 'Shopkeeper Rejected';
      default: return status;
    }
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Order Details</h1>
      </div>

      <div className="container" style={{ marginTop: '1rem' }}>
        
        {/* Status Banner */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Order #{order.orderNumber}</h2>
          
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #e2e8f0', marginLeft: '0.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '0', background: 'white', borderRadius: '50%' }}>
                <CheckCircle size={18} color="#22c55e" />
              </div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{language === 'hi' ? 'ऑर्डर दिया गया' : 'Order Placed'}</p>
            </div>
            
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '0', background: 'white', borderRadius: '50%' }}>
                {['PENDING'].includes(order.status) ? (
                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white' }}></div>
                ) : order.status === 'SHOPKEEPER_REJECTED' ? (
                   <XCircle size={18} color="#ef4444" />
                ) : (
                   <CheckCircle size={18} color="#22c55e" />
                )}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', color: ['PENDING'].includes(order.status) ? 'var(--text-muted)' : 'var(--text)' }}>
                {language === 'hi' ? 'दुकानदार द्वारा स्वीकृत' : 'Shopkeeper Approved'}
              </p>
              {order.status === 'SHOPKEEPER_REJECTED' && (
                <p style={{ margin: 0, color: '#ef4444', fontSize: '0.85rem' }}>Rejected by shopkeeper</p>
              )}
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '0', background: 'white', borderRadius: '50%' }}>
                {['PENDING', 'SHOPKEEPER_APPROVED', 'SHOPKEEPER_REJECTED', 'ADMIN_PENDING'].includes(order.status) ? (
                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white' }}></div>
                ) : (
                   <CheckCircle size={18} color="#22c55e" />
                )}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', color: ['PENDING', 'SHOPKEEPER_APPROVED', 'SHOPKEEPER_REJECTED', 'ADMIN_PENDING'].includes(order.status) ? 'var(--text-muted)' : 'var(--text)' }}>
                {order.status === 'AUTO_APPROVED' ? (language === 'hi' ? 'स्वचालित स्वीकृति' : 'Automatically Approved') : (language === 'hi' ? 'एडमिन द्वारा स्वीकृत' : 'Admin Approved')}
              </p>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '0', background: 'white', borderRadius: '50%' }}>
                {['PENDING', 'SHOPKEEPER_APPROVED', 'SHOPKEEPER_REJECTED', 'ADMIN_PENDING', 'ADMIN_APPROVED', 'AUTO_APPROVED', 'READY_FOR_DELIVERY'].includes(order.status) ? (
                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white' }}></div>
                ) : (
                   <CheckCircle size={18} color="#22c55e" />
                )}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', color: ['PENDING', 'SHOPKEEPER_APPROVED', 'SHOPKEEPER_REJECTED', 'ADMIN_PENDING', 'ADMIN_APPROVED', 'AUTO_APPROVED', 'READY_FOR_DELIVERY'].includes(order.status) ? 'var(--text-muted)' : 'var(--text)' }}>
                {language === 'hi' ? 'डिलीवरी पार्टनर असाइन किया गया' : 'Delivery Partner Assigned'}
              </p>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '0', background: 'white', borderRadius: '50%' }}>
                {['PENDING', 'SHOPKEEPER_APPROVED', 'SHOPKEEPER_REJECTED', 'ADMIN_PENDING', 'ADMIN_APPROVED', 'AUTO_APPROVED', 'READY_FOR_DELIVERY', 'ASSIGNED'].includes(order.status) ? (
                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white' }}></div>
                ) : order.status === 'OUT_FOR_DELIVERY' ? (
                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '4px solid #eab308', background: 'white' }}></div>
                ) : (
                   <CheckCircle size={18} color="#22c55e" />
                )}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', color: ['PENDING', 'SHOPKEEPER_APPROVED', 'SHOPKEEPER_REJECTED', 'ADMIN_PENDING', 'ADMIN_APPROVED', 'AUTO_APPROVED', 'READY_FOR_DELIVERY', 'ASSIGNED'].includes(order.status) ? 'var(--text-muted)' : order.status === 'OUT_FOR_DELIVERY' ? '#a16207' : 'var(--text)' }}>
                {language === 'hi' ? 'डिलीवरी के लिए निकल गया' : 'Out for Delivery'}
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '0', background: 'white', borderRadius: '50%' }}>
                {order.status === 'DELIVERED' ? (
                   <CheckCircle size={18} color="#22c55e" />
                ) : (
                   <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white' }}></div>
                )}
              </div>
              <p style={{ margin: 0, fontWeight: 'bold', color: order.status === 'DELIVERED' ? '#16a34a' : 'var(--text-muted)' }}>
                {language === 'hi' ? 'डिलीवर हो गया' : 'Delivered'}
              </p>
            </div>
          </div>
        </div>

        {order.delivery && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{language === 'hi' ? 'डिलीवरी पार्टनर' : 'Delivery Partner'}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} color="var(--primary)" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{order.delivery.deliveryBoy.name}</p>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>LocalMart Partner</p>
              </div>
            </div>
          </div>
        )}

        {/* Shop Info */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Store color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
              {language === 'en' ? order.shop.name_en : (order.shop.name_hi || order.shop.name_en)}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <MapPin size={16} />
            <span>{order.shop.area}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Delivery To</h3>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{order.customerName}</p>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{order.customerPhone}</p>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{order.deliveryAddress}</p>
        </div>

        {/* Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={20} /> Items ({order.orderItems.length})
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.orderItems.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', flexShrink: 0 }}>
                    {item.product?.image ? (
                      <img src={item.product.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={20} color="var(--text-muted)" />
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                      {language === 'en' ? item.productName_en : (item.productName_hi || item.productName_en)}
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
                <span style={{ fontWeight: 'bold' }}>₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Bill Details</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Cart Value</span>
            <span>₹{order.cartValue.toFixed(2)}</span>
          </div>
          
          {order.status === 'AUTO_APPROVED' ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>Auto Charge</span>
              <span>₹20.00</span>
            </div>
          ) : order.status === 'ADMIN_APPROVED' ? (
             <></> // No specific breakdown, just final price
          ) : (
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
             </div>
          )}
          
          <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Final Amount</span>
            {order.status === 'ADMIN_PENDING' || order.status === 'PENDING' || order.status === 'SHOPKEEPER_APPROVED' ? (
              <span style={{ fontSize: '1rem', color: '#ea580c' }}>Pending</span>
            ) : order.finalPrice ? (
              <span style={{ color: 'var(--primary)' }}>₹{order.finalPrice.toFixed(2)}</span>
            ) : (
              <span>₹{order.totalAmount.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wallet color="var(--primary)" />
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Payment</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Cash on Delivery</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
