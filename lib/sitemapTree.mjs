// Renders the sitemap as a collapsible HTML tree (no XSLT, no external files).
// Pure function: everything it needs is passed in, so it is easy to test.

const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function decode(segment) {
  try { return decodeURIComponent(segment); } catch { return segment; }
}

function buildTree(entries) {
  const root = { name: "", children: new Map(), page: null };
  for (const [path, lastmod] of entries) {
    let node = root;
    for (const segment of path.split("/").filter(Boolean)) {
      if (!node.children.has(segment)) {
        node.children.set(segment, { name: decode(segment), children: new Map(), page: null });
      }
      node = node.children.get(segment);
    }
    node.page = { path, lastmod };
  }
  return root;
}

function countPages(node) {
  let total = node.page ? 1 : 0;
  for (const child of node.children.values()) total += countPages(child);
  return total;
}

export function renderSitemapTree({ entries, siteUrl, langs, localizedPath, siteName = "Sitemap" }) {
  const tree = buildTree(entries);

  const langLinks = path => langs.map(lang =>
    `<a class="lang" href="${esc(siteUrl + localizedPath(lang, path))}">${esc(lang.toUpperCase())}</a>`
  ).join("");

  function renderNode(node, label, depth) {
    const children = [...node.children.entries()]
      .sort(([, a], [, b]) => (b.children.size > 0) - (a.children.size > 0) || a.name.localeCompare(b.name));
    const date = node.page && node.page.lastmod
      ? `<span class="date">${esc(node.page.lastmod.slice(0, 10))}</span>` : "";
    const links = node.page ? `<span class="langs">${langLinks(node.page.path)}</span>` : "";
    const head = `<span class="name">${esc(label)}</span>${date}${links}`;

    if (!children.length) return `<li class="leaf">${head}</li>`;
    const body = children.map(([, child]) => renderNode(child, child.name, depth + 1)).join("");
    return `<li><details${depth < 2 ? " open" : ""}><summary>${head}<span class="count">${countPages(node)}</span></summary><ul>${body}</ul></details></li>`;
  }

  const total = countPages(tree);
  const html = renderNode(tree, "/ (home)", 0);

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(siteName)} · Sitemap tree</title>
<style>
:root{color-scheme:light dark;--bg:#f5f4ee;--fg:#153d35;--muted:#69786e;--line:#c3cfc7;--card:#fff;--accent:#16664e;--chip:#e3eee8}
@media (prefers-color-scheme:dark){:root{--bg:#101c18;--fg:#e3eee8;--muted:#9bb0a5;--line:#2f4a40;--card:#16261f;--accent:#6fd0a8;--chip:#203a30}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:max(24px,env(safe-area-inset-top)) 20px max(24px,env(safe-area-inset-bottom))}
main{max-width:980px;margin:0 auto}
h1{font-size:26px;margin:0 0 6px}
p{color:var(--muted);margin:0 0 14px}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px}
button,.raw{font:inherit;background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:6px 12px;cursor:pointer;text-decoration:none}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;overflow-x:auto}
ul{list-style:none;margin:0;padding:0 0 0 22px;border-left:1px solid var(--line)}
.card>ul{padding-left:0;border-left:0}
li{position:relative;padding:3px 0 3px 14px}
.card>ul>li{padding-left:0}
li li::before{content:"";position:absolute;left:0;top:17px;width:10px;border-top:1px solid var(--line)}
summary{cursor:pointer;list-style:none;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
summary::-webkit-details-marker{display:none}
summary::before{content:"▸";color:var(--muted);width:1em;transition:transform .15s}
details[open]>summary::before{transform:rotate(90deg)}
.leaf{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.leaf::after{content:none}
.name{font-weight:600;overflow-wrap:anywhere}
.count{background:var(--chip);color:var(--accent);border-radius:999px;padding:0 8px;font-size:12px}
.date{color:var(--muted);font-size:12px}
.langs{display:inline-flex;gap:4px}
a.lang{font-size:12px;font-weight:600;color:var(--accent);background:var(--chip);border-radius:6px;padding:0 6px;text-decoration:none}
a.lang:hover{text-decoration:underline}
</style></head><body><main>
<h1>${esc(siteName)} — Sitemap</h1>
<p>${total} pages, each available in ${langs.length} languages. Search engines read the same data as XML.</p>
<div class="bar"><button id="open" type="button">Expand all</button><button id="close" type="button">Collapse all</button><a class="raw" href="?view=xml">Raw XML</a></div>
<div class="card"><ul>${html}</ul></div>
</main>
<script>
document.getElementById("open").onclick=function(){document.querySelectorAll("details").forEach(function(d){d.open=true})};
document.getElementById("close").onclick=function(){document.querySelectorAll("details").forEach(function(d){d.open=false})};
</script></body></html>`;
}
