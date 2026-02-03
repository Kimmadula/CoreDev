import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../api.js";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/articles/${slug}`)
      .then(setArticle)
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <p>Loading article...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "4rem 2rem" }}>
        {err && (
          <div style={{
            padding: "1rem",
            background: "#fee",
            color: "#c33",
            borderRadius: "4px",
            marginBottom: "2rem"
          }}>
            {err}
          </div>
        )}

        {article && (
          <article>
            <Link to="/" style={{
              color: "#ff6c00",
              textDecoration: "none",
              fontSize: "0.9rem",
              marginBottom: "2rem",
              display: "inline-block"
            }}>
              ← Back
            </Link>

            <h1 style={{
              fontSize: "2.5rem",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
              marginTop: "1rem"
            }}>
              {article.title}
            </h1>

            <div style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginBottom: "2rem",
              paddingBottom: "2rem",
              borderBottom: "1px solid #e5e7eb"
            }}>
              Last updated: {new Date(article.updated_at).toLocaleDateString()}
            </div>

            <div className="ql-editor" style={{
              fontSize: "1rem",
              lineHeight: "1.8",
              color: "#000",
              maxWidth: "100%",
              wordBreak: "normal",
              overflowWrap: "break-word",
              whiteSpace: "normal",
              textAlign: "left"
            }}>
              {(() => {
                let content = article.content;
                try {
                  // Fix common PDF copy-paste artifacts
                  content = content.replace(/ql-align-justify/g, 'ql-align-left');
                  content = content.replace(/text-align:\s*justify/gi, 'text-align: left');

                  // Force List Styles via inline style injection
                  const styleFix = `<style>
                    .ql-editor ul { list-style-type: disc !important; padding-left: 2em !important; }
                    .ql-editor ol { list-style-type: decimal !important; padding-left: 2em !important; }
                    .ql-editor li { display: list-item !important; margin-left: 1em; color: #000 !important; }
                    .ql-editor li[data-list="bullet"] { list-style-type: disc !important; }
                    .ql-editor li[data-list="ordered"] { list-style-type: decimal !important; }
                  </style>`;
                  content = styleFix + content;

                  const parser = new DOMParser();
                  const doc = parser.parseFromString(content, 'text/html');

                  // Fix PDF copy/paste artifacts: words split by newlines/spaces
                  // Examples: "u sed" -> "used", "SOLUTI ONS" -> "SOLUTIONS", "Fin ancial" -> "Financial"
                  const COMMON_SHORT_WORDS = new Set([
                    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have",
                    "he", "her", "his", "i", "if", "in", "into", "is", "it", "its", "me", "my",
                    "of", "on", "or", "our", "she", "so", "than", "that", "the", "their", "them",
                    "then", "there", "these", "they", "this", "those", "to", "us", "was", "we",
                    "were", "what", "when", "where", "which", "who", "why", "will", "with", "you",
                    "your"
                  ]);

                  function normalizeTextNodeValue(text) {
                    let t = text;

                    // Join single-letter lower-case fragments: "u sed" -> "used"
                    t = t.replace(/\b([a-z])\s+([a-z]{2,})\b/g, "$1$2");

                    // Join hyphenated words split by spaces: "self- confidence" -> "selfconfidence"
                    // (Assuming the hyphen was a line-break artifact)
                    t = t.replace(/([a-zA-Z]+)-\s+([a-zA-Z]+)/g, "$1$2");

                    // Join short fragments followed by lowercase continuation: "Fin ancial" -> "Financial"
                    t = t.replace(/\b([A-Za-z]{1,3})\s+([a-z]{2,})\b/g, (match, a, b) => {
                      const aLower = String(a).toLowerCase();
                      if (COMMON_SHORT_WORDS.has(aLower)) return match;
                      return `${a}${b}`;
                    });

                    // Join uppercase fragments: "SOLUTI ONS" -> "SOLUTIONS"
                    t = t.replace(/\b([A-Z]{2,})\s+([A-Z]{2,})\b/g, (match, a, b) => {
                      // Avoid merging acronyms that are legitimately separated
                      if (b.length > 3) return match;
                      return `${a}${b}`;
                    });

                    return t;
                  }

                  function normalizeTextNodes(root) {
                    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                    const nodes = [];
                    let n;
                    while ((n = walker.nextNode())) nodes.push(n);
                    for (const node of nodes) {
                      node.nodeValue = normalizeTextNodeValue(node.nodeValue || "");
                    }
                  }

                  normalizeTextNodes(doc.body);

                  // Fix PDF Copy-Paste Issues: Merge fragmented paragraphs (p or div)
                  const blocks = Array.from(doc.querySelectorAll('p, div'));

                  for (let i = 0; i < blocks.length - 1; i++) {
                    const curr = blocks[i];
                    const next = blocks[i + 1];

                    // Skip containers and lists
                    if (curr.querySelector('p, div, ul, ol, li') || next.querySelector('p, div, ul, ol, li')) continue;

                    // Ensure immediate siblings
                    if (curr.nextElementSibling !== next) continue;

                    const currText = curr.textContent.trim();
                    const nextText = next.textContent.trim();

                    if (!currText || !nextText) continue;

                    const lastChar = currText.slice(-1);

                    // Check for bullets/lists in next line
                    const isNextBullet = /^[•\-\*⁃]/.test(nextText) || /^\d+\./.test(nextText);

                    if (!/[.!?:;]/.test(lastChar) && !isNextBullet) {
                      let separator = " ";
                      let shouldMerge = true;

                      if (lastChar === "-") {
                        curr.innerHTML = curr.innerHTML.replace(/-$/, '');
                        separator = "";
                      }

                      if (shouldMerge) {
                        curr.innerHTML = curr.innerHTML + separator + next.innerHTML;
                        next.remove();
                        blocks.splice(i + 1, 1);
                        i--;
                      }
                    }
                  }

                  // Handle YouTube links
                  const links = Array.from(doc.querySelectorAll('a'));
                  let modified = false;

                  links.forEach(link => {
                    const href = link.getAttribute('href');
                    const ytMatch = href && href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);

                    if (ytMatch) {
                      const videoId = ytMatch[1];
                      const wrapper = doc.createElement('div');
                      wrapper.style.maxWidth = "100%";
                      wrapper.style.margin = "0 auto 2rem auto";

                      const inner = doc.createElement('div');
                      inner.style.position = "relative";
                      inner.style.paddingBottom = "56.25%";
                      inner.style.height = "0";
                      inner.style.overflow = "hidden";
                      inner.style.borderRadius = "8px";

                      inner.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" 
                              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowfullscreen></iframe>`;

                      wrapper.appendChild(inner);

                      if (link.parentNode && link.parentNode.tagName === 'P' && link.parentNode.childNodes.length === 1) {
                        link.parentNode.parentNode.replaceChild(wrapper, link.parentNode);
                      } else {
                        link.replaceWith(wrapper);
                      }
                      modified = true;
                    }
                  });

                  return <div className="ql-editor" dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
                } catch (e) {
                  console.error("Error parsing content:", e);
                  return <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />;
                }
              })()}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
