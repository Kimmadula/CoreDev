import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";
import AdminNavbar from "../../components/AdminNavbar.jsx";

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsivePadding = isMobile ? "20px 16px" : "40px 20px";

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", color: "#1f2937", fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdminNavbar />
      <div style={{ padding: responsivePadding }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingLeft: isMobile ? "0" : "2rem", paddingRight: isMobile ? "0" : "2rem" }}>
          <h2>Admin: Sections</h2>
          <p style={{ opacity: 0.8 }}>
            Manage sections within your products.
          </p>

          {err && <p style={{ color: "crimson", fontWeight: 500 }}>{err}</p>}
          {success && <p style={{ color: "green", fontWeight: 500 }}>{success}</p>}

          <div style={{ background: "#fff", border: "1px solid #ddd", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0 }}>Add New Section</h3>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{
                padding: 12,
                width: "100%",
                display: "block",
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #ddd"
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
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug (example: overview)"
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
            <button onClick={create} style={{ padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              Create Section
            </button>
          </div>

          <h3 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Existing Sections</h3>
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Slug</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Product</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((section) =>
                  editingId === section.id ? (
                    <tr key={section.id} style={{ borderBottom: "1px solid #eee", background: "#fdfcff" }}>
                      <td style={{ padding: 12 }}>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
                        />
                      </td>
                      <td style={{ padding: 12 }}>
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
                        />
                      </td>
                      <td style={{ padding: 12 }}>
                        <select
                          value={editProductId}
                          onChange={(e) => setEditProductId(e.target.value)}
                          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: 12 }}>
                        <button
                          onClick={saveEdit}
                          style={{ padding: "6px 12px", marginRight: 8, background: "#10b981", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{ padding: "6px 12px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 6, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={section.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{section.title}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{section.slug}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {section.product?.name || "Unknown"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => startEdit(section)}
                          style={{ padding: "6px 12px", marginRight: 8, background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(section.id)}
                          style={{ padding: "6px 12px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer" }}
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
        </div>
      </div>
    </div>
  );
}
