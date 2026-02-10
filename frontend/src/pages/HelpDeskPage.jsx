import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";
import ArticleContent from "../components/ArticleContent.jsx";
import "./HelpDeskPage.css";
import "./ProductPage.css";

export default function HelpDeskPage() {
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [viewingArticle, setViewingArticle] = useState(null); // The article currently being viewed
  const [expandedSectionId, setExpandedSectionId] = useState(null); // The section expanded in sidebar
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load data
  useEffect(() => {
    Promise.all([
      apiGet("/products/help-desk"),
      apiGet("/products/help-desk/sections"),
      apiGet("/articles") // Assuming we fetch all or filtered by product. For now fetching all and filtering client side if needed or assuming API handles it. 
      // Ideally: apiGet("/products/help-desk/articles") or similar.
      // Let's assum apiGet("/articles") returns all articles and we filter by section.
    ])
      .then(([p, secs, arts]) => {
        setProduct(p);

        // Filter articles for this product's sections
        // We need to know which sections belong to this product. 'secs' should be filtered by product already if the API does it, or we filter here.
        // The previous code did: apiGet("/products/help-desk/sections"), assuming it returns sections for help-desk.

        const sortedSections = [...secs].sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setSections(sortedSections);
        setArticles(arts);

        // Default: Open first section and first article
        if (sortedSections.length > 0) {
          const firstSecId = sortedSections[0].id;
          setExpandedSectionId(firstSecId);

          const firstSecArticles = arts.filter(a => a.section_id === firstSecId);
          if (firstSecArticles.length > 0) {
            setViewingArticle(firstSecArticles[0]);
          }
        }
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading Course...</div>;

  // Find active section based on viewingArticle
  const activeSectionId = viewingArticle ? viewingArticle.section_id : null;
  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", overflow: "hidden", background: "#fff" }}>

      {/* Top Header - Cisco Style */}
      <header style={{
        height: "50px",
        background: "#353635",
        borderBottom: "1px solid #444",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Logo / Brand */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1", justifyContent: "center" }}>
              <div style={{ fontWeight: "700", fontSize: "16px" }}>
                <span style={{ color: "#ff6c00" }}>Core</span><span style={{ color: "#fff" }}>Dev</span>
              </div>
              <div style={{ fontSize: "10px", color: "#ccc", fontWeight: "400", letterSpacing: "0.5px" }}>
                Solutions Inc.
              </div>
            </div>
          </Link>

          <div style={{ height: "20px", width: "1px", background: "#666" }}></div>

          <h1 style={{ fontSize: "16px", fontWeight: "400", color: "#ddd", margin: 0 }}>
            Product / {product?.name || "Knowledge Base"}
          </h1>
        </div>

        {/* Window Controls */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: "#ccc" }}>📖</button>
          <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: "#ccc" }}>✕</button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar Navigation */}
        {isSidebarOpen && (
          <aside className="product-sidebar open">
            {/* Simple Clean Sidebar List */}
            <div className="sidebar-menu">
              {sections.map((sec, index) => {
                const isExpanded = expandedSectionId === sec.id;
                const secArticles = articles.filter(a => a.section_id === sec.id);

                return (
                  <div key={sec.id} className="menu-section">
                    {/* Collapsible Header - Clean Style */}
                    <button
                      className={`menu-item ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                    >
                      <span className="item-text">{sec.title}</span>
                      <span className="chevron">▼</span>
                    </button>

                    {/* Module Content Items (Articles) */}
                    <div className={`submenu ${isExpanded ? 'open' : ''}`}>
                      {secArticles.map((art) => {
                        const isActive = viewingArticle && viewingArticle.id === art.id;
                        return (
                          <div
                            key={art.id}
                            className={`submenu-item ${isActive ? 'active' : ''}`}
                            onClick={() => setViewingArticle(art)}
                          >
                            {art.title}
                          </div>
                        );
                      })}
                      {secArticles.length === 0 && (
                        <div style={{ padding: "10px 20px", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                          No articles
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Content Viewer - Clean Style */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", position: "relative", padding: "40px" }}>
          {/* Mobile Sidebar Toggle (Floating) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              position: "absolute", top: "10px", left: "10px",
              border: "none", background: "none", cursor: "pointer", fontSize: "20px", color: "#333",
              zIndex: 20
            }}
          >
            ☰
          </button>

          <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
            {/* Main Title - Product or Article */}
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#333", marginBottom: "40px" }}>
              {viewingArticle ? viewingArticle.title : (product?.name || "Documentation")}
            </h1>

            {viewingArticle ? (
              <>
                <div style={{
                  color: "#999", fontSize: "12px", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "10px"
                }}>
                  Last updated: {new Date(viewingArticle.updated_at).toLocaleDateString()}
                </div>
                <ArticleContent content={viewingArticle.content} />
              </>
            ) : (
              <div style={{ color: "#999", fontStyle: "italic", fontSize: "14px" }}>
                No content available yet.
              </div>
            )}
          </div>
        </div>

        {/* Floating Navigation Arrows (Optional: Implement Logic later) */}
        <button style={{
          position: "absolute",
          left: "0", top: "50%",
          transform: "translateY(-50%)",
          background: "#fff", border: "1px solid #ddd", borderLeft: "none",
          width: "30px", height: "60px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#ff6c00",
          boxShadow: "2px 0 5px rgba(0,0,0,0.05)"
        }}>
          ❮
        </button>

        <button style={{
          position: "absolute",
          right: "0", top: "50%",
          transform: "translateY(-50%)",
          background: "#fff", border: "1px solid #ddd", borderRight: "none",
          width: "30px", height: "60px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#ff6c00",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.05)"
        }}>
          ❯
        </button>

      </div>
    </div>
  );
}
