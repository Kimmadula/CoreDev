import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [autoSlug, setAutoSlug] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAutoSlug, setEditAutoSlug] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function load() {
    setErr("");
    try {
      const data = await apiAdmin("/admin/products", { method: "GET" });
      setItems(data);
    } catch (e) {
      setErr(String(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setErr("");
    setSuccess("");
    if (!name || !slug) {
      setErr("Please fill in all required fields");
      return;
    }
    try {
      const cleanSlug = slugify(slug);
      await apiAdmin("/admin/products", {
        method: "POST",
        body: { name, slug: cleanSlug, description },
      });
      setName("");
      setSlug("");
      setAutoSlug(true);
      setDescription("");
      setSuccess("Product created successfully!");
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function startEdit(product) {
    setEditingId(product.id);
    setEditName(product.name);
    setEditSlug(product.slug);
    setEditAutoSlug(product.slug === slugify(product.name));
    setEditDescription(product.description || "");
  }

  async function saveEdit() {
    setErr("");
    setSuccess("");
    if (!editName || !editSlug) {
      setErr("Please fill in all required fields");
      return;
    }
    try {
      const cleanSlug = slugify(editSlug);
      await apiAdmin(`/admin/products/${editingId}`, {
        method: "PUT",
        body: { name: editName, slug: cleanSlug, description: editDescription },
      });
      setEditingId(null);
      setSuccess("Product updated successfully!");
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function remove(id) {
    setErr("");
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiAdmin(`/admin/products/${id}`, { method: "DELETE" });
      setSuccess("Product deleted successfully!");
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  const responsivePadding = isMobile ? "20px 16px" : "40px 20px";
  const responsiveHeaderSize = isMobile ? "24px" : "32px";
  const responsiveFormPadding = isMobile ? "20px" : "32px";
  const responsiveFontSize = isMobile ? "13px" : "15px";
  const responsiveCardPadding = isMobile ? "16px" : "24px";

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", padding: responsivePadding, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", width: "100%", paddingLeft: isMobile ? "0" : "2rem", paddingRight: isMobile ? "0" : "2rem" }}>
        <div style={{ marginBottom: isMobile ? 24 : 40 }}>
          <h1 style={{ fontSize: responsiveHeaderSize, fontWeight: 800, margin: "0 0 12px 0", color: "#1f2937", letterSpacing: "-0.5px" }}>Product Management</h1>
          <p style={{ opacity: 0.7, margin: 0, fontSize: responsiveFontSize, color: "#4b5563" }}>
            Create and manage products, sections, and articles.{" "}
            <Link to="/admin" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}>← Back to Admin</Link>
          </p>
        </div>

        {err && <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", border: "1px solid #fca5a5", padding: "14px 16px", borderRadius: "10px", color: "#991b1b", marginBottom: 20, fontWeight: 500, fontSize: isMobile ? "13px" : "14px" }}>{err}</div>}
        {success && <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", border: "1px solid #86efac", padding: "14px 16px", borderRadius: "10px", color: "#166534", marginBottom: 20, fontWeight: 500, fontSize: isMobile ? "13px" : "14px" }}>{success}</div>}

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: responsiveFormPadding, borderRadius: isMobile ? "12px" : "16px", marginBottom: isMobile ? 24 : 40, boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 10px 13px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 700, margin: "0 0 24px 0", color: "#1f2937" }}>➕ Create New Product</h2>
        <div style={{ display: "grid", gap: isMobile ? 16 : 20 }}>
          <div>
            <label style={{ display: "block", fontSize: isMobile ? "13px" : "14px", fontWeight: 600, marginBottom: 8, color: "#374151" }}>Product Name <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              value={name}
              onChange={(e) => {
                const v = e.target.value;
                setName(v);
                if (autoSlug) setSlug(slugify(v));
              }}
              placeholder="e.g. Help Desk, FAQ, Documentation"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: "1px solid #d1d5db", 
                borderRadius: "8px", 
                fontSize: responsiveFontSize,
                boxSizing: "border-box",
                transition: "all 0.2s",
                background: "#fff"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: isMobile ? "13px" : "14px", fontWeight: 600, marginBottom: 8, color: "#374151" }}>URL Slug <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              placeholder="e.g. help-desk, getting-started"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: "1px solid #d1d5db", 
                borderRadius: "8px", 
                fontSize: responsiveFontSize,
                boxSizing: "border-box",
                fontFamily: "menlo, monaco, 'courier new', monospace",
                transition: "all 0.2s",
                background: "#fafbfc"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }}
            />
            {autoSlug && slug && <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 0 0", fontStyle: "italic" }}>🔄 Auto-generated from name</p>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: isMobile ? "13px" : "14px", fontWeight: 600, marginBottom: 8, color: "#374151" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of this product..."
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: "1px solid #d1d5db", 
                borderRadius: "8px", 
                fontSize: responsiveFontSize,
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "all 0.2s",
                resize: "vertical",
                minHeight: isMobile ? "80px" : "100px",
                background: "#fff"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }}
              rows={4}
            />
          </div>
          <button 
            onClick={create} 
            style={{ 
              padding: isMobile ? "10px 20px" : "12px 24px", 
              background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)", 
              color: "white", 
              border: "none", 
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: responsiveFontSize,
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
              alignSelf: "flex-start"
            }}
            onMouseEnter={(e) => { e.target.style.boxShadow = "0 10px 15px rgba(79, 70, 229, 0.4)"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.target.style.boxShadow = "0 4px 6px rgba(79, 70, 229, 0.3)"; e.target.style.transform = "translateY(0)"; }}
          >
            ✨ Create Product
          </button>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 24px 0", color: "#1f2937" }}>📚 Existing Products</h2>
        {items.length === 0 && !err ? (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "40px 20px", borderRadius: "12px", textAlign: "center" }}>
            <p style={{ color: "#9ca3af", fontSize: "15px" }}>No products yet. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {items.map((p) =>
              editingId === p.id ? (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #fbbf24",
                    padding: "24px",
                    borderRadius: "12px",
                    background: "#fffbeb",
                    boxShadow: "0 4px 6px rgba(251, 191, 36, 0.1)"
                  }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 20, color: "#92400e" }}>✏️ Editing: {editName || "Product"}</h3>
                  <div style={{ display: "grid", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: 8, color: "#374151" }}>Name</label>
                      <input
                        value={editName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setEditName(v);
                          if (editAutoSlug) setEditSlug(slugify(v));
                        }}
                        placeholder="Name"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          fontSize: "15px",
                          boxSizing: "border-box",
                          background: "#fff"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: 8, color: "#374151" }}>Slug</label>
                      <input
                        value={editSlug}
                        onChange={(e) => {
                          setEditSlug(e.target.value);
                          setEditAutoSlug(false);
                        }}
                        placeholder="Slug"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          fontSize: "15px",
                          fontFamily: "monospace",
                          boxSizing: "border-box",
                          background: "#fff"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: 8, color: "#374151" }}>Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          fontSize: "15px",
                          boxSizing: "border-box",
                          resize: "vertical",
                          minHeight: "100px",
                          background: "#fff"
                        }}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button
                      onClick={saveEdit}
                      style={{ 
                        padding: "10px 20px", 
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#059669"; }}
                      onMouseLeave={(e) => { e.target.style.background = "#10b981"; }}
                    >
                      ✅ Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ 
                        padding: "10px 20px", 
                        background: "#e5e7eb",
                        color: "#374151",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#d1d5db"; }}
                      onMouseLeave={(e) => { e.target.style.background = "#e5e7eb"; }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "24px",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>{p.name}</h3>
                    <p style={{ margin: "0 0 8px 0", opacity: 0.6, fontSize: "14px", fontFamily: "monospace", color: "#666", background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px", display: "inline-block" }}>
                      /{p.slug}
                    </p>
                    {p.description && (
                      <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => startEdit(p)}
                      style={{ 
                        padding: "8px 14px", 
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#e5e7eb"; }}
                      onMouseLeave={(e) => { e.target.style.background = "#f3f4f6"; }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      style={{ 
                        padding: "8px 14px", 
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fca5a5",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#fecaca"; }}
                      onMouseLeave={(e) => { e.target.style.background = "#fee2e2"; }}
                    >
                      🗑️ Delete
                    </button>
                    <Link
                      to={`/admin/sections?product=${p.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "8px 14px",
                        background: "#e0e7ff",
                        color: "#3730a3",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "1px solid #c7d2fe",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.style.background = "#c7d2fe"; }}
                      onMouseLeave={(e) => { e.style.background = "#e0e7ff"; }}
                    >
                      📁 Manage Sections
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
