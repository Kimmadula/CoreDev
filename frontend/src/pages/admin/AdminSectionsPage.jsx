import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import "./Admin.css";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AdminSectionsPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(productId || "");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editProductId, setEditProductId] = useState("");

  const [autoSlug, setAutoSlug] = useState(true);
  const [editAutoSlug, setEditAutoSlug] = useState(false);

  const [sortOrder, setSortOrder] = useState(0);
  const [editSortOrder, setEditSortOrder] = useState(0);

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function loadSections() {
    setErr("");
    try {
      const data = await apiAdmin("/admin/sections", { method: "GET" });
      const filtered = productId
        ? data.filter((s) => s.product_id == productId)
        : data;
      filtered.sort((a, b) => (parseInt(a.sort_order) - parseInt(b.sort_order)) || (parseInt(a.id) - parseInt(b.id)));
      setItems(filtered);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function loadProducts() {
    try {
      const data = await apiGet("/products");
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadProducts();
    loadSections();
  }, []);

  async function create() {
    setErr("");
    setSuccess("");
    if (!selectedProductId || !title || !slug) {
      setErr("Please fill in all fields");
      return;
    }
    try {
      const cleanSlug = slugify(slug);
      await apiAdmin("/admin/sections", {
        method: "POST",
        body: {
          product_id: parseInt(selectedProductId),
          title,
          slug: cleanSlug,
          sort_order: parseInt(sortOrder) || 0,
        },
      });
      setTitle("");
      setSlug("");
      setSortOrder(0);
      setAutoSlug(true);
      toast.success("Section created successfully!");
      await loadSections();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    }
  }

  async function saveEdit() {
    setErr("");
    setSuccess("");
    if (!editTitle || !editSlug) {
      setErr("Please fill in all fields");
      return;
    }
    try {
      const cleanSlug = slugify(editSlug);
      await apiAdmin(`/admin/sections/${editingId}`, {
        method: "PUT",
        body: {
          product_id: editProductId,
          title: editTitle,
          slug: cleanSlug,
          sort_order: parseInt(editSortOrder) || 0,
        },
      });
      setEditingId(null);
      toast.success("Section updated successfully!");
      await loadSections();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    }
  }

  // Confirmation State
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setErr("");
    try {
      await apiAdmin(`/admin/sections/${deleteId}`, { method: "DELETE" });
      toast.success("Section deleted successfully!");
      await loadSections();
    } catch (e) {
      toast.error(String(e));
      setErr(String(e));
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="admin-page-container">
      <AdminNavbar />
      <div className="admin-wrapper">
        <div className="admin-header">
          <h1>Admin: Sections</h1>
          <p>Manage sections within your products.</p>
        </div>

        {err && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", padding: "14px 16px", borderRadius: "10px", color: "#991b1b", marginBottom: 20, fontWeight: 500, fontSize: "14px" }}>{err}</div>}
        {success && <div style={{ background: "#dcfce7", border: "1px solid #86efac", padding: "14px 16px", borderRadius: "10px", color: "#166534", marginBottom: 20, fontWeight: 500, fontSize: "14px" }}>{success}</div>}

        <div className="admin-grid">

          {/* CREATE / EDIT FORM */}
          <div className="admin-card">
            <h2 className="card-title">{editingId ? `Edit Section` : "Create New Section"}</h2>

            <div className="form-group">
              <label className="form-label">Product</label>
              <select
                className="form-select"
                value={editingId ? editProductId : selectedProductId}
                onChange={(e) => editingId ? setEditProductId(e.target.value) : setSelectedProductId(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={editingId ? editTitle : title}
                onChange={(e) => {
                  const v = e.target.value;
                  if (editingId) {
                    setEditTitle(v);
                    if (editAutoSlug) setEditSlug(slugify(v));
                  } else {
                    setTitle(v);
                    if (autoSlug) setSlug(slugify(v));
                  }
                }}
                placeholder="e.g. Overview"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
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
                placeholder="e.g. overview"
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
                <button onClick={create} className="btn btn-primary">Create Section</button>
              )}
            </div>
          </div>

          {/* SECTION LIST */}
          <div>
            <h2 className="card-title" style={{ marginBottom: 20 }}>Existing Sections</h2>
            {items.length === 0 ? (
              <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", border: "1px solid #e5e7eb" }}>
                <p style={{ color: "#9ca3af" }}>No sections found.</p>
              </div>
            ) : (
              items.map((section) => (
                editingId === section.id ? <div key={section.id} style={{ display: 'none' }}></div> :
                  <div key={section.id} className="section-item">
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: 700, color: "#1f2937" }}>{section.title}</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                        {section.product?.name || "Unknown"}
                        <span style={{ margin: "0 8px", color: "#ccc" }}>|</span>
                        <span className="article-tag">/{section.slug}</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => startEdit(section)} className="btn-edit" style={{ marginRight: 5 }}>Edit</button>
                      <button onClick={() => confirmDelete(section.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
              ))
            )}
            <ConfirmationModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={handleDelete}
              title="Delete Section"
              message="Are you sure you want to delete this section? This action cannot be undone."
              confirmText="Delete Section"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
