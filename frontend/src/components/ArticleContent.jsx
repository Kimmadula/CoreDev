import { useEffect, useState } from "react";

export default function ArticleContent({ content }) {
    const [safeContent, setSafeContent] = useState("");

    useEffect(() => {
        if (!content) {
            setSafeContent("");
            return;
        }

        let processedIdx = content;

        try {
            // 1. FIX NON-BREAKING SPACES - This is the main cause of word breaks!
            processedIdx = processedIdx.replace(/&nbsp;/g, ' ');
            processedIdx = processedIdx.replace(/\u00A0/g, ' '); // Unicode non-breaking space

            // 1b. Collapse multiple spaces into single spaces
            processedIdx = processedIdx.replace(/\s{2,}/g, ' ');

            // 2. Strip borders and shadows to fix "box thingy", but ALLOW backgrounds (for highlights)
            processedIdx = processedIdx.replace(/border(-[a-z]+)?:\s*[^;]+;?/gi, '');
            processedIdx = processedIdx.replace(/box-shadow:\s*[^;]+;?/gi, '');

            // 3. Fix legacy alignment classes
            processedIdx = processedIdx.replace(/ql-align-justify/g, 'ql-align-left');
            processedIdx = processedIdx.replace(/text-align:\s*justify/gi, 'text-align: left');

            // 4. Inject Robust CSS for Lists and Typography
            const styleFix = `<style>
        /* Force Reset - Scoped to Custom Viewer */
        .custom-article-content .ql-editor ul, .custom-article-content .ql-editor ol { margin: 0 0 1em 0 !important; padding: 0 !important; list-style: none !important; }
        .custom-article-content .ql-editor li { 
            display: block !important; 
            position: relative !important; 
            margin: 0.5em 0 !important; 
            padding-left: 1.5em !important; 
            color: inherit; 
            background: transparent; 
            text-align: left !important; 
            overflow: visible !important; 
        }
        .custom-article-content .ql-editor li::marker { content: none !important; display: none !important; } 
        .custom-article-content .ql-editor .ql-ui { display: none !important; }

        /* Custom Bullet (Unordered) */
        .custom-article-content .ql-editor ul > li::before {
            content: "•"; 
            position: absolute; 
            left: 0; 
            top: -0.1em; 
            color: #000 !important; 
            font-weight: bold;
            font-size: 1.5em; 
            line-height: 1;
        }

        /* Custom Nested Bullets */
        .custom-article-content .ql-editor ul ul > li::before { content: "○"; }
        .custom-article-content .ql-editor ul ul ul > li::before { content: "▪"; }

        /* Custom Numbers (Ordered) */
        .custom-article-content .ql-editor ol { counter-reset: ql-ol; }
        .custom-article-content .ql-editor ol > li { counter-increment: ql-ol; }
        .custom-article-content .ql-editor ol > li::before {
            content: counter(ql-ol) ".";
            position: absolute;
            left: 0;
            width: 1.5em; 
            text-align: left;
            color: #000 !important; 
            font-weight: bold;
            font-size: 1em;
        }

        /* Nested OL */
        .custom-article-content .ql-editor ol ol { counter-reset: ql-ol-2; }
        .custom-article-content .ql-editor ol ol > li { counter-increment: ql-ol-2; }
        .custom-article-content .ql-editor ol ol > li::before {
            content: counter(ql-ol-2, lower-alpha) ".";
        }

        /* Safe Paragraphs & Text Alignment Enforcement - FIXED WORD BREAKING */
        .custom-article-content .ql-editor p, 
        .custom-article-content .ql-editor div, 
        .custom-article-content .ql-editor span,
        .custom-article-content .ql-editor h1,
        .custom-article-content .ql-editor h2,
        .custom-article-content .ql-editor h3,
        .custom-article-content .ql-editor h4,
        .custom-article-content .ql-editor h5,
        .custom-article-content .ql-editor h6,
        .custom-article-content .ql-editor li { 
          hyphens: none !important; 
          -webkit-hyphens: none !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          text-align: left !important;
          text-justify: none !important;
          white-space: normal !important;
        }
        
        /* Ensure all text nodes wrap properly */
        .custom-article-content * {
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
      </style>`;
            processedIdx = styleFix + processedIdx;

            // 5. Parse HTML to handle YouTube video embedding AND Content Cleaning safely
            const parser = new DOMParser();
            const doc = parser.parseFromString(processedIdx, 'text/html');

            // CLEANING: Iterate all LIs to remove ghosts and fix double-numbering
            const listItems = Array.from(doc.querySelectorAll('li'));
            listItems.forEach(li => {
                const text = li.textContent.trim();

                // A. Remove "Ghost" items: empty or just a number/dot (e.g. "2", "2.", "•")
                if (!text || /^[0-9]{1,3}\.?$/.test(text) || /^[a-zA-Z]\.?$/.test(text) || /^•$/.test(text)) {
                    li.remove();
                    return;
                }

                // B. Fix Double Numbering: "10. Head office" -> "Head office"
                // IMPROVED: Only remove if it's genuinely a duplicate number at the start
                const firstChild = li.firstChild;
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    const textContent = firstChild.textContent;
                    const match = textContent.match(/^([0-9]{1,3}\.|[a-zA-Z]\.|[•–—-])\s+/);
                    if (match) {
                        firstChild.textContent = textContent.replace(/^([0-9]{1,3}\.|[a-zA-Z]\.|[•–—-])\s+/, '');
                    }
                }
            });

            // Handle YouTube links & Style stripping (RELAXED)
            const elementsWithStyle = doc.querySelectorAll('[style]');
            elementsWithStyle.forEach(el => {
                // FORCE REMOVE JUSTIFY (Keep this fix!)
                if (el.style.textAlign === 'justify') {
                    el.style.textAlign = 'left';
                }

                // Remove any word-break or overflow settings that might cause issues
                el.style.wordBreak = '';
                el.style.overflowWrap = '';
                el.style.wordWrap = '';

                if (el.getAttribute('style') === '') {
                    el.removeAttribute('style');
                }
            });

            const links = Array.from(doc.querySelectorAll('a'));
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
                }
            });

            setSafeContent(doc.body.innerHTML);

        } catch (e) {
            console.error("Error parsing content:", e);
            // Fallback
            setSafeContent(content);
        }

    }, [content]);

    return (
        <div className="ql-editor custom-article-content" style={{
            fontSize: "1rem",
            lineHeight: "1.8",
            color: "#000",
            maxWidth: "100%",
            wordBreak: "normal",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            whiteSpace: "normal",
            textAlign: "left",
            hyphens: "none",
            WebkitHyphens: "none"
        }}>
            <div dangerouslySetInnerHTML={{ __html: safeContent }} />
        </div>
    );
}