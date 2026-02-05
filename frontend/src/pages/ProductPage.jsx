import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { apiGet } from "../api.js";
import ArticleContent from "../components/ArticleContent.jsx";
import "./HelpDeskPage.css"; // Reuse styling
import "./ProductPage.css"; // New responsive styling
import "react-quill-new/dist/quill.snow.css";
import coreDevLogo from "../assets/coredevlogo.png";

export default function ProductPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);

  // We primarily track the active ARTICLE. 
  const [activeArticle, setActiveArticle] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load data
  useEffect(() => {
    setLoading(true);
    // setExpandedSectionId(null); // Don't reset this eagerly, let logic decide
    // setActiveArticle(null);

    Promise.all([
      apiGet(`/products/${slug}`),
      apiGet(`/products/${slug}/sections`),
      apiGet("/products"),
    ])
      .then(([p, secs, allProducts]) => {
        setProduct(p);
        if (p?.name) {
          document.title = p.name;
        }

        const sortedSections = [...secs].sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setSections(sortedSections);

        const sortedProducts = [...allProducts].sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setProducts(sortedProducts);

        // PERSISTENCE LOGIC
        const articleParam = searchParams.get("article");
        let foundArticle = null;
        let foundSectionId = null;

        if (articleParam) {
          // Find the article in the sections (and sub-sections)
          for (const sec of sortedSections) {
            // 1. Check direct articles
            if (sec.articles) {
              const match = sec.articles.find(a => String(a.id) === articleParam);
              if (match) {
                foundArticle = match;
                foundSectionId = sec.id;
                break;
              }
            }
            // 2. Check sub-sections
            if (!foundArticle && sec.sub_sections) {
              for (const sub of sec.sub_sections) {
                if (sub.articles) {
                  const match = sub.articles.find(a => String(a.id) === articleParam);
                  if (match) {
                    foundArticle = match;
                    foundSectionId = sec.id;
                    break;
                  }
                }
              }
            }
            if (foundArticle) break;
          }
        }

        if (foundArticle) {
          setActiveArticle(foundArticle);
          setExpandedSectionId(foundSectionId);
        } else {
          // Check for Section ID param
          const sectionParam = searchParams.get("section");
          if (sectionParam) {
            const targetSection = sortedSections.find(s => String(s.id) === sectionParam);
            if (targetSection) {
              setExpandedSectionId(targetSection.id);
              // Optional: Auto-select first article of that section if desired?
              // For now, just expand section as requested.
            } else {
              // Fallback if section bad
              if (sortedSections.length > 0) setExpandedSectionId(sortedSections[0].id);
            }
          } else {
            // Default Selection Logic
            if (sortedSections.length > 0) {
              setExpandedSectionId(sortedSections[0].id);
              if (sortedSections[0].articles && sortedSections[0].articles.length > 0) {
                setActiveArticle(sortedSections[0].articles[0]);
                // Update URL to match default
                setSearchParams({ article: sortedSections[0].articles[0].id }, { replace: true });
              }
            }
          }
        }
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [slug]); // Only re-run if SLUG changes (switching products). 

  // Handle article click
  const handleArticleClick = (article, sectionId) => {
    setActiveArticle(article);
    setIsSidebarOpen(false); // Auto-close sidebar on mobile
    setSearchParams({ article: article.id });
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading Course...</div>;
  if (err) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "red" }}>Error: {err}</div>;

  return (
    <div className="product-page-container">

      {/* Top Header */}
      <header className="product-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
              <img src={coreDevLogo} alt="CoreDev Logo" style={{ height: "24px" }} />
              <span><span style={{ color: "#ff6c00" }}>Core</span><span style={{ color: "#fff" }}>Dev</span></span>
            </div>
          </Link>
          <div style={{ height: "20px", width: "1px", background: "#666" }}></div>
          <h1 style={{ fontSize: "16px", fontWeight: "400", color: "#ddd", margin: 0 }}>
            Knowledge Base / {product?.name || "Loading..."}
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
      <div className="product-page-main">

        {/* Sidebar Navigation */}
        <aside className={`product-sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
                      background: isExpanded ? "#fff3e0" : "#fff",
                      borderLeft: isExpanded ? "4px solid #ff6c00" : "4px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <span style={{ fontWeight: "700", fontSize: "12px", color: "#333" }}>
                      {sec.title}
                    </span>
                    <span style={{ fontSize: "10px", color: isExpanded ? "#ff6c00" : "#aaa" }}>
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </div>

                  {/* Sub Sections List (Clickable directly) */}
                  {isExpanded && (
                    <div style={{ background: "#fafafa" }}>
                      {sec.sub_sections && sec.sub_sections.length > 0 ? (
                        sec.sub_sections.map((sub, subIndex) => {
                          const hasArticles = sub.articles && sub.articles.length > 0;
                          // Check if the ACTIVE article belongs to this sub-section
                          const isActive = activeArticle && sub.articles && sub.articles.some(a => a.id === activeArticle.id);

                          return (
                            <div
                              key={sub.id}
                              onClick={() => {
                                if (hasArticles) {
                                  handleArticleClick(sub.articles[0], sec.id);
                                }
                              }}
                              style={{
                                padding: "10px 15px 10px 25px",
                                fontSize: "13px",
                                color: isActive ? "#000" : "#555",
                                fontWeight: isActive ? "600" : "400",
                                backgroundColor: isActive ? "#fff3e0" : "#fbfbfb",
                                borderLeft: isActive ? "3px solid #ff6c00" : "3px solid transparent",
                                borderBottom: "1px solid #eaeaea",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "10px",
                                transition: "all 0.2s"
                              }}>
                              <span style={{
                                width: "6px", height: "6px",
                                borderRadius: "50%",
                                background: isActive ? "#ff6c00" : "#ccc",
                                display: "inline-block"
                              }}></span>
                              {sub.title}
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: "10px 25px", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                          No sub sections.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {sections.length === 0 && <div style={{ padding: "30px", textAlign: "center", color: "#999", fontSize: "13px" }}>No sections available for this product.</div>}
          </div>
        </aside>

        {/* Content Viewer */}
        <div className="product-content-area">

          <div style={{ height: "40px", borderBottom: "1px solid #ddd", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px", position: "sticky", top: 0, zIndex: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: "#666" }}>☰</button>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {activeArticle ? activeArticle.title : "Welcome"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
            </div>
          </div>

          <div className="product-article-container">
            <div className="article-card">
              {activeArticle ? (
                <>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", color: "#e65100" }}>
                    {activeArticle.title}
                  </h2>

                  {activeArticle.content ? (
                    <ArticleContent content={activeArticle.content} />
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
    </div >
  );
}
