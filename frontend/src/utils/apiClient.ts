// Central API client & base resolution
export const resolveApiBase = (): string => {
  let base = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || '').trim();
  if(!base) {
    // Fallback: assume backend on 8080
    base = window.location.origin.replace(/:\d+$/,'') + ':8080';
    if(import.meta.env.DEV) console.warn('[api] Missing VITE_API_BASE_URL, falling back to', base);
  }
  return base.replace(/\/$/, '');
};

export const apiFetch = async (path: string, init?: RequestInit) => {
  const base = resolveApiBase();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/')? path : '/' + path}`;
  const res = await fetch(url, init);
  return res;
};

export const jsonFetch = async <T=any>(path:string, init?: RequestInit): Promise<T> => {
  const res = await apiFetch(path, init);
  if(!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
};