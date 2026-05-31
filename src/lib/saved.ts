export const SAVED_KEY = "mtd:saved";

export function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function writeSaved(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(new Set(ids))));
    window.dispatchEvent(new CustomEvent("mtd:saved-changed"));
  } catch {}
}

export function toggleSaved(id: string): boolean {
  const current = readSaved();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  writeSaved(next);
  return next.includes(id);
}

export function isSaved(id: string): boolean {
  return readSaved().includes(id);
}
