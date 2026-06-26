import { useEffect, useMemo, useState } from "react";
import { submitRun } from "../api.ts";
import { labelFor } from "../questions.ts";
import type { Answer, Question, Run, Session } from "../types.ts";
import CodeBlock from "./CodeBlock.tsx";

interface EndScreenProps {
	name: string;
	session: Session;
	answers: Answer[];
	onRestart: () => void;
}

type SendStatus = "sending" | "ok" | "error";

// Schickt den Durchlauf an den Server und bedankt sich.
// Optionaler Toggle: Aufloesung anzeigen (Default aus).
export default function EndScreen({ name, session, answers, onRestart }: EndScreenProps) {
	const [status, setStatus] = useState<SendStatus>("sending");
	const [showSolutions, setShowSolutions] = useState(false);

	const byId = useMemo<Record<string, Question>>(() => Object.fromEntries(session.questions.map((q) => [q.id, q])), [session]);
	const correctCount = answers.filter((a) => a.correct).length;

	// Genau einmal absenden (StrictMode ruft Effects im Dev doppelt -> guard).
	// biome-ignore lint/correctness/useExhaustiveDependencies: bewusst nur beim Mount senden
	useEffect(() => {
		let done = false;
		const run: Run = {
			name,
			session: session.id,
			startedAt: answers.length ? Date.now() - answers.reduce((s, a) => s + a.ms, 0) : Date.now(),
			finishedAt: Date.now(),
			answers,
		};
		submitRun(run).then((ok) => {
			if (!done) setStatus(ok ? "ok" : "error");
		});
		return () => {
			done = true;
		};
	}, []);

	return (
		<div className="card end-card">
			<div className="badge">Fertig</div>
			<h1>Danke, {name}! 🎉</h1>

			<div className="score">
				<span className="score-num">
					{correctCount}
					<span className="score-den"> / {answers.length}</span>
				</span>
				<span className="score-label">richtig</span>
			</div>

			<p className={`save-status save-${status}`}>
				{status === "sending" && "Antworten werden gespeichert …"}
				{status === "ok" && "✓ Antworten gespeichert."}
				{status === "error" && "⚠ Speichern fehlgeschlagen — läuft der Server? Antworten gingen nicht raus."}
			</p>

			<div className="end-actions">
				<button type="button" className="btn-ghost" onClick={() => setShowSolutions((s) => !s)}>
					{showSolutions ? "Auflösung ausblenden" : "Auflösung anzeigen"}
				</button>
				<button type="button" className="btn-primary" onClick={onRestart}>
					Nächste Person →
				</button>
			</div>

			{showSolutions && (
				<div className="solutions">
					{answers.map((a) => {
						const q = byId[a.id];
						if (!q) return null; // Antwort ohne passende Frage (z.B. fremde ID) ueberspringen
						return (
							<div key={a.id} className={`solution ${a.correct ? "is-correct" : "is-wrong"}`}>
								<CodeBlock code={q.code} />
								<div className="solution-row">
									<span>
										Deine Antwort: <strong>{labelFor(q, a.choice)}</strong>
									</span>
									<span>
										Richtig: <strong>{labelFor(q, q.answer)}</strong>
									</span>
								</div>
								<p className="solution-explain">{q.explanation}</p>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
