import { useEffect, useState } from "react";
import { REVIEW } from "../config.ts";
import { labelFor, optionsFor } from "../questions.ts";
import type { Answer, Question } from "../types.ts";
import CodeBlock from "./CodeBlock.tsx";

interface QuizScreenProps {
	questions: Question[];
	onFinish: (answers: Answer[]) => void;
	initialIndex?: number;
	onIndexChange?: (index: number) => void;
}

// Zeigt eine Frage nach der anderen; Klick speichert Wahl + Zeit und springt
// weiter, Pfeil-Buttons erlauben freies Navigieren. Antworten werden pro
// Frage-ID gehalten, damit Zurueckspringen keine Doppel-Eintraege erzeugt.
export default function QuizScreen({ questions, onFinish, initialIndex = 0, onIndexChange }: QuizScreenProps) {
	// initialIndex kommt aus der URL (?q=); auf den gueltigen Bereich klemmen.
	const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), questions.length - 1));
	const [answersById, setAnswersById] = useState<Record<string, Answer>>({});
	const [shownAt, setShownAt] = useState(() => Date.now());

	const q = questions[index];
	const isLast = index + 1 >= questions.length;
	const chosen = answersById[q.id]?.choice; // bereits gewaehlte Antwort (falls revisited)
	const progress = ((index + 1) / questions.length) * 100;

	// Timer pro Frage zuruecksetzen + aktuellen Index nach oben melden (-> URL).
	useEffect(() => {
		setShownAt(Date.now());
		onIndexChange?.(index);
	}, [index, onIndexChange]);

	// Antworten in Fragereihenfolge als Array (nur beantwortete Fragen).
	const collect = (byId: Record<string, Answer>): Answer[] => questions.map((qq) => byId[qq.id]).filter(Boolean);

	function choose(choice: string) {
		const answer: Answer = {
			id: q.id,
			choice,
			correct: choice === q.answer,
			ms: Date.now() - shownAt,
		};
		const nextById = { ...answersById, [q.id]: answer };
		setAnswersById(nextById);

		if (isLast) onFinish(collect(nextById));
		else setIndex(index + 1);
	}

	function goPrev() {
		if (index > 0) setIndex(index - 1);
	}

	function goNext() {
		if (isLast) onFinish(collect(answersById));
		else setIndex(index + 1);
	}

	return (
		<div className="card quiz-card">
			<div className="progress">
				<div className="progress-bar" style={{ width: `${progress}%` }} />
				<span className="progress-label">
					Frage {index + 1} / {questions.length}
				</span>
			</div>
			<div className="quiz-meta">
				<span className="category">{q.category}</span>
				{REVIEW && <span className="review-flag">Review-Modus</span>}
			</div>

			<p className="prompt">{q.prompt ?? "Was ergibt der Ausdruck?"}</p>
			<CodeBlock code={q.code} />

			<div className="choices">
				{optionsFor(q).map((o) => {
					const classes = ["choice", `choice-${o.id}`];
					if (REVIEW && o.id === q.answer) classes.push("is-correct");
					if (o.id === chosen) classes.push("is-chosen");
					return (
						<button key={o.id} type="button" className={classes.join(" ")} onClick={() => choose(o.id)}>
							{o.mono ? <code>{o.label}</code> : o.label}
						</button>
					);
				})}
			</div>

			{REVIEW && (
				<div className="review">
					<p className="review-answer">
						Richtig: <strong>{labelFor(q, q.answer)}</strong>
					</p>
					<p className="review-explain">{q.explanation}</p>
					{q.source && <p className="review-source">Quelle: {q.source}</p>}
				</div>
			)}

			<div className="quiz-nav">
				<button type="button" className="nav-btn" onClick={goPrev} disabled={index === 0}>
					← Zurück
				</button>
				<button type="button" className="nav-btn" onClick={goNext}>
					{isLast ? "Auswerten →" : "Weiter →"}
				</button>
			</div>
		</div>
	);
}
