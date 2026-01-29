import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";

export default function SectionPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [section, setSection] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet(`/sections/${slug}/articles`),
    ])
      .then(([articles]) => {
        setArticles(articles);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}>
        <Link to="/" style={{
          color: "#667eea",
          textDecoration: "none",
          fontSize: "0.9rem",
          marginBottom: "2rem",
          display: "inline-block"
        }}>
          ← Back
        </Link>

        {err && (
          <div style={{
            padding: "1rem",
            background: "#fee",
            color: "#c33",
            borderRadius: "4px",
            marginBottom: "2rem"
          }}>
            {err}
          </div>
        )}

        <h1 style={{
          fontSize: "2.5rem",
          color: "#1a1a1a",
          marginBottom: "0.5rem"
        }}>
          Articles
        </h1>

        <h2 style={{
          fontSize: "1.3rem",
          color: "#6b7280",
          marginBottom: "3rem",
          marginTop: "2rem",
          fontWeight: "500"
        }}>
          Browse articles in this section
        </h2>

        {articles.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem"
          }}>
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
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
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column"
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
                    fontSize: "1.1rem",
                    color: "#667eea",
                    fontWeight: "600"
                  }}>
                    {article.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginTop: "auto"
                  }}>
                    Read article →
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
            <p>No articles in this section yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
