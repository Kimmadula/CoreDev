import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./Admin.css";
import "../../components/ArticleContent.css";
import { apiAdmin, apiGet } from "../../api.js";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import ConfirmationModal from "../../components/ConfirmationModal";

// Register custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace'];
Quill.register(Font, true);

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

// HELPER: Clean list content - remove duplicate numbering/bullets from HTML
const cleanListContent = (htmlContent) => {
  if (!htmlContent) return "";

  console.log('=== STARTING LIST CLEANING ===');
  console.log('Original HTML:', htmlContent.substring(0, 500));

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find all list items
    const listItems = Array.from(doc.querySelectorAll('li'));

    console.log('Found', listItems.length, 'list items');

    listItems.forEach((li, index) => {
      // Get the full text to check
      const originalText = li.textContent.trim();
      console.log(`\nLI #${index} original text: "${originalText}"`);
      console.log(`LI #${index} HTML:`, li.innerHTML);

      // REMOVE EMPTY OR GHOST LIST ITEMS
      // These create lone bullets/numbers with no content
      if (!originalText ||
        /^[\s]*$/.test(originalText) ||                    // Empty
        /^[\s]*\d{1,3}[\.\)]\s*$/.test(originalText) ||    // Just "1." or "2)"
        /^[\s]*[a-zA-Z][\.\)]\s*$/.test(originalText) ||   // Just "a." or "b)"
        /^[\s]*[•◦▪–—\-]\s*$/.test(originalText)) {        // Just "•" or "-"
        console.log(`>>> REMOVING empty/ghost LI #${index}: "${originalText}"`);
        li.remove();
        return;
      }

      // Track if we made changes
      let cleaned = false;

      // Process all child nodes
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let txt = node.textContent;
          const originalTxt = txt;

          // Remove leading numbers/letters followed by period/paren and space
          // Matches: "1. ", "10. ", "a. ", "A) ", etc.
          txt = txt.replace(/^[\s]*\d{1,3}[\.\)]\s+/, '');
          txt = txt.replace(/^[\s]*[a-zA-Z][\.\)]\s+/, '');
          // Remove bullets: "• ", "◦ ", "▪ ", etc.
          txt = txt.replace(/^[\s]*[•◦▪–—\-]\s+/, '');

          if (txt !== originalTxt) {
            console.log(`>>> Cleaned text node in LI #${index}:`);
            console.log(`    BEFORE: "${originalTxt}"`);
            console.log(`    AFTER:  "${txt}"`);
            node.textContent = txt;
            cleaned = true;
          }
        }
      };

      // Process direct child text nodes first
      let foundTextNode = false;
      for (let i = 0; i < li.childNodes.length; i++) {
        const child = li.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          console.log(`  Processing direct text node: "${child.textContent}"`);
          processNode(child);
          foundTextNode = true;
          break; // Only clean first text node
        }
      }

      // If no direct text node, check first element child
      if (!foundTextNode) {
        const firstElement = li.querySelector('*');
        if (firstElement) {
          console.log(`  No direct text node, checking first element:`, firstElement.tagName);
          for (let i = 0; i < firstElement.childNodes.length; i++) {
            const child = firstElement.childNodes[i];
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
              console.log(`  Processing text node inside element: "${child.textContent}"`);
              processNode(child);
              break;
            }
          }
        }
      }

      if (!cleaned) {
        console.log(`  No changes made to LI #${index}`);
      }
    });

    // REMOVE EMPTY LISTS (after removing items)
    const lists = Array.from(doc.querySelectorAll('ul, ol'));
    lists.forEach(list => {
      if (list.querySelectorAll('li').length === 0) {
        console.log('>>> REMOVING empty list:', list.tagName);
        list.remove();
      }
    });

    const result = doc.body.innerHTML;
    console.log('\n=== CLEANING COMPLETE ===');
    console.log('Cleaned HTML length:', htmlContent.length, '→', result.length);
    console.log('Cleaned HTML:', result.substring(0, 500));
    return result;

  } catch (e) {
    console.error("Error cleaning content:", e);
    return htmlContent;
  }
};

export default function AdminArticlesPage() {
  const [items, setItems] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();
  const subSectionFilterId = searchParams.get("sub_section");
  const sectionFilterId = searchParams.get("section");

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
      } else if (sectionFilterId) {
        filteredArticles = artRes.filter(a => a.section_id == sectionFilterId);
      }

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
    const currentSub = subSections.find(s => s.id == subSectionFilterId);
    setTitle(currentSub ? currentSub.title : "");

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
      toast.success("Article created!");
      fetchData();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    }
  };

  const startEdit = async (article) => {
    setEditingId(article.id);
    setEditTitle(article.title || "");
    setEditSlug(article.slug || "");
    setEditSortOrder(article.sort_order || 0);
    setEditSubSectionId(article.sub_section_id || article.section_id || "");
    setEditAutoSlug(article.slug === slugify(article.title));

    // Clear content initially while loading
    setEditContent("");
    setShowForm(true);

    try {
      const fullArticle = await apiAdmin(`/admin/articles/${article.id}`, { method: "GET" });
      setEditContent(fullArticle.content ? cleanListContent(fullArticle.content) : "");
    } catch (e) {
      console.error("Failed to fetch article details:", e);
      setErr("Failed to load article content: " + String(e));
    }
  };

  const saveEdit = async () => {
    setErr("");
    const payload = {
      sub_section_id: editSubSectionId,
      title: editTitle,
      slug: editSlug || slugify(editTitle),
      content: editContent,
      sort_order: parseInt(editSortOrder) || 0
    };
    console.log("Sending payload:", payload);

    try {
      await apiAdmin(`/admin/articles/${editingId}`, {
        method: "PUT",
        body: payload
      });
      setShowForm(false);
      setShowForm(false);
      setEditingId(null);
      toast.success("Article updated!");
      fetchData();
    } catch (e) {
      console.error("Save Error:", e);
      toast.error(String(e));
      setErr(String(e));
    }
  };

  // Confirmation State
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiAdmin(`/admin/articles/${deleteId}`, { method: "DELETE" });
      toast.success("Article deleted!");
      fetchData();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  // Quill Modules (Memoized)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
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
            if (context.format.list) {
              this.quill.format('indent', '+1');
            } else {
              this.quill.insertText(range.index, "    ");
            }
            return false;
          }
        },
        'shift+tab': {
          key: 9,
          shiftKey: true,
          handler: function (range, context) {
            if (context.format.list) {
              this.quill.format('indent', '-1');
            } else {
              if (range.index >= 4) {
                const text = this.quill.getText(range.index - 4, 4);
                if (text === "    ") {
                  this.quill.deleteText(range.index - 4, 4);
                }
              }
            }
            return false;
          }
        }
      }
    }
  }), []);

  const formats = ['header', 'font', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'list', 'indent', 'align', 'color', 'background', 'link', 'image', 'video'];

  if (loading) return <div className="admin-page-container" style={{ padding: 40 }}>Loading...</div>;

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

              {/* TITLE AND SLUG HIDDEN */}
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
                      let targetProductId = null;
                      if (currentSubSection?.section?.product_id) {
                        targetProductId = currentSubSection.section.product_id;
                      } else if (editingId) {
                        const activeSub = subSections.find(sub => sub.id == editSubSectionId);
                        if (activeSub?.section?.product_id) targetProductId = activeSub.section.product_id;
                      }
                      return targetProductId ? s.section?.product_id === targetProductId : true;
                    }).map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">Content</label>
                <div style={{ flex: 1, minHeight: 400 }} className="custom-article-content">
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
                  <button onClick={() => confirmDelete(article.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))
          )}
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            title="Delete Article"
            message="Are you sure you want to delete this article? This action cannot be undone."
            confirmText="Delete Article"
          />
        </div>
      </div>

      {/* Hidden Color Inputs */}
      <input type="color" ref={colorInputRef} style={{ display: "none" }} onChange={(e) => { if (activeEditorRef.current) activeEditorRef.current.format('color', e.target.value); }} />
      <input type="color" ref={bgInputRef} style={{ display: "none" }} onChange={(e) => { if (activeEditorRef.current) activeEditorRef.current.format('background', e.target.value); }} />
    </div>
  );
}