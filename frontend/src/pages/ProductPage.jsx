import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";
import "./HelpDeskPage.css"; // Reuse styling
import "./ProductPage.css"; // New responsive styling
import "react-quill-new/dist/quill.snow.css";
import coreDevLogo from "../assets/coredevlogo.png";

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
        // Sort sections by sort_order -> ID
        const sortedSections = [...secs].sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setSections(sortedSections);

        // Sort products by sort_order -> ID
        const sortedProducts = [...allProducts].sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
        setProducts(sortedProducts);

        // Default Selection Logic
        if (secs.length > 0) {
          setExpandedSectionId(sortedSections[0].id); // Expand first section
          // Select first article of first section if available
          if (sortedSections[0].articles && sortedSections[0].articles.length > 0) {
            setActiveArticle(sortedSections[0].articles[0]);
          }
        }
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

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

                  {/* Articles List */}
                  {isExpanded && (
                    <div style={{ background: "#fafafa" }}>
                      {sec.articles && sec.articles.length > 0 ? (
                        sec.articles.map((article, aIndex) => {
                          const isActive = activeArticle && activeArticle.id === article.id;
                          return (
                            <div
                              key={article.id}
                              onClick={() => {
                                setActiveArticle(article);
                                setIsSidebarOpen(false); // Auto-close sidebar on mobile selection
                              }}
                              style={{
                                padding: "10px 15px 10px 25px",
                                fontSize: "12px",
                                color: isActive ? "#000" : "#555",
                                fontWeight: isActive ? "600" : "400",
                                backgroundColor: isActive ? "#fff3e0" : "transparent",
                                display: "flex", alignItems: "center", gap: "10px",
                                cursor: "pointer",
                                borderBottom: "1px solid #fafafa"
                              }}
                            >
                              <span style={{
                                width: "10px", height: "10px",
                                borderRadius: "50%",
                                background: isActive ? "#fff" : "transparent",
                                border: isActive ? "3px solid #ff6c00" : "1px solid #ccc",
                                display: "inline-block"
                              }}></span>
                              {index + 1}.{aIndex + 1} {article.title}
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: "10px 25px", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                          No articles yet.
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
                    <div className="ql-editor" style={{ color: "#000", wordBreak: "keep-all", overflowWrap: "normal", whiteSpace: "normal", textAlign: "left" }}>
                      {(() => {
                        let content = activeArticle.content;
                        try {
                          // Fix common PDF copy-paste artifacts
                          // 1. Remove hyphen+space (common PDF line-break artifact) -> replace with space
                          // NOTE: This might change "Open-Source" to "Open Source", but fixes "word- break" artifacts nicely.
                          // 2. Force remove "Justify" alignment (replace with Left)
                          content = content.replace(/ql-align-justify/g, 'ql-align-left');
                          content = content.replace(/text-align:\s*justify/gi, 'text-align: left');

                          // Force List Styles via inline style injection (in case CSS is missing/overridden)
                          // We append this to the content string so it's part of the sanitized HTML
                          const styleFix = `<style>
                            .ql-editor ul { list-style-type: disc !important; padding-left: 2em !important; }
                            .ql-editor ol { list-style-type: decimal !important; padding-left: 2em !important; }
                            .ql-editor li { display: list-item !important; margin-left: 1em; color: #000 !important; }
                          </style>`;
                          content = styleFix + content;

                          const parser = new DOMParser();
                          const doc = parser.parseFromString(content, 'text/html');

                          // Fix PDF Copy-Paste Issues: Merge fragmented paragraphs (p or div)
                          // We only target elements that don't look like containers (no block children)
                          const blocks = Array.from(doc.querySelectorAll('p, div'));

                          for (let i = 0; i < blocks.length - 1; i++) {
                            const curr = blocks[i];
                            const next = blocks[i + 1];

                            // Skip if they are containers for other blocks (e.g. wrapper root vs inner paragraph)
                            // A simple heuristic: if it has a <p> or <div child, it's a container.
                            // ALSO SKIP LISTS: If a block contains a list, do not try to merge it with text.
                            if (curr.querySelector('p, div, ul, ol, li') || next.querySelector('p, div, ul, ol, li')) continue;

                            // CRITICAL FIX: Ensure they are immediate siblings. 
                            // querySelectorAll returns a flattened list. We must not merge across different parents or skip elements.
                            if (curr.nextElementSibling !== next) continue;

                            const currText = curr.textContent.trim();
                            const nextText = next.textContent.trim();

                            if (!currText || !nextText) continue;

                            const lastChar = currText.slice(-1);
                            const firstChar = nextText[0];

                            // Check if this looks like a fragmented line (no punctuation at end)
                            // We allow merging if it DOES NOT end in punctuation.
                            // CRITICAL FIX: Do NOT merge if the NEXT line looks like a bullet point or list item.
                            const isNextBullet = /^[•\-\*⁃]/.test(nextText) || /^\d+\./.test(nextText);

                            if (!/[.!?:;]/.test(lastChar) && !isNextBullet) {
                              let separator = " ";
                              let shouldMerge = true;

                              // Heuristics
                              // Heuristics
                              if (lastChar === "-") {
                                // "Open-" + "Source" -> "OpenSource"
                                curr.innerHTML = curr.innerHTML.replace(/-$/, '');
                                separator = "";
                              }
                              // REMOVED UNSAFE HEURISTIC: Joining two lower-case lines without space caused run-on words.
                              // e.g. "end" + "start" -> "endstart". Better to have "end start".
                              // We now default to separator = " " unless there's a hyphen.

                              if (shouldMerge) {
                                curr.innerHTML = curr.innerHTML + separator + next.innerHTML;
                                next.remove();
                                blocks.splice(i + 1, 1); // Remove the merged element from the array references
                                i--; // Backtrack to simple check if the *new* combined block can merge with the *next* one
                              }
                            }
                          }

                          // Handle YouTube links in anchor tags
                          const links = Array.from(doc.querySelectorAll('a'));
                          let modified = false;

                          links.forEach(link => {
                            const href = link.getAttribute('href');
                            const ytMatch = href && href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);

                            if (ytMatch) {
                              const videoId = ytMatch[1];
                              const wrapper = doc.createElement('div');
                              wrapper.style.maxWidth = "100%"; // Responsive
                              wrapper.style.margin = "0 auto 2rem auto";

                              const inner = doc.createElement('div');
                              inner.style.position = "relative";
                              inner.style.paddingBottom = "56.25%";
                              inner.style.height = "0";
                              inner.style.overflow = "hidden";
                              inner.style.borderRadius = "8px"; // Polish

                              inner.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" 
                                      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                      allowfullscreen></iframe>`;

                              wrapper.appendChild(inner);

                              // Replace the link's parent if it's just a paragraph wrapping the link
                              if (link.parentNode && link.parentNode.tagName === 'P' && link.parentNode.childNodes.length === 1) {
                                link.parentNode.parentNode.replaceChild(wrapper, link.parentNode);
                              } else {
                                link.replaceWith(wrapper);
                              }
                              modified = true;
                            }
                          });

                          return <div className="ql-editor" dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
                        } catch (e) {
                          console.error("Error parsing content:", e);
                          return <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />;
                        }
                      })()}
                    </div>
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
