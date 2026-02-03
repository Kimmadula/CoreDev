import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";

// Register Custom Font Sizes
const Size = Quill.import("attributors/style/size");
const fontSizeArr = ["8px", "9px", "10px", "11px", "12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "36px", "48px", "72px"];
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

export default function AdminArticlesPage() {
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get("section");

  const [items, setItems] = useState([]);
  const [sections, setSections] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(sectionId || "");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSectionId, setEditSectionId] = useState("");

  const [autoSlug, setAutoSlug] = useState(true);
  const [editAutoSlug, setEditAutoSlug] = useState(false);

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Refs for handling valid Color Picker (Hex)
  const colorInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const activeQuillRef = useRef(null); // Tracks which editor instance (Create or Edit) triggered the picker

  async function loadArticles() {
    setErr("");
    try {
      const data = await apiAdmin("/admin/articles", { method: "GET" });
      const filtered = sectionId
        ? data.filter((a) => a.section_id == sectionId)
        : data;
      setItems(filtered);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function loadSections() {
    try {
      const data = await apiAdmin("/admin/sections", { method: "GET" });
      setSections(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadSections();
    loadArticles();
  }, []);

  async function create() {
    setErr("");
    setSuccess("");
    if (!selectedSectionId || !title || !slug || !content) {
      setErr("Please fill in all fields");
      return;
    }
    try {
      await apiAdmin("/admin/articles", {
        method: "POST",
        body: {
          section_id: parseInt(selectedSectionId),
          title,
          slug: slugify(slug),
          content,
        },
      });
      setTitle("");
      setSlug("");
      setAutoSlug(true);
      setContent("");
      setSuccess("Article created successfully!");
      await loadArticles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function startEdit(article) {
    setEditingId(article.id);
    setEditTitle(article.title);
    setEditSlug(article.slug);
    setEditContent(article.content);
    setEditSectionId(article.section_id);
    setEditAutoSlug(article.slug === slugify(article.title));
  }

  async function saveEdit() {
    setErr("");
    setSuccess("");
    if (!editTitle || !editSlug || !editContent) {
      setErr("Please fill in all fields");
      return;
    }
    try {
      await apiAdmin(`/admin/articles/${editingId}`, {
        method: "PUT",
        body: {
          section_id: editSectionId,
          title: editTitle,
          slug: slugify(editSlug),
          content: editContent,
        },
      });
      setEditingId(null);
      setSuccess("Article updated successfully!");
      await loadArticles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function remove(id) {
    setErr("");
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await apiAdmin(`/admin/articles/${id}`, { method: "DELETE" });
      setSuccess("Article deleted successfully!");
      await loadArticles();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsivePadding = isMobile ? "20px 16px" : "40px 20px";

  // Handlers for Color inputs
  const handleColorChange = (e) => {
    if (activeQuillRef.current) {
      const color = e.target.value;
      activeQuillRef.current.format("color", color);
    }
  };

  const handleBgChange = (e) => {
    if (activeQuillRef.current) {
      const color = e.target.value;
      activeQuillRef.current.format("background", color);
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        [{ 'size': fontSizeArr }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['color', 'background'], // Button mode for custom handlers
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'color': function () {
          activeQuillRef.current = this.quill;
          if (colorInputRef.current) colorInputRef.current.click();
        },
        'background': function () {
          activeQuillRef.current = this.quill;
          if (bgInputRef.current) bgInputRef.current.click();
        }
      }
    }
  }), []);

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'color', 'background',
    'link', 'image', 'video'
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", color: "#1f2937", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>
        {fontSizeArr.map(size => `
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${size}"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${size}"]::before {
            content: "${size.replace('px', '')}";
          }
        `).join('')}
        {/* Set default label when nothing is selected or normal text */}
        {`
          .ql-snow .ql-picker.ql-size .ql-picker-label::before {
            content: "Size";
          }
        `}
      </style>

      {/* Hidden inputs for Native Color Picker support */}
      <input type="color" ref={colorInputRef} onChange={handleColorChange} style={{ display: "none" }} />
      <input type="color" ref={bgInputRef} onChange={handleBgChange} style={{ display: "none" }} />

      <AdminNavbar />
      <div style={{ padding: responsivePadding }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingLeft: isMobile ? "0" : "2rem", paddingRight: isMobile ? "0" : "2rem" }}>
          <h2>Admin: Articles</h2>
          <p style={{ opacity: 0.8 }}>
            Manage articles within your sections.{" "}
            <Link to="/admin/sections">Back to Sections</Link>
          </p>

          {err && <p style={{ color: "crimson", fontWeight: 500 }}>{err}</p>}
          {success && <p style={{ color: "green", fontWeight: 500 }}>{success}</p>}

          <div style={{ background: "#fff", border: "1px solid #ddd", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0 }}>Add New Article</h3>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              style={{
                padding: 12,
                width: "100%",
                display: "block",
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #ddd"
              }}
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} {s.product?.name ? `- ${s.product.name}` : ""}
                </option>
              ))}
            </select>
            <input
              value={title}
              onChange={(e) => {
                const v = e.target.value;
                setTitle(v);
                if (autoSlug) setSlug(slugify(v));
              }}
              placeholder="Title"
              style={{
                padding: 12,
                width: "100%",
                display: "block",
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                boxSizing: "border-box"
              }}
            />
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              placeholder="Slug (example: getting-started)"
              style={{
                padding: 12,
                width: "100%",
                display: "block",
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                boxSizing: "border-box",
                fontFamily: "monospace",
                background: "#fafbfc",
                color: "#000"
              }}
            />
            {autoSlug && slug && <p style={{ fontSize: "12px", color: "#6b7280", margin: "-8px 0 12px 0", fontStyle: "italic" }}>🔄 Auto-generated from title</p>}
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>Article Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write something amazing..."
              style={{
                height: "300px",
                marginBottom: "60px",
                background: "#fff",
                borderRadius: "8px",
                color: "#000"
              }}
            />
            <button onClick={create} style={{ padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              Create Article
            </button>
          </div>

          <h3 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Existing Articles</h3>
          <div style={{ marginTop: 16 }}>
            {items.length === 0 ? (
              <p style={{ opacity: 0.6 }}>No articles found.</p>
            ) : (
              items.map((article) =>
                editingId === article.id ? (
                  <div
                    key={article.id}
                    style={{
                      border: "1px solid #fbbf24",
                      padding: 24,
                      marginBottom: 16,
                      borderRadius: 12,
                      background: "#fffbeb",
                      boxShadow: "0 4px 6px rgba(251, 191, 36, 0.1)"
                    }}
                  >
                    <input
                      value={editTitle}
                      onChange={(e) => {
                        const v = e.target.value;
                        setEditTitle(v);
                        if (editAutoSlug) setEditSlug(slugify(v));
                      }}
                      placeholder="Title"
                      style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 12,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        background: "#fff",
                        color: "#000"
                      }}
                    />
                    <input
                      value={editSlug}
                      onChange={(e) => {
                        setEditSlug(e.target.value);
                        setEditAutoSlug(false);
                      }}
                      placeholder="Slug"
                      style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 12,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        fontFamily: "monospace",
                        background: "#fafbfc",
                        color: "#000"
                      }}
                    />
                    <select
                      value={editSectionId}
                      onChange={(e) => setEditSectionId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 12,
                        marginBottom: 12,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        background: "#fff",
                        color: "#000"
                      }}
                    >
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} {s.product?.name ? `- ${s.product.name}` : ""}
                        </option>
                      ))}
                    </select>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#374151" }}>Content</label>
                    <ReactQuill
                      theme="snow"
                      value={editContent}
                      onChange={setEditContent}
                      modules={modules}
                      formats={formats}
                      style={{
                        height: "300px",
                        marginBottom: "60px",
                        background: "#fff",
                        color: "#000"
                      }}
                    />
                    <button
                      onClick={saveEdit}
                      style={{ padding: "8px 16px", marginRight: 8, background: "#10b981", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ padding: "8px 16px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div
                    key={article.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      padding: 24,
                      marginBottom: 16,
                      borderRadius: 12,
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                  >
                    <div style={{ marginBottom: 12 }}>
                      <h4 style={{ margin: "0 0 8px 0", fontSize: "1.25rem" }}>{article.title}</h4>
                      <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9em", fontFamily: "monospace", background: "#f3f4f6", display: "inline-block", padding: "2px 6px", borderRadius: 4 }}>
                        Slug: {article.slug}
                      </p>
                      <p style={{ margin: "4px 0 0 0", opacity: 0.7, fontSize: "0.9em" }}>
                        Section: {article.section?.title || "Unknown"}
                        <span style={{ margin: "0 8px", color: "#d1d5db" }}>|</span>
                        Product: {sections.find(s => s.id == article.section_id)?.product?.name || "Unknown"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "#f9fafb",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 16,
                        maxHeight: 150,
                        overflowY: "auto",
                        fontSize: "0.9em",
                        border: "1px solid #eee"
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>
                    <button
                      onClick={() => startEdit(article)}
                      style={{ padding: "6px 12px", marginRight: 8, background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", color: "#374151" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(article.id)}
                      style={{ padding: "6px 12px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
