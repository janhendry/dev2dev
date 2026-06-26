// Eine Session = ein Vortragstag: eigenes Quiz + eigener Vortrag (Deck).
// Tag 1 dreht sich um reines JavaScript (Equality & Coercion), Tag 2 um React.
// App.tsx laesst den Host am Start die Session waehlen.
import { jsQuestions, reactQuestions } from "./questions.ts";
import { decks } from "./slides.ts";
import type { Deck, Session } from "./types.ts";

const deckById = (id: string): Deck => {
	const deck = decks.find((d) => d.id === id);
	if (!deck) throw new Error(`Deck "${id}" nicht gefunden`);
	return deck;
};

export const sessions: Session[] = [
	{
		id: "day1",
		label: "Tag 1",
		title: "JavaScript: Equality & Coercion",
		questions: jsQuestions,
		deck: deckById("coercion"),
	},
	{
		id: "day2",
		label: "Tag 2",
		title: "React: Referenzen & Effekte",
		questions: reactQuestions,
		deck: deckById("react"),
	},
];

export const sessionById = (id: string | null | undefined): Session => sessions.find((s) => s.id === id) ?? sessions[0];
