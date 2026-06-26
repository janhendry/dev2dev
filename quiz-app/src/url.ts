// URL <-> App-State (kein Router). Schema:
//   ?s=<sessionId>&screen=<start|quiz|end|slides>&q=<1-basierte Frage>
//   im Slides-Modus zusaetzlich: &deck=<deckId>&slide=<1-basiert>&step=<frag>&variant=<full>
// replaceState statt push: kein History-Eintrag pro Frage/Folie, aber F5
// behaelt die Position und der Link ist teilbar.

export interface UrlState {
	sessionId: string | null;
	screen: string | null;
	q: number | null;
	deck: string | null;
	slide: number | null;
	step: number | null;
	variant: string | null;
}

const toInt = (v: string | null): number | null => {
	if (v == null) return null;
	const n = Number.parseInt(v, 10);
	return Number.isFinite(n) ? n : null;
};

export function readUrl(): UrlState {
	const p = new URLSearchParams(window.location.search);
	return {
		sessionId: p.get("s"),
		screen: p.get("screen"),
		q: toInt(p.get("q")),
		deck: p.get("deck"),
		slide: toInt(p.get("slide")),
		step: toInt(p.get("step")),
		variant: p.get("variant"),
	};
}

export interface UrlWrite {
	sessionId: string | null;
	screen: string | null;
	q: number | null;
	deck: string | null;
	slide: number | null;
	step: number | null;
	variant: string | null;
}

export function writeUrl({ sessionId, screen, q, deck, slide, step, variant }: UrlWrite): void {
	const p = new URLSearchParams();
	if (sessionId) p.set("s", sessionId);
	// "start" ist der Default -> nicht in die URL schreiben (haelt sie sauber).
	if (screen && screen !== "start") p.set("screen", screen);
	if (q != null) p.set("q", String(q));
	if (deck) p.set("deck", deck);
	if (slide != null) p.set("slide", String(slide));
	if (step) p.set("step", String(step)); // 0 (kein Fragment) weglassen
	if (variant && variant !== "reduced") p.set("variant", variant); // Default weglassen

	const qs = p.toString();
	const url = qs ? `?${qs}` : window.location.pathname;
	window.history.replaceState(null, "", url);
}
