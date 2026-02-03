import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";
import "./HelpDeskPage.css";

export default function HelpDeskPage() {
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load data
  useEffect(() => {
    Promise.all([
      apiGet("/products/help-desk"),
      apiGet("/products/help-desk/sections"),
    ])
      .then(([p, secs]) => {
        setProduct(p);
        // Sort by ID Ascending (Oldest to Newest)
        // Ensure IDs are treated as numbers
        const sortedSections = [...secs].sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setSections(sortedSections);
        if (sortedSections.length > 0) setActiveSectionId(sortedSections[0].id);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading Course...</div>;

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
            Product / {product?.name || "Help Desk"}
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
              <div style={{
                flex: 1,
                padding: "12px",
                textAlign: "center",
                color: "#666",
                fontSize: "13px",
                cursor: "pointer",
                borderBottom: "1px solid transparent"
              }}>
                Resources
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
                const isActive = activeSectionId === sec.id;
                return (
                  <div key={sec.id}>
                    {/* Collapsible Header */}
                    <div
                      onClick={() => setActiveSectionId(sec.id)}
                      style={{
                        padding: "12px 15px",
                        cursor: "pointer",
                        background: isActive ? "#fff3e0" : "#fff",
                        borderLeft: isActive ? "4px solid #ff6c00" : "4px solid transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      <span style={{ fontWeight: "700", fontSize: "12px", color: "#333" }}>
                        Module {index + 1}: {sec.title}
                      </span>
                      <span style={{ fontSize: "10px", color: isActive ? "#ff6c00" : "#aaa" }}>
                        {isActive ? "▼" : "▶"}
                      </span>
                    </div>

                    {/* Module Content Items */}
                    {isActive && (
                      <div>
                        {/* Static/Mock Sub-items for visual fidelity to image */}
                        <div style={{
                          padding: "8px 15px 8px 30px",
                          fontSize: "12px",
                          color: "#555",
                          display: "flex", alignItems: "center", gap: "10px",
                          borderBottom: "1px solid #fafafa"
                        }}>
                          <span style={{
                            width: "10px", height: "10px",
                            borderRadius: "50%",
                            border: "1px solid #ccc",
                            display: "inline-block"
                          }}></span>
                          {index + 1}.0.1 Introduction
                        </div>

                        <div style={{
                          padding: "8px 15px 8px 30px",
                          fontSize: "12px",
                          color: "#000",
                          fontWeight: "600",
                          display: "flex", alignItems: "center", gap: "10px",
                          background: "#fff3e0"
                        }}>
                          <span style={{
                            width: "10px", height: "10px",
                            borderRadius: "50%",
                            background: "#fff",
                            border: "3px solid #ff6c00",
                            display: "inline-block"
                          }}></span>
                          {index + 1}.0.2 {sec.title} File Types
                        </div>

                        <div style={{
                          padding: "8px 15px 8px 30px",
                          fontSize: "12px",
                          color: "#555",
                          display: "flex", alignItems: "center", gap: "10px",
                          borderBottom: "1px solid #fafafa"
                        }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", border: "1px solid #ccc", display: "inline-block" }}></span>
                          {index + 1}.0.3 Assessment
                        </div>
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
            padding: "0 15px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: "#666" }}
              >
                ☰
              </button>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {activeSection ? `2.0.1 ${activeSection.title} File Types` : "Welcome"}
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
          <div style={{ flex: 1, overflowY: "auto", padding: "40px 60px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "40px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              {activeSection ? (
                <>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px", color: "#222" }}>
                    2.0.1 {activeSection.title} File Types
                  </h2>

                  <p style={{ lineHeight: "1.7", color: "#333", marginBottom: "20px", fontSize: "15px" }}>
                    We hope you enjoyed the <strong>{product?.name || "course"}</strong> activity in the previous module.
                    In that part, you learned how to navigate both the logical and physical interface, identify devices,
                    and explore connection types.
                  </p>

                  <p style={{ lineHeight: "1.7", color: "#333", marginBottom: "20px", fontSize: "15px" }}>
                    Speaking of data types, it is important to understand the different file types you will find when using the system.
                  </p>

                  <div style={{
                    borderLeft: "4px solid #ff6c00",
                    padding: "15px",
                    background: "#fff3e0",
                    marginBottom: "30px",
                    color: "#e65100",
                    fontSize: "14px"
                  }}>
                    <strong>Note:</strong> {activeSection.description || "The system creates four different types of files. These file types are used for different purposes."}
                  </div>

                  {/* Accordion Mocks */}
                  {["The .pka File Type", "The .pkt File Type", "The .pksz File Type", "The .pkz File Type"].map((item, i) => (
                    <div key={i} style={{
                      border: "1px solid #eee",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        padding: "15px 20px",
                        background: "#fbfbfb",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "#444"
                      }}>
                        {item}
                        <span>⌄</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
                  Select a module from the course outline to begin.
                </div>
              )}
            </div>
          </div>

          {/* Floating Navigation Arrows */}
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
