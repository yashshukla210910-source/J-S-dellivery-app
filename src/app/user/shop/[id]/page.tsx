"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Search, Star, ShoppingCart, Info, Clock, MapPin, ChevronRight, Store } from "lucide-react";

export default function ShopDetails() {
  const { t, language } = useLanguage();
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const router = useRouter();
  const params = useParams();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Grocery", "Dairy", "Fruits & Vegetables", "Snacks", "Beverages", "Personal Care", "Household", "Other"];

  useEffect(() => {
    fetch(`/api/shops/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.shop) {
          setShop(data.shop);
          setProducts(data.products || []);
        }
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return (
    <main>
      <Navbar />
      <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
      <div className="container" style={{ marginTop: '1rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
          <div className="skeleton skeleton-card" style={{ height: '200px' }}></div>
        </div>
      </div>
    </main>
  );

  if (!shop) return (
    <main>
      <Navbar />
      <div className="empty-state" style={{ marginTop: '2rem' }}>
        <Info className="empty-state-icon" />
        <h2>{language === 'hi' ? 'दुकान नहीं मिली' : 'Shop not found'}</h2>
        <button className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => router.back()}>{language === 'hi' ? 'वापस जाएँ' : 'Go Back'}</button>
      </div>
    </main>
  );

  const filteredProducts = products.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const nameEn = p.name_en || "";
    const nameHi = p.name_hi || "";
    const matchSearch = nameEn.toLowerCase().includes(search.toLowerCase()) || nameHi.includes(search);
    return matchCat && matchSearch;
  });

  const getCategoryTranslation = (cat: string) => {
    if (language === 'en') return cat;
    const catMap: any = {
      "Grocery": t.CategoryGrocery,
      "Dairy": t.CategoryDairy,
      "Fruits & Vegetables": t.CategoryFruitsVeg,
      "Snacks": t.CategorySnacks,
      "Beverages": t.CategoryBeverages,
      "Personal Care": t.CategoryPersonalCare,
      "Household": t.CategoryHousehold,
      "Other": t.CategoryOther,
      "All": t.CategoryAll
    };
    return catMap[cat] || cat;
  };

  const handleAddToCart = (p: any) => {
    addItem({
      id: p.id,
      name_en: p.name_en,
      name_hi: p.name_hi,
      price: p.price,
      image: p.image,
      shopId: shop.id
    });
  };

  return (
    <main style={{ paddingBottom: items.length > 0 ? "80px" : "20px" }}>
      <Navbar />
      
      {/* Top Banner Cover */}
      <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f1f5f9' }}>
        {shop.image ? (
          <img src={shop.image} alt="Shop cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={64} color="var(--border)" />
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.8) 100%)' }}></div>
        
        <button onClick={() => router.back()} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
          <ChevronLeft size={24} />
        </button>

        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', color: 'white' }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 0.25rem 0", textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {language === 'en' ? shop.name_en : (shop.name_hi || shop.name_en)}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="white" /> 4.5 {language === 'hi' ? 'रेटिंग' : 'Rating'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 10 {language === 'hi' ? 'मिनट' : 'mins'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {shop.area}</span>
          </div>

          {shop.whatsappCatalogEnabled && shop.whatsappCatalogStatus === 'ACTIVE' && (
            <div 
              onClick={() => router.push(`/user/shop/${shop.id}/catalog`)}
              style={{ 
                marginTop: '0.75rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: '#25D366', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '16px', height: '16px' }} />
              {language === 'hi' ? 'व्हाट्सऐप कैटलॉग देखें' : 'View WhatsApp Catalog'}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Search and Categories */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "var(--background)", padding: "1rem 1rem 0 1rem", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={t.SearchPlaceholder}
            className="input-field"
            style={{ borderRadius: '12px', border: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', marginBottom: 0, paddingLeft: '3rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setCategory(c)}
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                backgroundColor: category === c ? 'var(--primary)' : 'white',
                color: category === c ? 'white' : 'var(--text-muted)',
                border: category === c ? 'none' : '1px solid var(--border)',
                boxShadow: category === c ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {getCategoryTranslation(c)}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1rem' }}>
        
        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {filteredProducts.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <ShoppingCart className="empty-state-icon" />
              <h3>{language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No products found'}</h3>
              <p>{language === 'hi' ? 'कोई अन्य श्रेणी या खोज शब्द आज़माएँ।' : 'Try selecting a different category or search term.'}</p>
            </div>
          )}

          {filteredProducts.map(p => {
            const inCart = items.find(i => i.id === p.id);
            return (
              <div key={p.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', position: 'relative', border: '1px solid var(--border)', opacity: p.isAvailable ? 1 : 0.6 }}>
                <div style={{ height: '130px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? (
                     <img src={p.image} alt={p.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ShoppingCart size={40} color="var(--border)" />
                  )}
                </div>
                
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", textTransform: 'uppercase', fontWeight: 'bold' }}>{p.category}</p>
                  <h3 style={{ fontWeight: "600", fontSize: "0.95rem", marginTop: '0.25rem', height: '2.5rem', overflow: 'hidden' }}>
                    {language === 'en' ? p.name_en : (p.name_hi || p.name_en)}
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <p style={{ fontWeight: "bold", fontSize: "1.1rem", color: "var(--foreground)" }}>₹{p.price}</p>
                    
                    {p.isAvailable ? (
                      inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--primary)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                          <button onClick={() => updateQuantity(p.id, inCart.quantity - 1)} style={{ background: 'none', border: 'none', color: 'white', padding: '0.4rem 0.6rem', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{inCart.quantity}</span>
                          <button onClick={() => updateQuantity(p.id, inCart.quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', padding: '0.4rem 0.6rem', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(p)}
                          style={{ border: '1px solid var(--primary)', color: 'var(--primary)', backgroundColor: '#f0fdf4', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                          {language === 'hi' ? 'जोड़ें' : 'ADD'}
                        </button>
                      )
                    ) : (
                      <span className="badge badge-danger">{language === 'hi' ? 'स्टॉक से बाहर' : 'Out of stock'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {items.length > 0 && (
          <div style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "600px", zIndex: 50 }}>
            <button 
              className="btn-primary" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(12, 131, 31, 0.4)' }}
              onClick={() => router.push('/user/cart')}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingCart size={16} />
                  <span>{items.length} {language === 'hi' ? 'आइटम' : `ITEM${items.length > 1 ? 'S' : ''}`}</span>
                </div>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                {language === 'hi' ? 'कार्ट देखें' : 'View Cart'} <ChevronRight size={18} />
              </span>
            </button>
          </div>
        )}
    </main>
  );
}
