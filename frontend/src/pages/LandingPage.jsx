import { useState } from "react";
import "./LandingPage.css";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { id: 1, name: "Help Desk", icon: "🛡️" },
    { id: 2, name: "IACCS 2013", icon: "📋" },
    { id: 3, name: "Farm Pro Management", icon: "📍" },
    { id: 4, name: "Membership Application", icon: "👥" },
    { id: 5, name: "OrangePay Plus", icon: "💳" },
    { id: 6, name: "E-Services", icon: "✅" },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Knowledge Base</h1>
          <p className="hero-subtitle">Explore and learn more about our products.</p>

          <div className="search-container">
            <div className="search-wrapper">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="search"
                placeholder="Search for products, features, or documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Products</h2>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-icon">{product.icon}</div>
                <div className="product-name">{product.name}</div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.6, marginTop: 32 }}>
              No products found matching "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-item">Documentation</div>
            <div className="footer-item">Community</div>
            <div className="footer-item">Support</div>
          </div>
          <div className="copyright">© 2026 CoreDev. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
