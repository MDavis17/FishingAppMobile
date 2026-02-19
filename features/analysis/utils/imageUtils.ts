import { config } from "common/api/config";

export function speciesImageUri(image: string): string {
  if (!image) return "";
  const base = config.api.replace(/\/$/, "");
  let path: string;
  try {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      path = new URL(image).pathname;
    } else {
      path = image.startsWith("/") ? image : `/${image}`;
    }
  } catch {
    path = image.startsWith("/") ? image : `/${image}`;
  }
  return `${base}${path}`;
}
