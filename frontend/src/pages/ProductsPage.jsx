import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api.js";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet("/products")
      .then(setItems)
      .catch((e) => setErr(String(e)));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/product/${p.slug}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
      {items.length === 0 && !err && <p>No products yet.</p>}
    </div>
  );
}
