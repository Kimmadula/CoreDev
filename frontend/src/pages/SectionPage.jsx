import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";

export default function SectionPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet(`/sections/${slug}/articles`)
      .then(setArticles)
      .catch((e) => setErr(String(e)));
  }, [slug]);

  return (
    <div>
      <h2>Articles</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <ul>
        {articles.map((a) => (
          <li key={a.id}>
            <Link to={`/article/${a.slug}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
      {articles.length === 0 && !err && <p>No articles yet.</p>}
    </div>
  );
}
