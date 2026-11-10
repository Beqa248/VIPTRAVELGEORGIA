<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>VIPTravelGeorgia | Sitemap XML Tree</title>
<style>body{font:14px/1.55 Consolas,Monaco,monospace;color:#263238;background:#fff;margin:22px 28px}h1{font:600 20px system-ui;margin:0 0 8px}p{font:13px system-ui;color:#59666a;margin:0 0 20px}.tag{color:#9226a5}.attr{color:#a35d00}.val{color:#165f36}.url{color:#145a8d}details{margin-left:20px}summary{cursor:pointer;list-style:disclosure-closed}details[open]>summary{list-style:disclosure-open}summary::marker{color:#737b81}.line{margin-left:22px;overflow-wrap:anywhere}.root{margin-left:0}.foot{margin-left:22px}.muted{color:#7b858a}</style></head><body>
<h1>VIPTravelGeorgia — XML Sitemap</h1><p>XML tree · <xsl:value-of select="count(s:urlset/s:url)"/> URLs · Click the triangles to expand or collapse each URL.</p>
<div class="line muted">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</div>
<details class="root" open="open"><summary><span class="tag">&lt;urlset</span> <span class="attr">xmlns=</span><span class="val">"http://www.sitemaps.org/schemas/sitemap/0.9"</span> <span class="attr">xmlns:xhtml=</span><span class="val">"http://www.w3.org/1999/xhtml"</span><span class="tag">&gt;</span></summary>
<xsl:for-each select="s:urlset/s:url"><details><summary><span class="tag">&lt;url&gt;</span> <span class="muted"><xsl:value-of select="s:loc"/></span></summary>
<div class="line"><span class="tag">&lt;loc&gt;</span><a class="url" href="{s:loc}"><xsl:value-of select="s:loc"/></a><span class="tag">&lt;/loc&gt;</span></div>
<xsl:if test="s:lastmod"><div class="line"><span class="tag">&lt;lastmod&gt;</span><xsl:value-of select="s:lastmod"/><span class="tag">&lt;/lastmod&gt;</span></div></xsl:if>
<xsl:for-each select="xhtml:link"><div class="line"><span class="tag">&lt;xhtml:link</span> <span class="attr">rel=</span><span class="val">"<xsl:value-of select="@rel"/>"</span> <span class="attr">hreflang=</span><span class="val">"<xsl:value-of select="@hreflang"/>"</span> <span class="attr">href=</span><span class="val">"<xsl:value-of select="@href"/>"</span> <span class="tag">/&gt;</span></div></xsl:for-each>
<div class="foot tag">&lt;/url&gt;</div></details></xsl:for-each>
<div class="foot tag">&lt;/urlset&gt;</div></details>
</body></html>
</xsl:template></xsl:stylesheet>
