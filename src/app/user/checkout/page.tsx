"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ChevronLeft, MapPin, Phone, User as UserIcon, Wallet, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const uniqueShops = new Set(items.map(i => i.shopId)).size;
  const deliveryFee = 20 * uniqueShops;
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Kothi",
    address: ""
  });
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (items.length === 0 && !placingOrder) {
      router.push("/user/cart");
    }
  }, [items, router, placingOrder]);

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert(t.PleaseFillAllDetails || "Please fill in all delivery details");
      return;
    }
    if (!coordinates) {
      alert(t.PleaseDropPin || "Please drop a pin on the map for your delivery location.");
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, quantity: i.quantity, shopId: i.shopId })),
          deliveryAddress: `${form.area}, ${form.address}`,
          customerName: form.name,
          customerPhone: form.phone,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        alert("Order(s) placed successfully!");
        router.push(`/user/orders`);
      } else {
        alert(data.error || "Failed to place order");
        setPlacingOrder(false);
      }
    } catch (e) {
      alert("Something went wrong");
      setPlacingOrder(false);
    }
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{t.PlaceOrder}</h1>
      </div>

      <div className="container" style={{ marginTop: '1rem' }}>
        
        {/* Delivery Address */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MapPin color="var(--primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{t.DeliveryDetails}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.FullName}</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                <UserIcon size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} 
                  placeholder="Rahul Singh" 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.PhoneNumber}</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                <Phone size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="tel" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})}
                  style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} 
                  placeholder="+91" 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.Area}</label>
              <select 
                value={form.area} 
                onChange={e => setForm({...form, area: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', background: '#f8fafc' }}
              >
                <option value="Kothi">Kothi</option>
                <option value="Jaitwar">Jaitwar</option>
                <option value="Maihar">Maihar</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.DetailedAddress}</label>
              <textarea 
                value={form.address} 
                onChange={e => setForm({...form, address: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', background: '#f8fafc', minHeight: '80px', resize: 'vertical' }}
                placeholder=""
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', marginTop: '1rem' }}>{t.PinLocationMap}</label>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <MapPicker onLocationSelect={(lat, lng) => setCoordinates({ lat, lng })} />
              </div>
              {!coordinates && (
                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{t.MapPinRequired}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Wallet color="var(--primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{t.PaymentMethod}</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', border: '2px solid var(--primary)', background: '#f0fdf4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle color="var(--primary)" />
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{t.CashOnDelivery}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{t.PayWhenDelivered}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{t.OrderSummary}</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>{t.ItemTotal} ({items.length} {t.Items})</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>{t.DeliveryFeeCalc?.replace('{count}', uniqueShops.toString()) || `Delivery Fee (₹20 x ${uniqueShops})`}</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>
          
          <div style={{ borderTop: '1px dashed var(--border)', margin: '1rem 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <span>{t.ToPay}</span>
            <span>₹{(total + deliveryFee).toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Floating Place Order Button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', zIndex: 50 }}>
        <div className="container" style={{ margin: '0 auto', maxWidth: '600px' }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', borderRadius: '16px', fontSize: '1.1rem', opacity: placingOrder ? 0.7 : 1 }}
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? t.PlacingOrder : t.PlaceOrder}
          </button>
        </div>
      </div>

    </main>
  );
}
