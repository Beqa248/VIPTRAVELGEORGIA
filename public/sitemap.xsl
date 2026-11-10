<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="UTF-8" indent="yes" />
<xsl:template match="/">
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>VIPTravelGeorgia · XML Sitemap</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:1100px;margin:40px auto;padding:0 20px;color:#153d35;background:#f5f4ee}h1{font-size:28px;margin-bottom:8px}p{color:#53645c}table{border-collapse:collapse;width:100%;background:#fff;border-radius:10px;overflow:hidden}th,td{text-align:left;padding:12px 16px;border-bottom:1px solid #e4e9e5;font-size:14px;vertical-align:top}th{background:#153d35;color:#fff}a{color:#16664e;overflow-wrap:anywhere}small{color:#69786e}.count{font-weight:600}</style></head><body>
<h1>VIPTravelGeorgia — XML Sitemap</h1>
<p>Public, indexable pages and their language alternatives. This is a human-readable view of the same XML sitemap that search engines process.</p>
<p class="count"><xsl:value-of select="count(s:urlset/s:url)" /> URLs</p>
<table><thead><tr><th>Page URL</th><th>Last modified</th><th>Languages</th></tr></thead><tbody>
<xsl:for-each select="s:urlset/s:url"><tr><td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td><td><xsl:choose><xsl:when test="s:lastmod"><xsl:value-of select="s:lastmod" /></xsl:when><xsl:otherwise><small>Not specified</small></xsl:otherwise></xsl:choose></td><td><xsl:for-each select="xhtml:link"><xsl:if test="position() &gt; 1">, </xsl:if><xsl:value-of select="@hreflang" /></xsl:for-each></td></tr></xsl:for-each>
</tbody></table></body></html>
</xsl:template></xsl:stylesheet>
