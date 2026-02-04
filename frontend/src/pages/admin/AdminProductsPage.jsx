import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import "./Admin.css";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [autoSlug, setAutoSlug] = useState(true);

  const [sortOrder, setSortOrder] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editAutoSlug, setEditAutoSlug] = useState(false);

  useEffect(() => {
    load();
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
      data.sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
      setItems(data);
    } catch (e) {
      setErr(String(e));
    }
  }

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
        body: { name, slug: cleanSlug, sort_order: parseInt(sortOrder) || 0 },
      });
      setName("");
      setSlug("");
      setSortOrder(0);
      setAutoSlug(true);
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
    setEditSortOrder(product.sort_order || 0);
    setEditAutoSlug(product.slug === slugify(product.name));
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
        body: { name: editName, slug: cleanSlug, sort_order: parseInt(editSortOrder) || 0 },
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

  return (
    <div className="admin-page-container">
      <AdminNavbar />

      <div className="admin-wrapper">
        <div className="admin-header">
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", display: "inline-block", marginBottom: "8px" }}>
            🔒 SECURE ADMIN AREA
          </div>
          <h1>Product Management</h1>
          <p>Create and manage products, sections, and articles.</p>
        </div>

        {err && (
          <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", border: "1px solid #fca5a5", padding: "14px 16px", borderRadius: "10px", color: "#991b1b", marginBottom: 20, fontWeight: 500, fontSize: "14px" }}>
            {(err.includes("Unauthorized") || err.includes("401")) ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span>⚠️ Session expired or invalid key.</span>
                <Link to="/admin" style={{ background: "#fff", padding: "4px 12px", borderRadius: 6, textDecoration: "none", color: "#991b1b", fontSize: "0.9em", border: "1px solid #fca5a5" }}>Update Key</Link>
              </div>
            ) : err}
          </div>
        )}

        {success && <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", border: "1px solid #86efac", padding: "14px 16px", borderRadius: "10px", color: "#166534", marginBottom: 20, fontWeight: 500, fontSize: "14px" }}>{success}</div>}

        <div className="admin-grid">

          {/* CREATE / EDIT FORM */}
          <div className="admin-card">
            <h2 className="card-title">{editingId ? `Edit Product: ${editName}` : "Create New Product"}</h2>

            <div className="form-group">
              <label className="form-label">Product Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                className="form-input"
                value={editingId ? editName : name}
                onChange={(e) => {
                  const v = e.target.value;
                  if (editingId) {
                    setEditName(v);
                    if (editAutoSlug) setEditSlug(slugify(v));
                  } else {
                    setName(v);
                    if (autoSlug) setSlug(slugify(v));
                  }
                }}
                placeholder="e.g. Help Desk"
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                className="form-input"
                value={editingId ? editSlug : slug}
                onChange={(e) => {
                  if (editingId) {
                    setEditSlug(e.target.value);
                    setEditAutoSlug(false);
                  } else {
                    setSlug(e.target.value);
                    setAutoSlug(false);
                  }
                }}
                placeholder="e.g. help-desk"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sort Order</label>
              <input
                className="form-input"
                type="number"
                value={editingId ? editSortOrder : sortOrder}
                onChange={(e) => editingId ? setEditSortOrder(e.target.value) : setSortOrder(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: 10 }}>
              {editingId ? (
                <>
                  <button onClick={saveEdit} className="btn btn-success">Save Changes</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-cancel">Cancel</button>
                </>
              ) : (
                <button onClick={create} className="btn btn-primary">Create Product</button>
              )}
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div>
            <h2 className="card-title" style={{ marginBottom: 20 }}>Existing Products</h2>
            {items.length === 0 ? (
              <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", border: "1px solid #e5e7eb" }}>
                <p style={{ color: "#9ca3af" }}>No products found.</p>
              </div>
            ) : (
              items.map((p) => (
                editingId === p.id ? <div key={p.id} style={{ display: 'none' }}></div> :
                  <div key={p.id} className="product-item">
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: 700, color: "#1f2937" }}>{p.name}</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                        <span className="article-tag">/{p.slug}</span>
                        {p.slug === 'help-desk' && (
                          <span className="product-tag" style={{ marginLeft: 10, background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>Knowledge Base</span>
                        )}
                        <span style={{ marginLeft: 10 }}>Order: {p.sort_order}</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => startEdit(p)} className="btn-edit" style={{ marginRight: 5 }}>Edit</button>
                      <button onClick={() => remove(p.id)} className="btn-delete" style={{ marginRight: 5 }}>Delete</button>
                    </div>
                  </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div >
  );
}
