"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Products() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name_en: "",
    name_hi: "",
    description_en: "",
    description_hi: "",
    price: "",
    category: "Grocery",
    image: "",
    isAvailable: true
  });

  const categories = ["Grocery", "Dairy", "Fruits & Vegetables", "Snacks", "Beverages", "Personal Care", "Household", "Other"];

  const fetchProducts = async () => {
    const res = await fetch("/api/shopkeeper/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/shopkeeper/products/${editingProduct.id}` : "/api/shopkeeper/products";
    const method = editingProduct ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/shopkeeper/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
  };

  const edit = (p: any) => {
    setFormData(p);
    setEditingProduct(p);
    setShowForm(true);
  };

  const addNew = () => {
    setFormData({
      name_en: "", name_hi: "", description_en: "", description_hi: "",
      price: "", category: "Grocery", image: "", isAvailable: true
    });
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadData
    });

    const data = await res.json();
    if (res.ok) {
      setFormData({...formData, image: data.url});
    } else {
      alert("Image upload failed: " + data.error);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading...</div>;

  return (
    <main>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="title">{t.Products}</h1>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={addNew}>{t.AddProduct}</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="title">{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="flex-col">
              <input type="text" placeholder="Name (English)" className="input-field" value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} required />
              <input type="text" placeholder="Name (Hindi)" className="input-field" value={formData.name_hi} onChange={(e) => setFormData({...formData, name_hi: e.target.value})} />
              <input type="number" placeholder="Price (₹)" min="0" step="0.01" className="input-field" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              <select className="input-field" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Description (English)" className="input-field" value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} />
              <input type="text" placeholder="Description (Hindi)" className="input-field" value={formData.description_hi} onChange={(e) => setFormData({...formData, description_hi: e.target.value})} />
              
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: "0.5rem" }} />
                {formData.image && <img src={formData.image} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", display: "block" }} />}
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} />
                {t.Available}
              </label>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary">{t.Save}</button>
                <button type="button" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }} onClick={() => setShowForm(false)}>{t.Cancel}</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {products.map(p => (
            <div key={p.id} className="card" style={{ opacity: p.isAvailable ? 1 : 0.6 }}>
              {p.image && <img src={p.image} alt={p.name_en} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '1rem' }} />}
              <h3 style={{ fontWeight: 'bold' }}>{p.name_en}</h3>
              <p style={{ color: 'var(--border-color)', fontSize: '0.9rem' }}>{p.category}</p>
              <p style={{ fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--primary)' }}>₹{p.price}</p>
              {!p.isAvailable && <p style={{ color: 'red', fontSize: '0.8rem' }}>{t.Unavailable}</p>}
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={() => edit(p)} className="btn-primary" style={{ padding: '0.25rem', fontSize: '0.9rem' }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn-primary" style={{ padding: '0.25rem', fontSize: '0.9rem', backgroundColor: '#ef4444' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
