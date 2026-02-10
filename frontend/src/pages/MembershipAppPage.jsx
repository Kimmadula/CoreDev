import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api.js";
import "./MembershipAppPage.css";
import coreDevLogo from "../assets/coredevlogo.png";

export default function MembershipAppPage() {
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet("/products/membership-application"),
      apiGet("/products/membership-application/sections"),
    ])
      .then(([p, secs]) => {
        setProduct(p);
        setSections(secs);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {err && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem",
          background: "#fee",
          color: "#c33",
          borderRadius: "4px",
          marginTop: "6rem",
          position: "relative",
          zIndex: 1
        }}>
          {err}
        </div>
      )}

      {product && (
        <header style={{
          height: "50px",
          background: "#353635",
          borderBottom: "1px solid #444",
          display: "flex",
          alignItems: "center",
          padding: "0 15px",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 1000,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          boxSizing: "border-box"
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
              {product.name}
            </h1>
          </div>
        </header>
      )}

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem", paddingTop: "80px" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1a1a1a" }}>
          Guides
        </h2>

        {sections.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem"
          }}>
            {sections.map((sec) => (
              <Link
                key={sec.id}
                to={`/section/${sec.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                <div style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "2rem",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                  boxSizing: "border-box"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "#ff6c00";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}>
                  <h3 style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1.2rem",
                    color: "#ff6c00",
                    fontWeight: "600"
                  }}>
                    {sec.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "0.9rem"
                  }}>
                    {sec.articles_count || 0} article{sec.articles_count !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "3rem 2rem",
            color: "#6b7280",
            fontStyle: "italic"
          }}>
            <p>No guides available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
