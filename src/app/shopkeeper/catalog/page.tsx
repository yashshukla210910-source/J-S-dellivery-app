"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronLeft, MessageCircle, Save, Settings, Package, Eye, EyeOff, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopkeeperCatalog() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, productsRes] = await Promise.all([
        fetch("/api/shopkeeper/catalog/settings"),
        fetch("/api/shopkeeper/products") // reuse existing products API for shopkeeper
      ]);
      const settingsData = await settingsRes.json();
      const productsData = await productsRes.json();
      
      if (settingsData.settings) {
        setSettings({
          whatsappNumber: settingsData.settings.whatsappNumber || "",
          whatsappCatalogEnabled: settingsData.settings.whatsappCatalogEnabled || false,
          whatsappCatalogTitle: settingsData.settings.whatsappCatalogTitle || "",
          whatsappCatalogDescription: settingsData.settings.whatsappCatalogDescription || "",
          whatsappCatalogBanner: settingsData.settings.whatsappCatalogBanner || "",
          whatsappCatalogStatus: settingsData.settings.whatsappCatalogStatus || "ACTIVE"
        });
      } else {
        setSettings({
          whatsappNumber: "",
          whatsappCatalogEnabled: false,
          whatsappCatalogTitle: "",
          whatsappCatalogDescription: "",
          whatsappCatalogBanner: "",
          whatsappCatalogStatus: "ACTIVE"
        });
      }
      if (productsData.products) {
        setProducts(productsData.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/shopkeeper/catalog/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber: settings.whatsappNumber,
          whatsappCatalogEnabled: settings.whatsappCatalogEnabled,
          whatsappCatalogTitle: settings.whatsappCatalogTitle,
          whatsappCatalogDescription: settings.whatsappCatalogDescription,
          whatsappCatalogBanner: settings.whatsappCatalogBanner
        })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(language === 'hi' ? 'सेटिंग्स सेव हो गईं' : 'Settings saved successfully');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleProductVisibility = async (product: any) => {
    const newVal = !product.isCatalogVisible;
    // Optimistic update
    setProducts(products.map(p => p.id === product.id ? { ...p, isCatalogVisible: newVal } : p));
    
    try {
      await fetch(`/api/shopkeeper/catalog/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCatalogVisible: newVal })
      });
    } catch (e) {
      console.error(e);
      // Revert on fail
      setProducts(products.map(p => p.id === product.id ? { ...p, isCatalogVisible: !newVal } : p));
    }
  };

  if (loading) return (
    <main>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card" style={{ height: "400px" }}></div>
      </div>
    </main>
  );

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: "1rem" }}>
        <button onClick={() => router.push('/shopkeeper')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#25D366', padding: '1rem', borderRadius: '50%', color: 'white', boxShadow: 'var(--shadow-sm)' }}>
            <MessageCircle size={28} />
          </div>
          <div>
            <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>WhatsApp Catalog</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your public store listing</p>
          </div>
        </div>

        {settings?.whatsappCatalogStatus === 'SUSPENDED' && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Your catalog has been suspended by the admin. Please contact support.
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'settings' ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            <Settings size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Settings
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            <Package size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Products ({products.filter(p => p.isCatalogVisible).length}/{products.length})
          </button>
        </div>

        {activeTab === 'settings' && (
          <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Enable Catalog</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Make your store visible to the public</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.whatsappCatalogEnabled}
                  onChange={(e) => setSettings({...settings, whatsappCatalogEnabled: e.target.checked})}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>WhatsApp Number</label>
              <input 
                type="text" 
                placeholder="e.g. 9876543210" 
                className="input-field" 
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
              />
              <small style={{ color: 'var(--text-muted)' }}>Enter your 10-digit mobile number</small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Catalog Title (Optional)</label>
              <input 
                type="text" 
                placeholder="Custom title for your catalog" 
                className="input-field" 
                value={settings.whatsappCatalogTitle}
                onChange={(e) => setSettings({...settings, whatsappCatalogTitle: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Catalog Description (Optional)</label>
              <textarea 
                placeholder="Welcome message or shop description..." 
                className="input-field" 
                style={{ minHeight: '100px', resize: 'vertical' }}
                value={settings.whatsappCatalogDescription}
                onChange={(e) => setSettings({...settings, whatsappCatalogDescription: e.target.value})}
              ></textarea>
            </div>

            <button 
              className="btn-primary" 
              onClick={saveSettings} 
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
            >
              <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Select products to show in your public catalog</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: 'white', borderRadius: '16px', display: 'flex', padding: '1rem', gap: '1rem', boxShadow: 'var(--shadow-sm)', opacity: p.isAvailable ? 1 : 0.6 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {p.image ? (
                       <img src={p.image} alt={p.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={24} color="var(--border)" />
                    )}
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontWeight: "600", fontSize: "1.1rem", margin: '0 0 0.25rem 0' }}>
                        {p.name_en}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.category} • ₹{p.price}</p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      {!p.isAvailable && <span className="badge badge-danger">Out of stock</span>}
                      {p.isAvailable && <span></span>}
                      
                      <button 
                        onClick={() => toggleProductVisibility(p)}
                        style={{ 
                          background: p.isCatalogVisible ? '#e8f5e9' : '#f1f5f9', 
                          border: p.isCatalogVisible ? '1px solid #4ade80' : '1px solid #cbd5e1', 
                          color: p.isCatalogVisible ? '#16a34a' : '#64748b', 
                          padding: '0.4rem 1rem', 
                          borderRadius: '20px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem'
                        }}
                      >
                        {p.isCatalogVisible ? <><Eye size={16} /> Visible</> : <><EyeOff size={16} /> Hidden</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
