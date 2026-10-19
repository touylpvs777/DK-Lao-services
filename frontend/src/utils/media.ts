export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  // ຖ້າເປັນ URL ເຕັມຢູ່ແລ້ວ
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // ຖ້າຮູບຢູ່ໃນໂຟນເດີ public ຂອງ Frontend ໃຫ້ໃຊ້ path ນັ້ນເລີຍ
  if (url.startsWith('/images/')) {
    return url;
  }
  // ກໍລະນີອື່ນໆ ເຊັ່ນຮູບທີ່ອັບໂຫຼດເຂົ້າ Backend
  return `${backendOrigin()}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Uploads are served next to the API: the origin of an absolute VITE_API_BASE_URL (local dev),
// or this page's own origin when the API path is relative (nginx or the Cloudflare Worker proxy it).
function backendOrigin(): string {
  const explicit = import.meta.env.VITE_API_URL as string | undefined;
  if (explicit) return explicit.replace(/\/+$/, '');
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  return /^https?:\/\//.test(apiBase) ? new URL(apiBase).origin : '';
}