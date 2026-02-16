import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGet } from "../api.js";
import "./LandingPage.css";
import coreDevLogo from "../assets/coredevlogo.png";
import bgImage from "../assets/bg3.jpg";
import BackToTop from "../components/BackToTop.jsx";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // For dropdown
  const [loading, setLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) {
        apiGet(`/search?q=${searchQuery}`)
          .then(data => setSearchResults(data))
          .catch(err => {
            console.error(err);
            toast.error("Search failed: " + String(err));
          });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    document.title = "Knowledge Base";
    apiGet("/products")
      .then((data) => {
        data.sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        toast.error("Failed to load products: " + String(err));
        setLoading(false);
      });
  }, []);

  // Helper to assign icons and links based on slug
  const getProductMeta = (p) => {
    const slug = p.slug;
    let icon = "📦"; // Default icon
    let link = `/product/${slug}`;

    // Custom mappings
    if (slug === "iaccs-2013") {
      icon = "📋";
    } else if (slug === "farm-pro") {
      icon = "📋";
    } else if (slug === "farm-pro") {
      icon = "📍";
    } else if (slug === "orange-pay") {
      icon = "💳";
    } else if (slug === "e-services") {
      icon = "✅";
    }

    return { icon, link };
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="landing-page">
      {/* Top Header */}
      <header style={{
        height: "50px",
        background: "#353635",
        borderBottom: "1px solid #444",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
              <img src={coreDevLogo} alt="CoreDev Logo" style={{ height: "24px" }} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1", justifyContent: "center" }}>
                <div style={{ fontWeight: "700", fontSize: "16px" }}>
                  <span style={{ color: "#ff6c00" }}>Core</span><span style={{ color: "#fff" }}>Dev</span>
                </div>
                <div style={{ fontSize: "10px", color: "#ccc", fontWeight: "400", letterSpacing: "0.5px" }}>
                  Solutions Inc.
                </div>
              </div>
            </div>
          </Link>
          <div style={{ height: "20px", width: "1px", background: "#666" }}></div>
          <h1 style={{ fontSize: "16px", fontWeight: "400", color: "#ddd", margin: 0 }}>
            Knowledge Base
          </h1>
        </div>
      </header>

      {/* Main Content Padding for Fixed Header */}
      <div style={{ paddingTop: "50px" }}>

        {/* Hero Section */}
        <section className="hero" style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}>
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
                  placeholder="Search keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", outline: "none", color: "#000" }}
                />

                {/* Search Dropdown Results */}
                {searchResults.length > 0 && (
                  <div className="search-dropdown" style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    borderRadius: "0 0 8px 8px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    maxHeight: "300px",
                    overflowY: "auto",
                    zIndex: 50,
                    marginTop: "5px",
                    textAlign: "left"
                  }}>
                    {searchResults.map((res, idx) => (
                      <Link to={res.link} key={idx} style={{ textDecoration: 'none' }} onClick={() => setSearchResults([])}>
                        <div style={{
                          padding: "12px 20px",
                          borderBottom: "1px solid #f0f0f0",
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                          onMouseOver={(e) => e.currentTarget.style.background = "#f9f9f9"}
                          onMouseOut={(e) => e.currentTarget.style.background = "white"}
                        >
                          <div style={{ color: "#333", fontWeight: "600", fontSize: "14px" }}>{res.title}</div>
                          <div style={{ color: "#888", fontSize: "11px", textTransform: 'uppercase' }}>
                            {res.type} {res.subtitle ? `• ${res.subtitle}` : ''}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll Down Arrow - Moved outside hero-content to stick to bottom */}
          <div
            className="scroll-arrow"
            onClick={() => {
              const el = document.querySelector('.products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">Products</h2>

            <div className="products-list">
              {loading ? (
                <p>Loading products...</p>
              ) : (
                filteredProducts.map((product) => {
                  const { icon, link } = getProductMeta(product);
                  return (
                    <Link to={link} key={product.id} className="product-list-item">
                      <div className="product-content">
                        <div className="product-icon">{icon}</div>
                        <div className="product-info">
                          <div className="product-name">{product.name}</div>
                          {/* Optional description if available in future */}
                        </div>
                      </div>
                      <div className="product-chevron">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </Link>
                  );
                })
              )}
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

        <BackToTop />
      </div>
    </div>
  );
}
