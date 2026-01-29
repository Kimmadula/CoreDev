import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";

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
          slug,
          content,
        },
      });
      setTitle("");
      setSlug("");
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
          slug: editSlug,
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

  return (
    <div>
      <h2>Admin: Articles</h2>
      <p style={{ opacity: 0.8 }}>
        Manage articles within your sections.{" "}
        <Link to="/admin/sections">Back to Sections</Link>
      </p>

      {err && <p style={{ color: "crimson", fontWeight: 500 }}>{err}</p>}
      {success && <p style={{ color: "green", fontWeight: 500 }}>{success}</p>}

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>Add New Article</h3>
        <select
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
          style={{
            padding: 8,
            width: "min(420px, 100%)",
            display: "block",
            marginBottom: 8,
          }}
        >
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{
            padding: 8,
            width: "min(420px, 100%)",
            display: "block",
            marginBottom: 8,
          }}
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug (example: getting-started)"
          style={{
            padding: 8,
            width: "min(420px, 100%)",
            display: "block",
            marginBottom: 8,
          }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content (supports HTML)"
          style={{
            padding: 8,
            width: "min(420px, 100%)",
            display: "block",
            marginBottom: 8,
            fontFamily: "monospace",
          }}
          rows={6}
        />
        <button onClick={create} style={{ padding: "8px 12px" }}>
          Create Article
        </button>
      </div>

      <h3>Existing Articles</h3>
      <div style={{ marginTop: 16 }}>
        {items.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No articles found.</p>
        ) : (
          items.map((article) =>
            editingId === article.id ? (
              <div
                key={article.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  marginBottom: 12,
                  borderRadius: 8,
                  background: "#f9f9f9",
                }}
              >
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 4,
                    border: "1px solid #ddd",
                  }}
                />
                <input
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  placeholder="Slug"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 4,
                    border: "1px solid #ddd",
                  }}
                />
                <select
                  value={editSectionId}
                  onChange={(e) => setEditSectionId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 4,
                    border: "1px solid #ddd",
                  }}
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Content"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    fontFamily: "monospace",
                  }}
                  rows={6}
                />
                <button
                  onClick={saveEdit}
                  style={{ padding: "8px 12px", marginRight: 8 }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ padding: "8px 12px", background: "#ccc" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                key={article.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  marginBottom: 12,
                  borderRadius: 8,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <h4 style={{ margin: "0 0 4px 0" }}>{article.title}</h4>
                  <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9em" }}>
                    Slug: {article.slug}
                  </p>
                  <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9em" }}>
                    Section: {article.section?.title || "Unknown"}
                  </p>
                </div>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: 8,
                    borderRadius: 4,
                    marginBottom: 8,
                    maxHeight: 100,
                    overflowY: "auto",
                    fontSize: "0.85em",
                  }}
                >
                  {article.content}
                </div>
                <button
                  onClick={() => startEdit(article)}
                  style={{ padding: "4px 8px", marginRight: 8 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(article.id)}
                  style={{ padding: "4px 8px", background: "#ff6b6b", color: "white" }}
                >
                  Delete
                </button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
