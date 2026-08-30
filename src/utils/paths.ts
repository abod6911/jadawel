export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (basePath && path.startsWith('/') && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}
