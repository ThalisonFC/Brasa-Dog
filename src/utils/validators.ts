/** Regex simples para URL http(s) de imagem */
export const IMAGE_URL_REGEX =
  /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;

export function isValidImageUrl(url: string): boolean {
  if (!url || url.length < 10) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
