"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { t, language } = useLanguage();
  const { items, updateQuantity, clearCart, total } = useCart();
  const router = useRouter();

  const uniqueShops = new Set(items.map((item) => item.shopId)).size;
  const deliveryFee = 20 * uniqueShops;

  const handleCheckout = () => {
    alert("Checkout flow is coming in Phase 3! (Payment, Address, Delivery)");
  };

  return (
    <main style={{ paddingBottom: "100px" }}>
      <Navbar />
      
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "var(--background)", padding: "1rem", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
          {t.Cart}
        </h1>
      </div>

      <div className="container" style={{ marginTop: "1rem", maxWidth: "600px", padding: "0 1rem" }}>

        {items.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag className="empty-state-icon" size={64} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.CartEmptyTitle}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t.CartEmptyDesc}</p>
            <button className="btn-primary" onClick={() => router.push('/user')} style={{ width: 'auto' }}>{t.BrowseShops}</button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>⏱</span>
                  <span style={{ fontWeight: 'bold' }}>{t.DeliveryIn10MinsLower}</span>
                </div>
              </div>
              
              <div className="flex-col" style={{ gap: 0 }}>
                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {item.image ? (
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={item.image} alt={item.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', color: 'var(--border)' }}>
                          <ShoppingCart size={24} />
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontWeight: "600", fontSize: '0.95rem' }}>{language === 'en' ? item.name_en : (item.name_hi || item.name_en)}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: '0.8rem', marginTop: '0.2rem' }}>₹{item.price}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--primary)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'white', padding: '0.4rem 0.6rem', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', padding: '0.4rem 0.6rem', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>{t.BillDetails}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                <span>{t.ItemTotal}</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <span>{t.DeliveryFeeCalc?.replace('{count}', uniqueShops.toString()) || `Delivery Fee (₹20 x ${uniqueShops})`}</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              
              <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>{t.ToPay}</span>
                <span>₹{(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>

            {/* Clear Cart */}
            <button 
              onClick={clearCart}
              style={{ width: '100%', padding: '1rem', background: 'none', border: 'none', color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {t.EmptyCartAction}
            </button>

            {/* Floating Pay Button */}
            <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "600px", zIndex: 50 }}>
              <button 
                className="btn-primary" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(12, 131, 31, 0.4)' }}
                onClick={() => router.push('/user/checkout')}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{(total + deliveryFee).toFixed(2)}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>{t.Total?.toUpperCase() || "TOTAL"}</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  {t.ProceedToCheckout} <span>→</span>
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
