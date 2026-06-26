// Flags aus der Vite-Env (VITE_-Prefix).
// VITE_REVIEW=1 -> Review-Modus: zeigt pro Frage sofort die richtige Antwort
// + Erklaerung. Nur zum Korrekturlesen, NICHT im echten Durchlauf aktivieren.
const truthy = (v: unknown): boolean => ["1", "true", "yes", "on"].includes(String(v).toLowerCase());

export const REVIEW: boolean = truthy(import.meta.env.VITE_REVIEW);
