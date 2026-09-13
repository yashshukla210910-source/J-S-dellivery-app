"use client";

import { Home, Store, ShoppingCart, Package, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();

  // Show Bottom Nav only on user-facing pages, and specifically not on nested shop or cart pages
  if (!pathname.startsWith('/user') || pathname.startsWith('/user/shop/') || pathname === '/user/cart') {
    return null;
  }

  const navItems = [
    { name: "Home", icon: Home, path: "/user" },
    { name: "Cart", icon: ShoppingCart, path: "/user/cart", badge: items.reduce((acc, item) => acc + item.quantity, 0) },
    { name: "Orders", icon: Package, path: "/user/orders" },
    { name: "Profile", icon: User, path: "/user/profile" },
  ];

  return (
    <>
      {/* Spacer to prevent content from hiding behind the fixed nav */}
      <div style={{ height: "70px" }}></div>
      
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70px",
        backgroundColor: "var(--card-bg)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 100,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)"
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/user' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              style={{
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                cursor: "pointer",
                padding: "0.5rem",
                position: "relative"
              }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} style={{ marginBottom: "4px", transition: "all 0.2s ease" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: isActive ? "bold" : "normal" }}>{item.name}</span>
              
              {/* Cart Badge */}
              {item.badge ? (
                <div style={{
                  position: "absolute",
                  top: "2px",
                  right: "8px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "2px solid var(--card-bg)"
                }}>
                  {item.badge}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
}
