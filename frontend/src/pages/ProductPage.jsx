import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [sections, setSections] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([apiGet(`/products/${slug}`), apiGet(`/products/${slug}/sections`)])
      .then(([p, secs]) => {
        setProduct(p);
        setSections(secs);
      })
      .catch((e) => setErr(String(e)));
  }, [slug]);

  return (
    <div>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {product && (
        <>
          <h2>{product.name}</h2>
          {product.description && <p>{product.description}</p>}
        </>
      )}

      <h3>Sections</h3>
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <Link to={`/section/${s.slug}`}>{s.title}</Link>
          </li>
        ))}
      </ul>
      {sections.length === 0 && !err && <p>No sections yet.</p>}
    </div>
  );
}
