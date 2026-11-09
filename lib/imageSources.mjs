const bucketPaths = [
  "/storage/v1/object/public/tour-media/",
  "/storage/v1/object/public/website-images/",
];

function configuredStorageProject() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
    return url.protocol === "https:" && url.pathname === "/" && !url.port &&
      !url.username && !url.password && !url.search && !url.hash ? url : null;
  } catch {
    return null;
  }
}

const storageProject = configuredStorageProject();

export const storageImagePatterns = storageProject ? bucketPaths.map(path => ({
  protocol: "https",
  hostname: storageProject.hostname,
  port: "",
  pathname: `${path}**`,
  search: "",
})) : [];

export function isOptimizablePhoto(src) {
  if (src.startsWith("/images/")) return !/[?#]/.test(src);
  if (!storageProject || /[?#]/.test(src)) return false;

  try {
    const url = new URL(src);
    return url.origin === storageProject.origin && !url.username && !url.password &&
      bucketPaths.some(path => url.pathname.startsWith(path) && url.pathname.length > path.length);
  } catch {
    return false;
  }
}
