// Public read side: plain fetch, so supabase-js stays out of the visitor bundle.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isConfigured = Boolean(url && key);

export const BUCKET = "publications";

export type Publication = {
  id: string;
  title: string;
  image_path: string;
  pdf_path: string;
  created_at: string;
};

export async function fetchPublications(): Promise<Publication[]> {
  if (!isConfigured) return [];
  const res = await fetch(
    `${url}/rest/v1/publications?select=*&order=created_at.desc`,
    { headers: { apikey: key } },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const fileUrl = (path: string) =>
  encodeURI(`${url}/storage/v1/object/public/${BUCKET}/${path}`);

/** "outubro de 2026" */
export const formatPublishedAt = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
