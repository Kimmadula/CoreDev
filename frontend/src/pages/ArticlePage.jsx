import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../api.js";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/articles/${slug}`)
      .then(setArticle)
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <p>Loading article...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 2rem" }}>
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

        {article && (
          <article>
            <Link to="/" style={{
              color: "#667eea",
              textDecoration: "none",
              fontSize: "0.9rem",
              marginBottom: "2rem",
              display: "inline-block"
            }}>
              ← Back
            </Link>

            <h1 style={{
              fontSize: "2.5rem",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
              marginTop: "1rem"
            }}>
              {article.title}
            </h1>

            <div style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginBottom: "2rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid #e5e7eb"
            }}>
              Last updated: {new Date(article.updated_at).toLocaleDateString()}
            </div>

            <div style={{
              fontSize: "1rem",
              lineHeight: "1.8",
              color: "#374151",
              maxWidth: "100%"
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        )}
      </div>
    </div>
  );
}
