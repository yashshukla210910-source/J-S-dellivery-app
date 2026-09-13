"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Star, ShoppingCart, Info, MapPin, Store, MessageCircle, AlertTriangle } from "lucide-react";

export default function WhatsAppCatalog({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { language } = useLanguage();
  const { addItem, updateQuantity, items, clearCart } = useCart();
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch(`/api/shops/${resolvedParams.id}/catalog`)
      .then(res => res.json())
      .then(data => {
        if (data.shop) {
          setShop(data.shop);
          setProducts(data.products || []);
        }
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) return (
    <main>
      <Navbar />
      <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
      <div className="container" style={{ marginTop: '1rem' }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </main>
  );

  if (!shop) return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="empty-state" style={{ marginTop: '4rem' }}>
        <Info className="empty-state-icon" />
        <h2>{language === 'hi' ? 'कैटलॉग उपलब्ध नहीं है' : 'Catalog Not Available'}</h2>
        <p>{language === 'hi' ? 'यह दुकान व्हाट्सऐप कैटलॉग का उपयोग नहीं कर रही है।' : 'This shop is not currently sharing a WhatsApp catalog.'}</p>
        <button className="btn-primary" style={{ width: 'auto', marginTop: '1.5rem' }} onClick={() => router.back()}>
          {language === 'hi' ? 'वापस जाएँ' : 'Go Back'}
        </button>
      </div>
    </main>
  );

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const nameEn = p.name_en || "";
    const nameHi = p.name_hi || "";
    const matchSearch = nameEn.toLowerCase().includes(search.toLowerCase()) || nameHi.includes(search);
    return matchCat && matchSearch;
  });

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

  const handleWhatsAppClick = () => {
    // Phase 6 Mode B rule: Show Coming Soon Toast for now.
    alert(language === 'hi' ? "व्हाट्सऐप कैटलॉग इंटीग्रेशन जल्द उपलब्ध होगा। अभी आप LocalMart में इस दुकान का कैटलॉग देख सकते हैं।" : "WhatsApp catalog integration will be available soon. You can browse this shop's catalog inside LocalMart.");
  };

  return (
    <main style={{ paddingBottom: items.length > 0 ? "80px" : "20px", backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      
      {/* WhatsApp style Banner */}
      <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#075e54' }}>
        {shop.whatsappCatalogBanner ? (
          <img src={shop.whatsappCatalogBanner} alt="Catalog banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : shop.image ? (
          <img src={shop.image} alt="Shop cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={64} color="rgba(255,255,255,0.2)" />
          </div>
        )}
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8) 100%)' }}></div>
        
        <button onClick={() => router.back()} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          <ChevronLeft size={28} /> <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', color: 'white' }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0 0 0.25rem 0", textShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {shop.whatsappCatalogTitle || (language === 'en' ? shop.name_en : (shop.name_hi || shop.name_en))}
          </h1>
          {shop.whatsappCatalogDescription && (
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              {shop.whatsappCatalogDescription}
            </p>
          )}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {shop.area}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem' }}>
        
        {/* WhatsApp Integration Button */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#25D366', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
              <MessageCircle size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{language === 'hi' ? 'व्यापार से बात करें' : 'Chat with Business'}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{shop.whatsappNumber ? `+91 ${shop.whatsappNumber.slice(0,5)} ${shop.whatsappNumber.slice(5)}` : (language === 'hi' ? 'कोई नंबर नहीं' : 'No number added')}</p>
            </div>
          </div>
          <button 
            onClick={handleWhatsAppClick}
            style={{ background: '#f0f2f5', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', color: '#075e54', cursor: 'pointer' }}
          >
            {language === 'hi' ? 'मैसेज करें' : 'Message'}
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={language === 'hi' ? 'कैटलॉग में खोजें...' : 'Search in catalog...'}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setCategory(c)}
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '0.6rem 1.25rem', 
                borderRadius: '24px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                backgroundColor: category === c ? '#075e54' : 'white',
                color: category === c ? 'white' : 'var(--text-muted)',
                border: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {c}
            </button>
          ))}
        </div>
        
        {/* Product Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredProducts.length === 0 && (
            <div className="empty-state" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <ShoppingCart className="empty-state-icon" />
              <h3>{language === 'hi' ? 'कोई उत्पाद नहीं' : 'No products found'}</h3>
              <p>{language === 'hi' ? 'इस श्रेणी में कोई उत्पाद नहीं है।' : 'Try selecting a different category or search term.'}</p>
            </div>
          )}

          {filteredProducts.map(p => {
            const inCart = items.find(i => i.id === p.id);
            return (
              <div key={p.id} style={{ background: 'white', borderRadius: '16px', display: 'flex', padding: '1rem', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', opacity: p.isAvailable ? 1 : 0.6 }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '12px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {p.image ? (
                     <img src={p.image} alt={p.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ShoppingCart size={32} color="var(--border)" />
                  )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontWeight: "600", fontSize: "1.1rem", margin: '0 0 0.25rem 0' }}>
                      {language === 'en' ? p.name_en : (p.name_hi || p.name_en)}
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.category}</p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--foreground)", margin: 0 }}>₹{p.price}</p>
                    
                    {p.isAvailable ? (
                      inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#e8f5e9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #4ade80' }}>
                          <button onClick={() => updateQuantity(p.id, inCart.quantity - 1)} style={{ background: 'none', border: 'none', color: '#16a34a', padding: '0.4rem 0.6rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                          <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.95rem', width: '24px', textAlign: 'center' }}>{inCart.quantity}</span>
                          <button onClick={() => updateQuantity(p.id, inCart.quantity + 1)} style={{ background: 'none', border: 'none', color: '#16a34a', padding: '0.4rem 0.6rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(p)}
                          style={{ border: '1px solid #d1d5db', color: 'var(--foreground)', backgroundColor: 'white', padding: '0.5rem 1.25rem', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                        >
                          ADD
                        </button>
                      )
                    ) : (
                      <span className="badge badge-danger">{language === 'hi' ? 'उपलब्ध नहीं' : 'Out of stock'}</span>
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
          <div style={{ position: "fixed", bottom: "1rem", left: "50%", transform: "translateX(-50%)", width: "92%", maxWidth: "600px", zIndex: 50 }}>
            <button 
              className="btn-primary" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(7, 94, 84, 0.4)', background: '#075e54' }}
              onClick={() => router.push('/user/cart')}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingCart size={18} />
                  <span>{items.length} ITEM{items.length > 1 ? 'S' : ''}</span>
                </div>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                {language === 'hi' ? 'कार्ट देखें' : 'View Cart'}
              </span>
            </button>
          </div>
        )}
    </main>
  );
}
