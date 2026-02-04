import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";
import ArticleContent from "../components/ArticleContent.jsx";
import "./HelpDeskPage.css";

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
            <div style={{ fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
              <span><span style={{ color: "#ff6c00" }}>Core</span><span style={{ color: "#fff" }}>Dev</span></span> <span style={{ fontWeight: "300", color: "#aaa" }}>|</span> <span style={{ fontWeight: "400", color: "#ddd" }}>Networking Academy</span>
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
          <aside style={{
            width: "300px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0
          }}>
            {/* Tab Header */}
            <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
              <div style={{
                flex: 1,
                padding: "12px",
                textAlign: "center",
                borderBottom: "3px solid #ff6c00",
                color: "#333",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                background: "#f9f9f9"
              }}>
                Course Outline
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
              <input
                placeholder="Search course outline"
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "20px",
                  border: "1px solid #ddd",
                  fontSize: "12px",
                  background: "#fff"
                }}
              />
            </div>

            {/* Sections List */}
            <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
              {sections.map((sec, index) => {
                const isExpanded = expandedSectionId === sec.id;
                const secArticles = articles.filter(a => a.section_id === sec.id);

                return (
                  <div key={sec.id}>
                    {/* Collapsible Header */}
                    <div
                      onClick={() => {
                        setExpandedSectionId(isExpanded ? null : sec.id); // Toggle expansion
                      }}
                      style={{
                        padding: "12px 15px",
                        cursor: "pointer",
                        background: isExpanded ? "#f5f5f5" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      <span style={{ fontWeight: "700", fontSize: "12px", color: "#333" }}>
                        Module {index + 1}: {sec.title}
                      </span>
                      <span style={{ fontSize: "10px", color: "#aaa" }}>
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </div>

                    {/* Module Content Items (Articles) */}
                    {isExpanded && (
                      <div>
                        {secArticles.length === 0 && (
                          <div style={{ padding: "10px 15px", fontSize: "11px", color: "#999", fontStyle: "italic" }}>
                            No articles.
                          </div>
                        )}
                        {secArticles.map((art) => {
                          const isActive = viewingArticle && viewingArticle.id === art.id;
                          return (
                            <div
                              key={art.id}
                              onClick={() => setViewingArticle(art)}
                              style={{
                                padding: "8px 15px 8px 30px",
                                fontSize: "12px",
                                color: isActive ? "#000" : "#555",
                                fontWeight: isActive ? "600" : "400",
                                display: "flex", alignItems: "center", gap: "10px",
                                background: isActive ? "#fff3e0" : "#fff",
                                borderBottom: "1px solid #fafafa",
                                cursor: "pointer",
                                borderLeft: isActive ? "3px solid #ff6c00" : "3px solid transparent"
                              }}
                            >
                              <span style={{
                                width: "8px", height: "8px",
                                borderRadius: "50%",
                                background: isActive ? "#fff" : "transparent",
                                border: isActive ? "2px solid #ff6c00" : "1px solid #ccc",
                                display: "inline-block"
                              }}></span>
                              {art.title}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Content Viewer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9f9f9", position: "relative" }}>

          {/* Breadcrumb Bar */}
          <div style={{
            height: "40px",
            borderBottom: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 15px",
            zIndex: 5,
            position: "relative"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: isSidebarOpen ? "#ff6c00" : "#666" }}
                title="Toggle Sidebar"
              >
                ☰
              </button>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {activeSection ? `${activeSection.title}` : ""}
                {viewingArticle ? ` / ${viewingArticle.title}` : ""}
              </span>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <span style={{ fontSize: "14px", cursor: "pointer" }}>🌙</span>
              <span style={{ fontSize: "14px", cursor: "pointer" }}>🔍</span>
              <span style={{ fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>EN 🌐</span>
              <span style={{ fontSize: "14px", cursor: "pointer" }}>⤢</span>
            </div>
          </div>

          {/* Content Scroll Area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 30px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              {viewingArticle ? (
                <>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", color: "#222" }}>
                    {viewingArticle.title}
                  </h2>

                  <div style={{
                    color: "#999", fontSize: "12px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px"
                  }}>
                    Last updated: {new Date(viewingArticle.updated_at).toLocaleDateString()}
                  </div>

                  <ArticleContent content={viewingArticle.content} />
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
                  Select an article from the course outline to begin.
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
    </div>
  );
}
