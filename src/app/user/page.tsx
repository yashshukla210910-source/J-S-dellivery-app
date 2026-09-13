"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { User, Search, Store, ShoppingBag, Droplet, Leaf, Cookie, CupSoda, Smile, Home as HomeIcon, Package, ChevronRight, Star } from "lucide-react";

export default function UserDashboard() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { items } = useCart();
  const [area, setArea] = useState("Kothi");
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const categories = [
    { name: t.CategoryGrocery || "Grocery", icon: ShoppingBag, color: "#dcfce7", textColor: "#16a34a" },
    { name: t.CategoryDairy || "Dairy", icon: Droplet, color: "#e0f2fe", textColor: "#0284c7" },
    { name: t.CategoryFruitsVeg || "Fruits & Veg", icon: Leaf, color: "#dcfce7", textColor: "#15803d" },
    { name: t.CategorySnacks || "Snacks", icon: Cookie, color: "#fef08a", textColor: "#ca8a04" },
    { name: t.CategoryBeverages || "Beverages", icon: CupSoda, color: "#fee2e2", textColor: "#dc2626" },
    { name: t.CategoryPersonalCare || "Personal Care", icon: Smile, color: "#f3e8ff", textColor: "#9333ea" },
    { name: t.CategoryHousehold || "Household", icon: HomeIcon, color: "#e0e7ff", textColor: "#4f46e5" },
    { name: t.CategoryOther || "Other", icon: Package, color: "#f3f4f6", textColor: "#4b5563" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shops?area=${area}`)
      .then(res => res.json())
      .then(data => {
        setShops(data.shops || []);
        setLoading(false);
      });
  }, [area]);

  const filteredShops = shops.filter(s => {
    const nameEn = s.name_en || "";
    const nameHi = s.name_hi || "";
    return nameEn.toLowerCase().includes(search.toLowerCase()) || nameHi.includes(search);
  });

  return (
    <main style={{ paddingBottom: "10px" }}>
      <Navbar />
      <div className="container" style={{ marginTop: "1rem" }}>
        
        {/* Sticky Header Section */}
        <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "var(--background)", paddingTop: "1rem", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{t.DeliveryIn10Mins}</span>
              <select className="input-field" style={{ width: "auto", marginBottom: 0, border: 'none', background: 'transparent', padding: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--foreground)' }} value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="Kothi">Kothi, MP ▼</option>
                <option value="Jaitwar">Jaitwar, MP ▼</option>
                <option value="Maihar">Maihar, MP ▼</option>
              </select>
            </div>
            <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={20} />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder={t.SearchPlaceholder}
              className="input-field"
              style={{ borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: 'none', paddingLeft: '3rem', marginBottom: 0 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '1.5rem', paddingBottom: '1rem', marginTop: '1rem' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '70px' }}>
                <div style={{ backgroundColor: cat.color, padding: '1rem', borderRadius: '20px', color: cat.textColor }}>
                  <Icon size={28} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap' }}>{cat.name}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
          <h2 className="title" style={{ fontSize: "1.25rem", margin: 0 }}>{t.NearbyShops}</h2>
          <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{t.SeeAll}</span>
        </div>
        
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            <div className="skeleton skeleton-card" style={{ height: '220px' }}></div>
            <div className="skeleton skeleton-card" style={{ height: '220px' }}></div>
            <div className="skeleton skeleton-card" style={{ height: '220px' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {filteredShops.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <Store size={48} className="empty-state-icon" />
                <h3>{t.NoShopsFound}</h3>
                <p>{t.NoShopsFoundDesc?.replace('{area}', area)}</p>
              </div>
            )}
            
            {filteredShops.map(s => (
              <div key={s.id} onClick={() => router.push(`/user/shop/${s.id}`)} style={{cursor: 'pointer', background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', transition: 'transform 0.2s ease'}}>
                <div style={{ height: '140px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                  {s.image ? (
                    <img src={s.image} alt={s.name_en} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                  ) : (
                    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'}}>
                      <Store size={40} opacity={0.5} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: 'var(--shadow-sm)' }}>
                    10 mins
                  </div>
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontWeight: "bold", fontSize: "1rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {language === 'en' ? s.name_en : (s.name_hi || s.name_en)}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'var(--primary)', color: 'white', padding: '2px 4px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      4.5 <Star size={10} fill="white" />
                    </div>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: '0.25rem' }}>{t.CategoryGrocery || "Grocery"} • {s.area}</p>
                  
                  {s.whatsappCatalogEnabled && s.whatsappCatalogStatus === 'ACTIVE' && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/user/shop/${s.id}/catalog`);
                      }}
                      style={{ 
                        marginTop: '0.75rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        backgroundColor: '#25D366', 
                        color: 'white', 
                        padding: '0.5rem', 
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        justifyContent: 'center'
                      }}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '16px', height: '16px' }} />
                      {language === 'hi' ? 'व्हाट्सऐप कैटलॉग' : 'WhatsApp Catalog'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
