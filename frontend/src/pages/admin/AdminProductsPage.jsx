import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import "./Admin.css";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Show/Hide Form
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [autoSlug, setAutoSlug] = useState(true);

  // Edit State
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
      setShowForm(false);
      toast.success("Product created successfully!");
      await load();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    }
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
      setShowForm(false);
      toast.success("Product updated successfully!");
      await load();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    }
  }

  // (Inside remove)
  async function remove(id) {
    setErr("");
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiAdmin(`/admin/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted successfully!");
      await load();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    }
  }

  return (
    <div className="admin-page-container">
      <AdminNavbar />

      <div className="admin-wrapper">
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div>
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", display: "inline-block", marginBottom: "8px" }}>
              🔒 SECURE ADMIN AREA
            </div>
            <h1>Product Management</h1>
            <p>Create and manage products.</p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
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
            {showForm ? "Close" : "New"}
          </button>
        </div>



        {err && (
          <div style={{ background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", border: "1px solid #fca5a5", padding: "14px 16px", borderRadius: "10px", color: "#991b1b", marginBottom: 20, fontWeight: 500, fontSize: "14px" }}>
            {err}
          </div>
        )}

        {success && <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", border: "1px solid #86efac", padding: "14px 16px", borderRadius: "10px", color: "#166534", marginBottom: 20, fontWeight: 500, fontSize: "14px" }}>{success}</div>}

        {/* MAIN LAYOUT: Standard Block (Full Width) instead of Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>

          {/* CREATE / EDIT FORM (MODAL) */}
          {showForm && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => { setShowForm(false); setEditingId(null); }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 999,
                  backdropFilter: 'blur(2px)'
                }}
              />

              {/* Modal */}
              <div className="admin-card" style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                maxWidth: '90%',
                zIndex: 1000,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #4f46e5'
              }}>
                <h2 className="card-title" style={{ marginTop: 0 }}>{editingId ? `Edit Product: ${editName}` : "Create New Product"}</h2>

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
                    autoFocus
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

                <div className="form-actions" style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  {editingId ? (
                    <>
                      <button onClick={saveEdit} className="btn btn-success">Save Changes</button>
                      <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn btn-cancel">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={create} className="btn btn-success">Create Product</button>
                      <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn btn-cancel">Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* PRODUCT LIST */}
          <div>
            {items.length === 0 ? (
              <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", border: "1px solid #e5e7eb" }}>
                <p style={{ color: "#9ca3af" }}>No products found. Click "New Product" to add one.</p>
              </div>
            ) : (
              items.map((p) => (
                <div key={p.id} className="product-item" style={{ display: editingId === p.id ? 'none' : 'flex' }}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/admin/product-view/${p.id}`)}>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: 700, color: "#1f2937", display: 'flex', alignItems: 'center', gap: 8 }}>
                      {p.name}
                      <span style={{ fontSize: '12px', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, color: '#6b7280' }}>Click to Manage</span>
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                      <span className="article-tag">/{p.slug}</span>
                      {p.slug === 'help-desk' && (
                        <span className="product-tag" style={{ marginLeft: 10, background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>Knowledge Base</span>
                      )}
                      <span style={{ marginLeft: 10 }}>Order: {p.sort_order}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} className="btn-edit" style={{ marginRight: 5 }}>Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); remove(p.id); }} className="btn-delete" style={{ marginRight: 5 }}>Delete</button>
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
