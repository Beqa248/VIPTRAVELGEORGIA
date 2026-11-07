import { NextResponse } from "next/server";

const LANGS = new Set(["en", "ka", "ru", "he"]);
const EXCLUDED = /^\/(?:admin|api|_next|images)(?:\/|$)/;

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (
    EXCLUDED.test(pathname) ||
    /\.[a-z0-9]+$/i.test(pathname) ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0];

  if (!LANGS.has(lang)) {
    const preferred = request.cookies.get("vtg-locale")?.value;
    const chosen = LANGS.has(preferred) ? preferred : "en";
    url.pathname = "/" + chosen + (pathname === "/" ? "" : pathname);
    return NextResponse.redirect(url, 308);
  }

  const original = "/" + segments.slice(1).join("/");
  url.pathname = original === "/" ? "/" : original.replace(/\/$/, "");

  const headers = new Headers(request.headers);
  headers.set("x-vtg-locale", lang);
  headers.set("x-vtg-path", url.pathname);

  const response = NextResponse.rewrite(url, { request: { headers } });
  response.cookies.set("vtg-locale", lang, {
    path: "/",
    sameSite: "lax",
    maxAge: 31536000,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
