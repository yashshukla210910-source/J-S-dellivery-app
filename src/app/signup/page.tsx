"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Signup() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    password: "",
    role: "USER",
    location: "Kothi"
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect based on role
      const roleStr = data.user.role.toLowerCase();
      router.push(`/${roleStr}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container" style={{ marginTop: "2rem", maxWidth: "400px" }}>
        <div className="card">
          <h1 className="title" style={{ textAlign: "center" }}>{t.Signup}</h1>
          {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
          <form onSubmit={handleSubmit} className="flex-col">
            <input
              type="text"
              placeholder="Name"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <select
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="USER">Customer</option>
              <option value="SHOPKEEPER">Shopkeeper</option>
              <option value="DELIVERY">Delivery Boy</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              className="input-field"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            >
              <option value="Kothi">Kothi</option>
              <option value="Jaitwar">Jaitwar</option>
              <option value="Maihar">Maihar</option>
            </select>
            <button type="submit" className="btn-primary">
              {t.Signup}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
