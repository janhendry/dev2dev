// Validiert den Fragenkatalog: fuehrt den JS-Code jeder Frage aus und prueft,
// dass die hinterlegte `answer` mit dem echten JS-Verhalten uebereinstimmt.
// Die Erwartung wird immer aus `answer` abgeleitet, nie neu abgetippt.

import { describe, expect, test } from "vitest";
import { optionsFor, questions } from "./questions";
import type { Question } from "./types";

const byId: Record<string, Question> = Object.fromEntries(questions.map((q) => [q.id, q]));

// Label der als richtig markierten Option.
const correctLabel = (q: Question): string | undefined => optionsFor(q).find((o) => o.id === q.answer)?.label;

// {-fuehrende Ausdruecke werden geklammert, sonst parst JS sie als Block.
function runExpr(code: string): unknown {
	const t = code.trim();
	const wrapped = t.startsWith("{") ? `(${t})` : t;
	// biome-ignore lint/security/noGlobalEval: bewusst — wir validieren echtes JS-Verhalten.
	return eval(wrapped);
}

// console.log abfangen und die geloggten Zeilen einsammeln.
function captureLog(code: string): string[] {
	const orig = console.log;
	const lines: string[] = [];
	console.log = (...args: unknown[]) => lines.push(args.join(" "));
	try {
		// biome-ignore lint/security/noGlobalEval: bewusst — siehe runExpr.
		eval(code);
	} finally {
		console.log = orig;
	}
	return lines;
}

// Wandelt ein Options-Label in den JS-Wert, den es beschreibt.
function labelToValue(label: string): unknown {
	const s = label.trim();
	if (s.startsWith('""')) return ""; // '"" (leerer String)'
	const quoted = s.match(/^"(.*)"$/);
	if (quoted) return quoted[1]; // '"53"' -> "53"
	if (s === "NaN") return NaN;
	if (s === "null") return null;
	if (s === "undefined") return undefined;
	if (/^-?\d+$/.test(s)) return Number(s); // "2", "-1", "34"
	return s; // Roh-String, z.B. "5 7 7" oder "true, false"
}

const codeLabel = (q: Question) => q.code.replace(/\n/g, " ; ");

// 1. STRUKTUR — gilt fuer alle Fragen
describe("Struktur", () => {
	test("alle IDs sind eindeutig", () => {
		const ids = questions.map((q) => q.id);
		expect(new Set(ids).size, "doppelte Frage-ID gefunden").toBe(ids.length);
	});

	test("jede answer zeigt auf eine existierende Option", () => {
		for (const q of questions) {
			const ids = optionsFor(q).map((o) => o.id);
			expect(ids, `${q.id}: answer "${q.answer}" ist keine gueltige Option`).toContain(q.answer);
		}
	});

	test("jede Frage hat code und explanation", () => {
		for (const q of questions) {
			expect(q.code?.trim(), `${q.id}: code fehlt`).toBeTruthy();
			expect(q.explanation?.trim(), `${q.id}: explanation fehlt`).toBeTruthy();
		}
	});
});

// 2. JS-AUSFUEHRUNG — pure JS-Fragen wirklich ausfuehren

// True/false-Fragen: code ist ein boolescher Ausdruck, verglichen mit answer.
const BOOLEAN_IDS = [
	"q01",
	"q02",
	"q03",
	"q04",
	"q05",
	"q06", // ===
	"q07",
	"q08",
	"q09",
	"q10",
	"q11", // == Coercion
	"q12",
	"q13",
	"q14",
	"q15",
	"q16", // == Arrays
	"q17",
	"q18",
	"q19",
	"q20", // Object.is
	"q21",
	"q22",
	"q23",
	"q24",
	"q25",
	"q26", // Referenz
	"q27",
	"q28", // typeof
	"q47",
	"q48", // == null vs 0
];

// Output-Fragen: code ist ein Ausdruck, die richtige Option beschreibt den
// Wert. Ausgefuehrt und via Object.is verglichen.
const OUTPUT_EXPR_IDS =["q35", "q36", "q37", "q38", "q39", "q40", "q41", "q42", "q43", "q43b", "q45"];

describe("JS-Ausfuehrung: Boolean-Ausdruecke", () => {
	test.each(BOOLEAN_IDS)("%s liefert das in answer hinterlegte Boolean", (id) => {
		const q = byId[id];
		const actual = runExpr(q.code);
		expect(typeof actual, `${id}: Ausdruck ergibt kein Boolean (${String(actual)}) — ${codeLabel(q)}`).toBe("boolean");
		expect(actual, `${id}: JS liefert ${actual}, hinterlegte answer ist "${q.answer}" — ${codeLabel(q)}`).toBe(q.answer === "true");
	});
});

describe("JS-Ausfuehrung: Output-Ausdruecke", () => {
	test.each(OUTPUT_EXPR_IDS)("%s entspricht der richtigen Option", (id) => {
		const q = byId[id];
		const label = correctLabel(q);
		expect(label, `${id}: keine richtige Option gefunden`).toBeDefined();
		const actual = runExpr(q.code);
		const expected = labelToValue(label as string);
		// Object.is beschreibt NaN/-0 korrekt.
		expect(Object.is(actual, expected), `${id}: JS liefert ${String(actual)} (${typeof actual}), ` + `richtige Option beschreibt ${String(expected)} (${typeof expected})`).toBe(true);
	});

	test("q44 [increment]: x++ / ++x via console.log", () => {
		const q = byId.q44;
		const logged = captureLog(q.code).join(" ");
		expect(logged, `q44: console.log gibt "${logged}"`).toBe(correctLabel(q)); // "5 7 7"
	});

	test("q46 [nan]: isNaN('hallo') vs Number.isNaN('hallo')", () => {
		const q = byId.q46;
		const [line1, line2] = q.code.split("\n");
		const actual = `${runExpr(line1)}, ${runExpr(line2)}`;
		expect(actual, `q46: JS liefert "${actual}"`).toBe(correctLabel(q)); // "true, false"
	});
});

// 3. REACT-FUNDAMENT — die pure-JS-Annahme hinter jeder React-Frage
// React-Laufzeit braucht einen Renderer; pruefbar ist die JS-Annahme dahinter
// (Object.is / Referenzidentitaet), auf der die jeweilige Antwort beruht.
describe("React-Fundament: pure-JS-Annahme hinter der Antwort", () => {
	test("q29: setState mit gleichem primitivem Wert -> Bail-out", () => {
		// answer "true": React kann das Re-Render vermeiden, weil Object.is(0,0).
		expect(byId.q29.answer).toBe("true");
		expect(Object.is(0, 0)).toBe(true);
	});

	test("q30: neues Objekt mit gleichem Inhalt -> Update", () => {
		// answer "true": neues Objekt -> neue Referenz -> Object.is false.
		expect(byId.q30.answer).toBe("true");
		expect(Object.is({ status: "open" }, { status: "open" })).toBe(false);
	});

	test("q31: pro Render neu erzeugte Dependency -> Effekt laeuft erneut", () => {
		// answer "true": filter wird jeden Render neu erzeugt -> neue Referenz.
		expect(byId.q31.answer).toBe("true");
		const mkFilter = (status: string) => ({ status });
		expect(Object.is(mkFilter("open"), mkFilter("open"))).toBe(false);
	});

	test("q32: neuer Objekt-Prop pro Render -> memo kann NICHT ueberspringen", () => {
		// answer "false": shallow compare schlaegt fehl, weil neue Referenz.
		expect(byId.q32.answer).toBe("false");
		const status = "open";
		expect(Object.is({ status }, { status })).toBe(false);
	});

	test("q33: neues value-Objekt pro Provider-Render -> Consumer re-rendern", () => {
		// answer "true": value ist jeden Render ein neues Objekt.
		expect(byId.q33.answer).toBe("true");
		const mkValue = (locale: string, setLocale: () => void) => ({ locale, setLocale });
		const setLocale = () => {};
		expect(Object.is(mkValue("de", setLocale), mkValue("de", setLocale))).toBe(false);
	});

	test("q34: neue Funktionsreferenz pro Render -> memo greift nicht", () => {
		// answer "false": ohne useCallback ist onSave jeden Render eine neue Funktion.
		expect(byId.q34.answer).toBe("false");
		const mkHandler = () => () => {};
		expect(Object.is(mkHandler(), mkHandler())).toBe(false);
	});

	test("q49: push mutiert -> gleiche Referenz -> Bail-out", () => {
		// answer "a" (zeigt weiter "1, 2, 3"): push aendert Inhalt, nicht die Referenz.
		expect(byId.q49.answer).toBe("a");
		const items = [1, 2, 3];
		const before = items;
		items.push(4);
		expect(Object.is(items, before)).toBe(true); // gleiche Referenz -> Bail-out
	});
});

// Reine React-Laufzeit-Fragen: nur Struktur pruefbar, Inhalt manuell verifiziert.
const REACT_RUNTIME_ONLY: Record<string, string> = {
	q50: "Ref-Mutation loest kein Re-Render aus",
	q51: "fehlendes Dependency-Array + setState -> Endlosschleife",
	q52: "Render top-down, Effekte bottom-up, Cleanup top-down",
	q53: "[]-Dependency -> Effekt nur einmal, Stale-Closure-Cleanup",
};

describe("React-Laufzeit: nur Struktur (Renderer/DOM noetig fuer Ausfuehrung)", () => {
	test.each(Object.entries(REACT_RUNTIME_ONLY))("%s (%s)", (id) => {
		const q = byId[id];
		const ids = optionsFor(q).map((o) => o.id);
		expect(ids, `${id}: answer ungueltig`).toContain(q.answer);
		// Bewusst NICHT ausgefuehrt: braucht React-Renderer/DOM.
	});
});

// 4. ABDECKUNG — keine Frage faellt unbemerkt durchs Raster
describe("Abdeckung", () => {
	test("jede Frage ist von genau einer Pruefschicht abgedeckt", () => {
		const covered = new Set([...BOOLEAN_IDS, ...OUTPUT_EXPR_IDS, "q44", "q46", "q29", "q30", "q31", "q32", "q33", "q34", "q49", ...Object.keys(REACT_RUNTIME_ONLY)]);
		const missing = questions.map((q) => q.id).filter((id) => !covered.has(id));
		expect(missing, `nicht abgedeckte Fragen: ${missing.join(", ")}`).toEqual([]);
	});
});
