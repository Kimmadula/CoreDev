import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api.js";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet(`/articles/${slug}`)
      .then(setArticle)
      .catch((e) => setErr(String(e)));
  }, [slug]);

  return (
    <div>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {article && (
        <>
          <h2>{article.title}</h2>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {article.content}
          </div>
        </>
      )}
    </div>
  );
}
