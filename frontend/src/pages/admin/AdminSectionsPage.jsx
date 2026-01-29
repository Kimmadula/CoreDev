import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";

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

  async function loadSections() {
    setErr("");
    try {
      const data = await apiAdmin("/admin/sections", { method: "GET" });
      const filtered = productId
        ? data.filter((s) => s.product_id == productId)
        : data;
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
      await apiAdmin("/admin/sections", {
        method: "POST",
        body: {
          product_id: parseInt(selectedProductId),
          title,
          slug,
        },
      });
      setTitle("");
      setSlug("");
      setSuccess("Section created successfully!");
      await loadSections();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function startEdit(section) {
    setEditingId(section.id);
    setEditTitle(section.title);
    setEditSlug(section.slug);
    setEditProductId(section.product_id);
  }

  async function saveEdit() {
    setErr("");
    setSuccess("");
    if (!editTitle || !editSlug) {
      setErr("Please fill in all fields");
      return;
    }
    try {
      await apiAdmin(`/admin/sections/${editingId}`, {
        method: "PUT",
        body: {
          product_id: editProductId,
          title: editTitle,
          slug: editSlug,
        },
      });
      setEditingId(null);
      setSuccess("Section updated successfully!");
      await loadSections();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  async function remove(id) {
    setErr("");
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await apiAdmin(`/admin/sections/${id}`, { method: "DELETE" });
      setSuccess("Section deleted successfully!");
      await loadSections();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setErr(String(e));
    }
  }

  return (
    <div>
      <h2>Admin: Sections</h2>
      <p style={{ opacity: 0.8 }}>
        Manage sections within your products.{" "}
        <Link to="/admin/products">Back to Products</Link>
      </p>

      {err && <p style={{ color: "crimson", fontWeight: 500 }}>{err}</p>}
      {success && <p style={{ color: "green", fontWeight: 500 }}>{success}</p>}

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h3>Add New Section</h3>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          style={{
            padding: 8,
            width: "min(420px, 100%)",
            display: "block",
            marginBottom: 8,
          }}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
          placeholder="Slug (example: overview)"
          style={{
            padding: 8,
            width: "min(420px, 100%)",
            display: "block",
            marginBottom: 8,
          }}
        />
        <button onClick={create} style={{ padding: "8px 12px" }}>
          Create Section
        </button>
      </div>

      <h3>Existing Sections</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: 8 }}>Title</th>
            <th style={{ textAlign: "left", padding: 8 }}>Slug</th>
            <th style={{ textAlign: "left", padding: 8 }}>Product</th>
            <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((section) =>
            editingId === section.id ? (
              <tr key={section.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: "100%", padding: 4 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <input
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    style={{ width: "100%", padding: 4 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <select
                    value={editProductId}
                    onChange={(e) => setEditProductId(e.target.value)}
                    style={{ width: "100%", padding: 4 }}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={saveEdit}
                    style={{ padding: "4px 8px", marginRight: 4 }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ padding: "4px 8px", background: "#ccc" }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={section.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8, fontWeight: 500 }}>{section.title}</td>
                <td style={{ padding: 8, opacity: 0.7 }}>{section.slug}</td>
                <td style={{ padding: 8 }}>
                  {section.product?.name || "Unknown"}
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => startEdit(section)}
                    style={{ padding: "4px 8px", marginRight: 4 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(section.id)}
                    style={{ padding: "4px 8px", background: "#ff6b6b", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
