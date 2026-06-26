import { useState } from "react";
import { sessions } from "../sessions.ts";

interface StartScreenProps {
	sessionId: string;
	onSessionChange: (id: string) => void;
	onStart: (name: string, sessionId: string) => void;
	onOpenSlides: (sessionId: string) => void;
}

// Einstieg: Tag/Session waehlen, Namen eingeben + Start (oder Vortrag oeffnen).
// sessionId wird von App kontrolliert, damit die URL mitlaeuft.
export default function StartScreen({ sessionId, onSessionChange, onStart, onOpenSlides }: StartScreenProps) {
	const [name, setName] = useState("");

	const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];
	const trimmed = name.trim();
	const canStart = trimmed.length > 0;

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (canStart) onStart(trimmed, sessionId);
	}

	return (
		<div className="card start-card">
			<div className="badge">Dev2Dev</div>
			<h1>
				JavaScript <span className="accent">Equality</span> &amp; React
			</h1>

			<div className="session-pick">
				{sessions.map((s) => (
					<button key={s.id} type="button" className={s.id === sessionId ? "session-tab active" : "session-tab"} onClick={() => onSessionChange(s.id)}>
						<strong>{s.label}</strong>
						<span>{s.title}</span>
					</button>
				))}
			</div>

			<p className="lead">
				{session.questions.length} kurze Fragen zu <strong>{session.title}</strong>. Sag pro Snippet voraus, was herauskommt.
			</p>

			<form onSubmit={handleSubmit} className="start-form">
				<label htmlFor="name">Dein (anonymer) Name</label>
				<input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="z. B. Anon-7"
					autoComplete="off"
					// biome-ignore lint/a11y/noAutofocus: bewusster Fokus auf das einzige Eingabefeld des Start-Screens
					autoFocus
				/>
				<button type="submit" className="btn-primary" disabled={!canStart}>
					Quiz starten ({session.label}) →
				</button>
			</form>

			<p className="fineprint">Anonym. Es wird nur dein eingegebener Name mit deinen Antworten gespeichert.</p>

			<button type="button" className="host-link" onClick={() => onOpenSlides(sessionId)}>
				Vortrag öffnen ({session.label})
			</button>
		</div>
	);
}
