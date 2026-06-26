import type { Run } from "./types.ts";

// Schickt einen Durchlauf an den Server; true bei Erfolg, false bei Fehler.
export async function submitRun(run: Run): Promise<boolean> {
	try {
		const res = await fetch("/api/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(run),
		});
		return res.ok;
	} catch {
		return false;
	}
}
