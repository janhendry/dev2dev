// Zentrale Domaenentypen der Quiz-App. Bewusst an EINER Stelle, damit Fragen,
// Slides, Sessions, Server und Auswertung dieselben Formen teilen.

// --- Quiz ----------------------------------------------------------------

// Eine Antwortoption. `mono` rendert das Label monospaced (fuer Code-Werte).
export interface Option {
	id: string;
	label: string;
	mono?: boolean;
}

// `type` dient nur der Doku/Gruppierung, nicht der Logik.
export type QuestionType = "expr" | "output" | "order" | "concept";

export interface Question {
	id: string;
	category: string;
	type?: QuestionType;
	code: string;
	prompt?: string;
	// Fehlt `options`, gilt das Preset TF (nur true/false).
	options?: Option[];
	answer: string;
	explanation: string;
	source?: string;
}

// --- Slides / Decks ------------------------------------------------------

export type Tone = "accent" | "warn" | "plain";

// Ein Inhaltsblock einer Slide (diskriminiert ueber `t`). `reveal` umhuellt
// einen anderen Block, der erst per Tastendruck sichtbar wird (Fragment).
export type Block =
	| { t: "badge"; text: string }
	| { t: "h"; text: string }
	| { t: "sub"; text: string }
	| { t: "p"; text: string }
	| { t: "list"; items: string[] }
	| { t: "code"; code: string }
	| { t: "table"; head: string[]; rows: string[][] }
	| { t: "falsy"; falsy: string[]; truthy?: string; truthyValues?: string[] }
	| { t: "flow"; steps: { cond: string; action: string }[] }
	| { t: "callout"; text: string; tone?: Tone }
	| { t: "reveal"; inner: Block };

export type SlideKind = "title" | "question" | "normal";
export type Variant = "reduced" | "full";

export interface Slide {
	id: string;
	kind?: SlideKind;
	// Schema-Variante: Slides ohne `variant` erscheinen immer.
	variant?: Variant;
	blocks: Block[];
}

export interface Deck {
	id: string;
	title: string;
	slides: Slide[];
}

// Position innerhalb des Praesentations-Modus (SlideDeck -> App -> URL).
export interface SlidePosition {
	deckId: string;
	slide: number;
	step: number;
	variant: Variant;
}

// --- Sessions ------------------------------------------------------------

export interface Session {
	id: string;
	label: string;
	title: string;
	questions: Question[];
	deck: Deck;
}

// --- Durchlauf / Server --------------------------------------------------

// Eine einzelne beantwortete Frage in einem Durchlauf.
export interface Answer {
	id: string;
	choice: string;
	correct: boolean;
	ms: number;
}

// Ein abgeschlossener Quiz-Durchlauf (Client -> POST /api/submit).
export interface Run {
	name: string;
	session: string;
	startedAt: number;
	finishedAt: number;
	answers: Answer[];
}
