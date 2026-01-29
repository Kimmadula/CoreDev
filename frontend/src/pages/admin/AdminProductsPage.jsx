import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
      await apiAdmin("/admin/products", {
        method: "POST",
        body: { name, slug, description },
      });
      setName("");
      setSlug("");
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
      await apiAdmin(`/admin/products/${editingId}`, {
        method: "PUT",
        body: { name: editName, slug: editSlug, description: editDescription },
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
    <div>
      <h2>Admin: Products</h2>
      <p style={{ opacity: 0.8 }}>
        Manage all products on your site.{" "}
        <Link to="/admin">Back to Admin</Link>
      </p>

      {err && <p style={{ color: "crimson", fontWeight: 500 }}>{err}</p>}
      {success && <p style={{ color: "green", fontWeight: 500 }}>{success}</p>}

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>Add Product</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          style={{ padding: 8, width: "min(420px, 100%)", display: "block", marginBottom: 8 }}
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug (example: sap-scm)"
          style={{ padding: 8, width: "min(420px, 100%)", display: "block", marginBottom: 8 }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{ padding: 8, width: "min(420px, 100%)", display: "block", marginBottom: 8 }}
          rows={3}
        />
        <button onClick={create} style={{ padding: "8px 12px" }}>
          Create Product
        </button>
      </div>

      <h3>Existing Products</h3>
      <div style={{ marginTop: 16 }}>
        {items.length === 0 && !err ? (
          <p>No products yet.</p>
        ) : (
          items.map((p) =>
            editingId === p.id ? (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  marginBottom: 12,
                  borderRadius: 8,
                  background: "#f9f9f9",
                }}
              >
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
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
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 4,
                    border: "1px solid #ddd",
                  }}
                  rows={3}
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
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  marginBottom: 12,
                  borderRadius: 8,
                }}
              >
                <h4 style={{ margin: "0 0 8px 0" }}>{p.name}</h4>
                <p style={{ margin: "0 0 8px 0", opacity: 0.7, fontSize: "0.9em" }}>
                  Slug: {p.slug}
                </p>
                {p.description && (
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9em" }}>
                    {p.description}
                  </p>
                )}
                <button
                  onClick={() => startEdit(p)}
                  style={{ padding: "4px 8px", marginRight: 8 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  style={{ padding: "4px 8px", marginRight: 8, background: "#ff6b6b", color: "white" }}
                >
                  Delete
                </button>
                <Link
                  to={`/admin/sections?product=${p.id}`}
                  style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    background: "#4f46e5",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: 4,
                  }}
                >
                  Manage Sections
                </Link>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
