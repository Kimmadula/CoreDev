import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";
import "./HelpDeskPage.css"; // Reuse styling
import kbLogo from "../assets/kb.png";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);

  // We primarily track the active ARTICLE. 
  // If a section has no articles, we might show the section description, but let's focus on articles.
  const [activeArticle, setActiveArticle] = useState(null);

  // We also track which section is expanded in the sidebar
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load data
  useEffect(() => {
    setLoading(true);
    setExpandedSectionId(null);
    setActiveArticle(null);

    Promise.all([
      apiGet(`/products/${slug}`),
      apiGet(`/products/${slug}/sections`),
      apiGet("/products"),
    ])
      .then(([p, secs, allProducts]) => {
        setProduct(p);
        setSections(secs);
        setProducts(allProducts);

        // Default Selection Logic
        if (secs.length > 0) {
          setExpandedSectionId(secs[0].id); // Expand first section
          // Select first article of first section if available
          if (secs[0].articles && secs[0].articles.length > 0) {
            setActiveArticle(secs[0].articles[0]);
          }
        }
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading Course...</div>;
  if (err) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "red" }}>Error: {err}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", overflow: "hidden", background: "#fff" }}>

      {/* Top Header */}
      <header style={{
        height: "50px",
        background: "#ffffff",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ fontWeight: "700", color: "#005073", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
              <img src={kbLogo} alt="CoreDev Logo" style={{ height: "24px" }} />
              <span>CoreDev</span>
            </div>
          </Link>
          <div style={{ height: "20px", width: "1px", background: "#ddd" }}></div>
          <h1 style={{ fontSize: "16px", fontWeight: "400", color: "#555", margin: 0 }}>
            Help Desk / {product?.name || "Loading..."}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <select
            value={slug}
            onChange={(e) => window.location.href = `/product/${e.target.value}`}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
              color: "#333",
              background: "#f9f9f9",
              cursor: "pointer"
            }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar Navigation */}
        {isSidebarOpen && (
          <aside style={{
            width: "300px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0
          }}>
            <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}></div>

            <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
              <input placeholder="search section" style={{ width: "100%", padding: "6px 10px", borderRadius: "20px", border: "1px solid #ddd", fontSize: "12px", background: "#fff" }} />
            </div>

            <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
              {sections.map((sec, index) => {
                const isExpanded = expandedSectionId === sec.id;
                return (
                  <div key={sec.id}>
                    {/* Collapsible Header */}
                    <div
                      onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                      style={{
                        padding: "12px 15px",
                        cursor: "pointer",
                        background: isExpanded ? "#e8f5e9" : "#fff",
                        borderLeft: isExpanded ? "4px solid #7cb342" : "4px solid transparent",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      <span style={{ fontWeight: "700", fontSize: "12px", color: "#333" }}>
                        {sec.title}
                      </span>
                      <span style={{ fontSize: "10px", color: isExpanded ? "#7cb342" : "#aaa" }}>
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </div>

                    {/* Articles List (Accordion Content) */}
                    {isExpanded && (
                      <div>
                        {!sec.articles || sec.articles.length === 0 ? (
                          <div style={{ padding: "10px 30px", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                            No articles in this section.
                          </div>
                        ) : (
                          sec.articles.map((article, aIndex) => {
                            const isActive = activeArticle && activeArticle.id === article.id;
                            return (
                              <div
                                key={article.id}
                                onClick={() => setActiveArticle(article)}
                                style={{
                                  padding: "8px 15px 8px 30px",
                                  fontSize: "12px",
                                  color: isActive ? "#000" : "#555",
                                  fontWeight: isActive ? "600" : "400",
                                  backgroundColor: isActive ? "#f1f8e9" : "transparent",
                                  display: "flex", alignItems: "center", gap: "10px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #fafafa"
                                }}
                              >
                                <span style={{
                                  width: "10px", height: "10px",
                                  borderRadius: "50%",
                                  background: isActive ? "#fff" : "transparent",
                                  border: isActive ? "3px solid #7cb342" : "1px solid #ccc",
                                  display: "inline-block"
                                }}></span>
                                {index + 1}.{aIndex + 1} {article.title}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {sections.length === 0 && <div style={{ padding: "30px", textAlign: "center", color: "#999", fontSize: "13px" }}>No sections available for this product.</div>}
            </div>
          </aside>
        )}

        {/* Content Viewer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9f9f9", position: "relative" }}>

          <div style={{ height: "40px", borderBottom: "1px solid #ddd", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: "#666" }}>☰</button>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {activeArticle ? activeArticle.title : "Welcome"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "40px 60px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "40px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", color: "#000" }}>
              {activeArticle ? (
                <>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", color: "#222" }}>
                    {activeArticle.title}
                  </h2>

                  {activeArticle.content ? (
                    <div className="ql-editor" style={{ color: "#000" }} dangerouslySetInnerHTML={{ __html: activeArticle.content }} />
                  ) : (
                    <p style={{ color: "#777" }}>This article has no content yet.</p>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
                  {sections.length > 0 ? "Select an article from the course outline." : "This product has no content."}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
