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

export function renderSitemapTree({ entries, siteUrl, langs, localizedPath, siteName = "Sitemap", sitemapHints = () => ({ changefreq: "monthly", priority: "0.5" }) }) {
  const xmlText = value => esc(value);
  const lines = [];
  for (const [path, lastmod] of entries) {
    const { changefreq, priority } = sitemapHints(path);
    for (const lang of langs) {
      const loc = siteUrl + localizedPath(lang, path);
      const links = langs.map(other => {
        const href = siteUrl + localizedPath(other, path);
        return `<div class="line"><span class="tag">&lt;xhtml:link</span> <span class="attr">rel</span>=<span class="value">"alternate"</span> <span class="attr">hreflang</span>=<span class="value">"${xmlText(other)}"</span> <span class="attr">href</span>=<span class="value">"${xmlText(href)}"</span> <span class="tag">/&gt;</span></div>`;
      }).join("");
      const defaultLink = `<div class="line"><span class="tag">&lt;xhtml:link</span> <span class="attr">rel</span>=<span class="value">"alternate"</span> <span class="attr">hreflang</span>=<span class="value">"x-default"</span> <span class="attr">href</span>=<span class="value">"${xmlText(siteUrl + localizedPath(langs.includes("en") ? "en" : langs[0], path))}"</span> <span class="tag">/&gt;</span></div>`;
      lines.push(`<details class="url"><summary><span class="tag">&lt;url&gt;</span> <span class="hint">${xmlText(loc)}</span></summary><div class="line"><span class="tag">&lt;loc&gt;</span><a href="${xmlText(loc)}">${xmlText(loc)}</a><span class="tag">&lt;/loc&gt;</span></div>${lastmod ? `<div class="line"><span class="tag">&lt;lastmod&gt;</span>${xmlText(lastmod)}<span class="tag">&lt;/lastmod&gt;</span></div>` : ""}${`<div class="line"><span class="tag">&lt;changefreq&gt;</span>${xmlText(changefreq)}<span class="tag">&lt;/changefreq&gt;</span></div><div class="line"><span class="tag">&lt;priority&gt;</span>${xmlText(priority)}<span class="tag">&lt;/priority&gt;</span></div>`}${links}${defaultLink}<div class="line tag">&lt;/url&gt;</div></details>`);
    }
  }
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${xmlText(siteName)} XML Sitemap</title>
<style>
html{color-scheme:light}body{background:#fff;color:#111;margin:8px;font:13px/1.5 Consolas,"Courier New",monospace}
header{margin:0 0 12px;font:13px/1.5 Consolas,"Courier New",monospace}header a{margin-left:12px}
.tag{color:#8b008b}.attr{color:#a0522d}.value{color:#145c26}.hint{color:#666;font-size:12px}
a{color:#0645ad;text-decoration:underline}details{margin-left:20px}summary{cursor:pointer;list-style:disclosure-closed}details[open]>summary{list-style:disclosure-open}summary::marker{color:#666}.line{margin-left:22px;overflow-wrap:anywhere}.root{margin-left:0}.end{margin-left:22px}
</style></head><body>
<header>This XML sitemap contains ${lines.length} URLs. <a href="?view=xml">View raw XML</a></header>
<div><span class="tag">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span></div>
<details class="root" open><summary><span class="tag">&lt;urlset</span> <span class="attr">xmlns</span>=<span class="value">"http://www.sitemaps.org/schemas/sitemap/0.9"</span> <span class="attr">xmlns:xhtml</span>=<span class="value">"http://www.w3.org/1999/xhtml"</span><span class="tag">&gt;</span></summary>
${lines.join("\n")}
<div class="end tag">&lt;/urlset&gt;</div></details>
</body></html>`;
}
