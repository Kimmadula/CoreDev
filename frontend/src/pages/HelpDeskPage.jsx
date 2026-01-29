import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api.js";
import "./HelpDeskPage.css";

export default function HelpDeskPage() {
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet("/products/help-desk"),
      apiGet("/products/help-desk/sections"),
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
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {err && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem",
          background: "#fee",
          color: "#c33",
          borderRadius: "4px",
          marginTop: "2rem"
        }}>
          {err}
        </div>
      )}

      {product && (
        <header style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "4rem 2rem",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: "700" }}>
              {product.name}
            </h1>
            {product.description && (
              <p style={{ fontSize: "1.1rem", opacity: 0.95 }}>
                {product.description}
              </p>
            )}
          </div>
        </header>
      )}

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1a1a1a" }}>
          Topics
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
                  e.currentTarget.style.borderColor = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}>
                  <h3 style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1.2rem",
                    color: "#667eea",
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
            <p>No topics available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
