import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./Admin.css";
import { apiAdmin, apiGet } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";

// Register custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace'];
Quill.register(Font, true);

// Register custom sizes
const Size = Quill.import('attributors/style/size');
const fontSizeArr = ['10px', '12px', '14px', '16px', '18px', '24px', '32px'];
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function AdminArticlesPage() {
  const [items, setItems] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();
  const subSectionFilterId = searchParams.get("sub_section");
  const sectionFilterId = searchParams.get("section"); // Keeping for backward compatibility or direct section links

  // Form & Modal State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Generic Field State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [selectedSubSectionId, setSelectedSubSectionId] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  // Edit State specific
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editSubSectionId, setEditSubSectionId] = useState("");
  const [editAutoSlug, setEditAutoSlug] = useState(false);


  // Refs for custom handlers
  const quillRef = useRef(null);
  const activeEditorRef = useRef(null);
  const colorInputRef = useRef(null);
  const bgInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [subSectionFilterId, sectionFilterId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, subSecRes] = await Promise.all([
        apiAdmin("/admin/articles", { method: "GET" }),
        apiAdmin("/admin/sub-sections", { method: "GET" }),
      ]);

      setSubSections(subSecRes);

      let filteredArticles = artRes;
      if (subSectionFilterId) {
        filteredArticles = artRes.filter(a => a.sub_section_id == subSectionFilterId);
        // Helper: Find the sub section to display name
        const currentSub = subSecRes.find(s => s.id == subSectionFilterId);
        if (currentSub) {
          // Can set page title state here if wanted
        }
      } else if (sectionFilterId) {
        // Fallback if we still use section_id directly
        filteredArticles = artRes.filter(a => a.section_id == sectionFilterId);
      } else {
        // If no filter, maybe show all or empty? Showing all for now.
      }

      // Sort
      filteredArticles.sort((a, b) => (a.sort_order - b.sort_order) || (a.id - b.id));
      setItems(filteredArticles);

    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    // Auto-fill title from SubSection if available
    const currentSub = subSections.find(s => s.id == subSectionFilterId);
    setTitle(currentSub ? currentSub.title : "");

    // Generate a unique slug to avoid collisions (since title might be common like "Installation")
    // Appending a short random string or component ID ensures uniqueness.
    if (currentSub) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 7);
      setSlug(slugify(currentSub.title) + "-" + uniqueSuffix);
    } else {
      setSlug("");
    }

    setContent("");
    setSortOrder(0);
    setSelectedSubSectionId(subSectionFilterId || "");
    setAutoSlug(true);
    setShowForm(true);
  };

  const handleCreate = async () => {
    setErr("");
    if (!title || !selectedSubSectionId) {
      setErr("Title and Sub Section are required.");
      return;
    }
    try {
      await apiAdmin("/admin/articles", {
        method: "POST",
        body: {
          sub_section_id: selectedSubSectionId,
          title: title,
          slug: slug || slugify(title),
          content: content || "",
          sort_order: parseInt(sortOrder) || 0
        }
      });
      setShowForm(false);
      setSuccess("Article created!");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  };

  const startEdit = (article) => {
    setEditingId(article.id);
    setEditTitle(article.title || "");
    setEditSlug(article.slug || "");
    setEditContent(article.content || "");
    setEditSortOrder(article.sort_order || 0);
    setEditSubSectionId(article.sub_section_id || article.section_id || ""); // Fallback
    setEditAutoSlug(article.slug === slugify(article.title));
    setShowForm(true);
  };

  const saveEdit = async () => {
    setErr("");
    try {
      await apiAdmin(`/admin/articles/${editingId}`, {
        method: "PUT",
        body: {
          sub_section_id: editSubSectionId,
          title: editTitle,
          slug: editSlug || slugify(editTitle),
          content: editContent,
          sort_order: parseInt(editSortOrder) || 0
        }
      });
      setShowForm(false);
      setEditingId(null);
      setSuccess("Article updated!");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await apiAdmin(`/admin/articles/${id}`, { method: "DELETE" });
      setSuccess("Article deleted!");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  };

  // Quill Modules (Memoized)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        [{ 'size': fontSizeArr }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['color', 'background'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'color': function () { activeEditorRef.current = this.quill; if (colorInputRef.current) colorInputRef.current.click(); },
        'background': function () { activeEditorRef.current = this.quill; if (bgInputRef.current) bgInputRef.current.click(); }
      }
    },
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function (range, context) {
            this.quill.insertText(range.index, "    ");
            return false;
          }
        },
        shift_tab: {
          key: 9,
          shiftKey: true,
          handler: function (range, context) {
            if (range.index >= 4) {
              const text = this.quill.getText(range.index - 4, 4);
              if (text === "    ") {
                this.quill.deleteText(range.index - 4, 4);
                return false;
              }
            }
            return true;
          }
        }
      }
    }
  }), []);

  const formats = ['header', 'size', 'font', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'list', 'indent', 'align', 'color', 'background', 'link', 'image', 'video'];

  if (loading) return <div className="admin-page-container" style={{ padding: 40 }}>Loading...</div>;

  // Filter context for header
  const currentSubSection = subSections.find(s => s.id == subSectionFilterId);

  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-wrapper">
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div>
            {currentSubSection && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Link to="/admin/products" style={{ textDecoration: 'none', color: '#6b7280' }}>Products</Link>
                <span style={{ color: '#9ca3af' }}>/</span>
                {currentSubSection.section?.product_id && (
                  <>
                    <Link to={`/admin/product-view/${currentSubSection.section.product_id}`} style={{ textDecoration: 'none', color: '#6b7280' }}>Product</Link>
                    <span style={{ color: '#9ca3af' }}>/</span>
                  </>
                )}
                {currentSubSection.section_id && (
                  <>
                    <Link to={`/admin/section-view/${currentSubSection.section_id}`} style={{ textDecoration: 'none', color: '#6b7280' }}>{currentSubSection.section?.title || 'Section'}</Link>
                    <span style={{ color: '#9ca3af' }}>/</span>
                  </>
                )}
                <span style={{ color: '#111827', fontWeight: 600 }}>{currentSubSection.title}</span>
              </div>
            )}
            <h1>{currentSubSection ? currentSubSection.title : "All Articles"} <span style={{ fontSize: '0.6em', color: '#6b7280' }}>Articles</span></h1>
            <p>Manage content for this topic.</p>
          </div>

          <button
            onClick={openCreate}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.8rem',
              padding: '6px 12px',
              width: 'auto'
            }}
          >
            <span style={{ fontSize: '1.2em', lineHeight: 0.8 }}>+</span>
            New Article
          </button>
        </div>

        {err && <div className="admin-alert error">{err}</div>}
        {success && <div className="admin-alert success">{success}</div>}

        {/* MODAL FORM */}
        {showForm && (
          <>
            <div
              onClick={() => setShowForm(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)'
              }}
            />
            <div className="admin-card" style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '900px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', zIndex: 1000,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #4f46e5',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="card-title" style={{ margin: 0, border: 'none' }}>{editingId ? "Edit Article" : "New Article"}</h2>
                <button onClick={() => setShowForm(false)} className="btn-close-modal">&times;</button>
              </div>

              {/* TITLE AND SLUG HIDDEN - Auto-populated */}
              <div style={{ display: 'none' }}>
                <input className="form-input"
                  value={editingId ? editTitle : title}
                  onChange={e => {
                    const v = e.target.value;
                    if (editingId) {
                      setEditTitle(v);
                      if (editAutoSlug) setEditSlug(slugify(v));
                    } else {
                      setTitle(v);
                      if (autoSlug) setSlug(slugify(v));
                    }
                  }}
                />
                <input className="form-input"
                  value={editingId ? editSlug : slug}
                  onChange={e => {
                    if (editingId) { setEditSlug(e.target.value); setEditAutoSlug(false); }
                    else { setSlug(e.target.value); setAutoSlug(false); }
                  }}
                />
              </div>

              <h3 style={{ margin: '0 0 15px', paddingBottom: 10, borderBottom: '1px solid #eee' }}>
                Article for: <span style={{ color: '#4f46e5' }}>{items.length > 0 ? items[0].title : (subSections.find(s => s.id == (editingId ? editSubSectionId : selectedSubSectionId))?.title || selectedSubSectionId)}</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Sub Section</label>
                  <select className="form-select"
                    value={editingId ? editSubSectionId : selectedSubSectionId}
                    onChange={e => editingId ? setEditSubSectionId(e.target.value) : setSelectedSubSectionId(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {subSections.filter(s => {
                      // Filter logic:
                      // 1. If we are inside a specific SubSection view (currentSubSection), show only sub-sections of that PRODUCT.
                      // 2. If we are Editing, show only sub-sections of the SAME PRODUCT as the article.
                      // 3. Otherwise show all.

                      let targetProductId = null;
                      if (currentSubSection?.section?.product_id) {
                        targetProductId = currentSubSection.section.product_id;
                      } else if (editingId) {
                        // Find the product of the article we are editing
                        // We can use the 'editSubSectionId' state which is initialized to the article's current sub_section
                        // BUT be careful if user changes it. We want the ORIGINAL product context usually.
                        // Actually, if they change the sub-section, they are picking from the list. The list should be constant for the PRODUCT.
                        // So looking at the INITIAL editSubSectionId is safest, or just the current one if we assume they stay in product.
                        const activeSub = subSections.find(sub => sub.id == editSubSectionId);
                        if (activeSub?.section?.product_id) targetProductId = activeSub.section.product_id;
                      }

                      // If we have a target product, filter. Else show all.
                      return targetProductId ? s.section?.product_id === targetProductId : true;
                    }).map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">Content</label>
                <div style={{ flex: 1, minHeight: 400 }}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={editingId ? editContent : content}
                    onChange={editingId ? setEditContent : setContent}
                    modules={modules}
                    formats={formats}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                {editingId ? (
                  <button onClick={saveEdit} className="btn btn-success">Save Changes</button>
                ) : (
                  <button onClick={handleCreate} className="btn btn-primary">Create Article</button>
                )}
                <button onClick={() => setShowForm(false)} className="btn btn-cancel">Cancel</button>
              </div>
            </div>
          </>
        )}


        <div className="article-list">
          {items.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: 'white', borderRadius: 8 }}>No articles found in this sub section.</div>
          ) : (
            items.map((article) => (
              <div key={article.id} className="article-item" style={{ opacity: editingId === article.id ? 0.5 : 1 }}>
                <div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: "600", color: "#111827" }}>{article.title}</h3>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                    /{article.slug}
                    <span style={{ margin: "0 8px", color: "#d1d5db" }}>|</span>
                    Order: {article.sort_order}
                  </p>
                </div>
                <div className="article-actions">
                  <button onClick={() => startEdit(article)} className="btn-edit">Edit</button>
                  <button onClick={() => remove(article.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hidden Color Inputs */}
      <input type="color" ref={colorInputRef} style={{ display: "none" }} onChange={(e) => { if (activeEditorRef.current) activeEditorRef.current.format('color', e.target.value); }} />
      <input type="color" ref={bgInputRef} style={{ display: "none" }} onChange={(e) => { if (activeEditorRef.current) activeEditorRef.current.format('background', e.target.value); }} />
    </div>
  );
}
