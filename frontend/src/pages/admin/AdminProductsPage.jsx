import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiAdmin } from "../../api.js";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await apiGet("/products");
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
    try {
      await apiAdmin("/admin/products", {
        method: "POST",
        body: { name, slug, description },
      });
      setName(""); setSlug(""); setDescription("");
      await load();
    } catch (e) {
      setErr(String(e));
    }
  }

  async function remove(id) {
    setErr("");
    try {
      await apiAdmin(`/admin/products/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr(String(e));
    }
  }

  return (
    <div>
      <h2>Admin: Products</h2>
      <p style={{ opacity: 0.8 }}>
        If you get Unauthorized, your Admin Key is wrong.{" "}
        <Link to="/admin">Change key</Link>
      </p>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

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
          Create
        </button>
      </div>

      <h3>Existing Products</h3>
      <ul>
        {items.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <b>{p.name}</b> <span style={{ opacity: 0.7 }}>({p.slug})</span>
            <button
              onClick={() => remove(p.id)}
              style={{ marginLeft: 12, padding: "4px 8px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && !err && <p>No products yet.</p>}
    </div>
  );
}
