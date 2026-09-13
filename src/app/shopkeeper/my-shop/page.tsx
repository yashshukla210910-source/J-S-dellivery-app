"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "next/navigation";

export default function MyShop() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name_en: "",
    name_hi: "",
    description_en: "",
    description_hi: "",
    phone: "",
    area: "Kothi",
    address: "",
    image: ""
  });

  useEffect(() => {
    fetch("/api/shopkeeper/shop")
      .then(res => res.json())
      .then(data => {
        if (data.shop) {
          setShop(data.shop);
          setFormData(data.shop);
        }
        setLoading(false);
      });
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = shop ? "PUT" : "POST";
    const res = await fetch("/api/shopkeeper/shop", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setShop(data.shop);
      alert("Saved successfully!");
      router.push("/shopkeeper");
    } else {
      alert(data.error);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading...</div>;

  return (
    <main>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem", maxWidth: "600px" }}>
        <div className="card">
          <h1 className="title" style={{ textAlign: "center" }}>
            {shop ? t.EditShop : t.CreateShop}
          </h1>
          {shop && (
            <div style={{ marginBottom: "1rem", color: "var(--border-color)", textAlign: "center" }}>
              Status: <strong style={{color: shop.status === 'ACTIVE' ? 'green' : 'orange'}}>{shop.status}</strong>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex-col">
            <input type="text" placeholder="Shop Name (English)" className="input-field" value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} required />
            <input type="text" placeholder="Shop Name (Hindi)" className="input-field" value={formData.name_hi} onChange={(e) => setFormData({...formData, name_hi: e.target.value})} />
            <input type="text" placeholder="Description (English)" className="input-field" value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} />
            <input type="text" placeholder="Description (Hindi)" className="input-field" value={formData.description_hi} onChange={(e) => setFormData({...formData, description_hi: e.target.value})} />
            <input type="text" placeholder="Phone Number" className="input-field" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            <input type="text" placeholder="Address" className="input-field" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>Shop Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: "0.5rem" }} />
              {formData.image && <img src={formData.image} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", display: "block" }} />}
            </div>

            <select className="input-field" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}>
              <option value="Kothi">Kothi</option>
              <option value="Jaitwar">Jaitwar</option>
              <option value="Maihar">Maihar</option>
            </select>
            <button type="submit" className="btn-primary">{t.Save}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
