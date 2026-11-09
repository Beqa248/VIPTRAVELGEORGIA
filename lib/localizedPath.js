export function localizedPath(lang, path) {
  return `/${lang}${path === "/" ? "" : path}`;
}
