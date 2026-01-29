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

  if (loading) return <div className="page-container"><p>Loading...</p></div>;

  return (
    <div className="page-container helpdesk-page">
      {err && <p className="error-message">{err}</p>}

      {product && (
        <header className="page-header">
          <h1>{product.name}</h1>
          {product.description && <p className="page-description">{product.description}</p>}
        </header>
      )}

      <section className="sections-area">
        <h2>Help Topics</h2>
        {sections.length > 0 ? (
          <div className="sections-grid">
            {sections.map((sec) => (
              <div key={sec.id} className="section-card">
                <h3>
                  <Link to={`/section/${sec.slug}`}>{sec.title}</Link>
                </h3>
                <p className="section-meta">{sec.articles_count || 0} articles</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No help topics available yet.</p>
        )}
      </section>
    </div>
  );
}
