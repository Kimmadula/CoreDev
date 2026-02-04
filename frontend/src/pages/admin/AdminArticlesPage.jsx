import { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./Admin.css";
import { apiAdmin, apiGet } from "../../api.js";
import ArticleContent from "../../components/ArticleContent.jsx";
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
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editSectionId, setEditSectionId] = useState("");
  const [editAutoSlug, setEditAutoSlug] = useState(true);

  // New Article Form
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [newSectionId, setNewSectionId] = useState("");
  const [newAutoSlug, setNewAutoSlug] = useState(true);

  // Refs for custom handlers
  const quillRef = useRef(null); // Ref for the ReactQuill component
  const activeEditorRef = useRef(null); // Ref for the underlying Quill instance

  const colorInputRef = useRef(null);
  const bgInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, secRes] = await Promise.all([
        apiAdmin("/admin/articles", { method: "GET" }),
        apiAdmin("/admin/sections", { method: "GET" }),
      ]);
      setItems(artRes);
      setSections(secRes);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle || !newSectionId) {
      alert("Missing title or section selection.");
      return;
    }
    try {
      await apiAdmin("/admin/articles", {
        method: "POST",
        body: {
          section_id: newSectionId,
          title: newTitle,
          slug: newSlug || slugify(newTitle),
          content: newContent || "",
          sort_order: newSortOrder
        }
      });
      setNewTitle("");
      setNewSlug("");
      setNewContent("");
      setNewSortOrder(0);
      setNewAutoSlug(true);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const startEdit = (article) => {
    setEditingId(article.id);
    setEditTitle(article.title || "");
    setEditSlug(article.slug || "");
    setEditContent(article.content || "");
    setEditSortOrder(article.sort_order || 0);
    setEditSectionId(article.section_id || "");
    setEditAutoSlug(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditSlug("");
    setEditContent("");
  };

  const saveEdit = async () => {
    try {
      await apiAdmin(`/admin/articles/${editingId}`, {
        method: "PUT",
        body: {
          section_id: editSectionId,
          title: editTitle,
          slug: editSlug || slugify(editTitle),
          content: editContent,
          sort_order: editSortOrder
        }
      });
      setEditingId(null);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await apiAdmin(`/admin/articles/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  // Quill Modules and Formats
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        [{ 'size': fontSizeArr }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['color', 'background'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'color': function () {
          // 'this.quill' is the actual editor instance provided by the module
          activeEditorRef.current = this.quill;
          if (colorInputRef.current) colorInputRef.current.click();
        },
        'background': function () {
          activeEditorRef.current = this.quill;
          if (bgInputRef.current) bgInputRef.current.click();
        }
      }
    },
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function () {
            this.quill.format('indent', '+1');
          }
        }
      }
    }
  }), []);

  const formats = [
    'header', 'size', 'font',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'script', 'list',
    'indent', 'align',
    'color', 'background',
    'link', 'image', 'video'
  ];

  if (loading) return <div className="admin-page-container" style={{ padding: 40 }}>Loading...</div>;
  if (err) return <div className="admin-page-container" style={{ padding: 40, color: 'var(--admin-danger)' }}>Error: {err}</div>;

  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-wrapper">
        <div className="admin-header">
          <h1>Article Manager</h1>
          <p>Create and manage knowledge base articles.</p>
        </div>

        <div className="admin-grid">

          {/* Create / Edit Form */}
          <div className="admin-card">
            <h2 className="card-title">
              {editingId ? "Edit Article" : "Create New Article"}
            </h2>

            {/* Section Select */}
            <div className="form-group">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={editingId ? editSectionId : newSectionId}
                onChange={(e) => editingId ? setEditSectionId(e.target.value) : setNewSectionId(e.target.value)}
              >
                <option value="">-- Select Section --</option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} {s.product?.name ? `- ${s.product.name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                value={editingId ? editTitle : newTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  if (editingId) {
                    setEditTitle(val);
                    if (editAutoSlug) setEditSlug(slugify(val));
                  } else {
                    setNewTitle(val);
                    if (newAutoSlug) setNewSlug(slugify(val));
                  }
                }}
                placeholder="e.g. Installation Guide"
              />
            </div>

            {/* Slug */}
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input
                className="form-input"
                type="text"
                value={editingId ? editSlug : newSlug}
                onChange={(e) => {
                  const val = e.target.value;
                  if (editingId) {
                    setEditSlug(val);
                    setEditAutoSlug(false);
                  } else {
                    setNewSlug(val);
                    setNewAutoSlug(false);
                  }
                }}
                placeholder="e.g. installation-guide"
              />
            </div>

            {/* Sort Order */}
            <div className="form-group">
              <label className="form-label">Sort Order</label>
              <input
                className="form-input"
                type="number"
                value={editingId ? editSortOrder : newSortOrder}
                onChange={(e) => editingId ? setEditSortOrder(e.target.value) : setNewSortOrder(e.target.value)}
              />
            </div>

            {/* EDITOR (Quill) */}
            <div className="form-group">
              <label className="form-label">Content</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editingId ? editContent : newContent}
                onChange={editingId ? setEditContent : setNewContent}
                modules={modules}
                formats={formats}
              />
            </div>

            {/* Actions */}
            <div className="form-actions">
              {editingId ? (
                <>
                  <button onClick={saveEdit} className="btn btn-success">Save Changes</button>
                  <button onClick={cancelEdit} className="btn btn-cancel">Cancel</button>
                </>
              ) : (
                <button onClick={handleCreate} className="btn btn-primary">Create Article</button>
              )}
            </div>
          </div>

          {/* List Wrapper */}
          <div>

            <div className="article-list">
              {items.length === 0 ? (
                <p style={{ opacity: 0.6 }}>No articles found.</p>
              ) : (
                items.map((article) => (
                  <div key={article.id} className="article-item" style={{ opacity: editingId === article.id ? 0.5 : 1 }}>
                    <div>
                      {/* SIMPLE TEXT DESIGN (No Chips) */}
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: "600", color: "#111827" }}>{article.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                        Slug: {article.slug}
                        <span style={{ margin: "0 8px", color: "#d1d5db" }}>|</span>
                        Product: {(sections.find(s => s.id == article.section_id)?.product?.name === "Help Desk" ? "Knowledge Base" : sections.find(s => s.id == article.section_id)?.product?.name) || "Unknown"}
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

        </div>
      </div>

      {/* Hidden Inputs for Custom Color Handlers */}
      <input type="color" ref={colorInputRef} style={{ display: "none" }} onChange={(e) => {
        if (activeEditorRef.current) activeEditorRef.current.format('color', e.target.value);
      }} />
      <input type="color" ref={bgInputRef} style={{ display: "none" }} onChange={(e) => {
        if (activeEditorRef.current) activeEditorRef.current.format('background', e.target.value);
      }} />
    </div>
  );
}
