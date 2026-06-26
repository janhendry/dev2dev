import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { decks } from "../slides.ts";
import type { Block, SlidePosition, Variant } from "../types.ts";
import CodeBlock from "./CodeBlock.tsx";

// Wandelt `Backtick` -> <code>, **fett** und *kursiv* in Spans um.
function inline(text: string): ReactNode[] {
	const out: ReactNode[] = [];
	const parts = String(text).split("`");
	parts.forEach((part, i) => {
		if (i % 2 === 1) {
			out.push(<code key={`c${i}`}>{part}</code>);
			return;
		}
		// Innerhalb von Nicht-Code: **fett** und *kursiv*
		const tokens = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
		tokens.forEach((tok, j) => {
			if (/^\*\*[^*]+\*\*$/.test(tok)) {
				out.push(<strong key={`b${i}-${j}`}>{tok.slice(2, -2)}</strong>);
			} else if (/^\*[^*]+\*$/.test(tok)) {
				out.push(<em key={`e${i}-${j}`}>{tok.slice(1, -1)}</em>);
			} else if (tok) {
				out.push(<span key={`s${i}-${j}`}>{tok}</span>);
			}
		});
	});
	return out;
}

// Rendert einen einzelnen Inhaltsblock (ohne Fragment-Logik).
function BlockView({ b }: { b: Block }) {
	switch (b.t) {
		case "badge":
			return <div className="slide-badge">{b.text}</div>;
		case "h":
			return <h1 className="slide-h">{inline(b.text)}</h1>;
		case "sub":
			return <p className="slide-sub">{inline(b.text)}</p>;
		case "p":
			return <p className="slide-p">{inline(b.text)}</p>;
		case "list":
			return (
				<ul className="slide-list">
					{b.items.map((it, i) => (
						<li key={i}>{inline(it)}</li>
					))}
				</ul>
			);
		case "code":
			return <CodeBlock code={b.code} />;
		case "table":
			return (
				<table className="slide-table">
					<thead>
						<tr>
							{b.head.map((h, i) => (
								<th key={i}>{inline(h)}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{b.rows.map((row, i) => (
							<tr key={i}>
								{row.map((cell, j) => (
									<td key={j}>{inline(cell)}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			);
		case "falsy":
			return (
				<div className="falsy-grid">
					<div className="falsy-box falsy-box--false">
						<div className="falsy-label">falsy · {b.falsy.length}</div>
						<div className="falsy-values">
							{b.falsy.map((v) => (
								<code key={v}>{v}</code>
							))}
						</div>
					</div>
					<div className="falsy-box falsy-box--true">
						<div className="falsy-label falsy-label--true">truthy · alles andere</div>
						{b.truthyValues && (
							<div className="falsy-values falsy-values--true">
								{b.truthyValues.map((v) => (
									<code key={v}>{v}</code>
								))}
							</div>
						)}
						{b.truthy && <div className="truthy-note">{inline(b.truthy)}</div>}
					</div>
				</div>
			);
		case "flow":
			return (
				<div className="flow">
					{b.steps.map((s, i) => (
						<div className="flow-row" key={i}>
							<span className="flow-cond">{inline(s.cond)}</span>
							<span className="flow-arrow">→</span>
							<span className="flow-action">{inline(s.action)}</span>
						</div>
					))}
				</div>
			);
		case "callout":
			return <div className={`callout callout-${b.tone || "plain"}`}>{inline(b.text)}</div>;
		default:
			return null;
	}
}

interface SlideDeckProps {
	onExit: () => void;
	initialDeckId?: string;
	initialSlide?: number;
	initialStep?: number;
	initialVariant?: Variant;
	onPosChange?: (pos: SlidePosition) => void;
}

export default function SlideDeck({ onExit, initialDeckId, initialSlide = 0, initialStep = 0, initialVariant = "reduced", onPosChange }: SlideDeckProps) {
	const [deckIndex, setDeckIndex] = useState(() => {
		const i = decks.findIndex((d) => d.id === initialDeckId);
		return i < 0 ? 0 : i;
	});
	const [variant, setVariant] = useState<Variant>(initialVariant); // reduced | full
	const [index, setIndex] = useState(Math.max(initialSlide, 0));
	const [step, setStep] = useState(Math.max(initialStep, 0)); // wie viele Fragmente der aktuellen Slide sichtbar sind

	const deck = decks[Math.min(deckIndex, decks.length - 1)];
	// Variant-Umschalter nur zeigen, wenn das Deck reduced/full-Varianten hat.
	const hasVariants = useMemo(() => deck.slides.some((s) => s.variant), [deck]);

	// Slides nach gewaehlter Schema-Variante filtern (Slides ohne `variant` immer zeigen).
	const slides = useMemo(() => deck.slides.filter((s) => !s.variant || s.variant === variant), [deck, variant]);

	function selectDeck(i: number) {
		setDeckIndex(i);
		setIndex(0);
		setStep(0);
	}

	const safeIndex = Math.min(index, slides.length - 1);
	const slide = slides[safeIndex];
	const fragCount = slide.blocks.filter((b) => b.t === "reveal").length;

	// Aktuelle Position nach oben melden (-> URL); geklemmte Werte fuer Reload.
	useEffect(() => {
		onPosChange?.({ deckId: deck.id, slide: safeIndex, step, variant });
	}, [deck.id, safeIndex, step, variant, onPosChange]);

	const next = useCallback(() => {
		if (step < fragCount) {
			setStep((s) => s + 1);
		} else if (safeIndex < slides.length - 1) {
			setIndex(safeIndex + 1);
			setStep(0);
		}
	}, [step, fragCount, safeIndex, slides.length]);

	const prev = useCallback(() => {
		if (safeIndex > 0) {
			const prevIdx = safeIndex - 1;
			const prevFrags = slides[prevIdx].blocks.filter((b) => b.t === "reveal").length;
			setIndex(prevIdx);
			setStep(prevFrags); // beim Zurueckgehen alle Fragmente zeigen
		}
	}, [safeIndex, slides]);

	// Stabiler Listener: haengt nur an den memoisierten Handlern.
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			switch (e.key) {
				case "ArrowRight":
				case "ArrowDown":
				case " ":
				case "PageDown":
					e.preventDefault();
					next();
					break;
				case "ArrowLeft":
				case "ArrowUp":
				case "PageUp":
					e.preventDefault();
					prev();
					break;
				case "Home":
					setIndex(0);
					setStep(0);
					break;
				case "End":
					setIndex(slides.length - 1);
					setStep(0);
					break;
				case "Escape":
					onExit();
					break;
				default:
					break;
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev, onExit, slides.length]);

	// Fragment-Bloecke der Reihe nach durchnummerieren, damit step sie staffeln kann.
	let fragSeen = -1;
	const progress = ((safeIndex + 1) / slides.length) * 100;

	return (
		<div className={`deck deck-${slide.kind || "normal"}`}>
			<div className="deck-progress">
				<div className="deck-progress-bar" style={{ width: `${progress}%` }} />
			</div>

			<div className="deck-topbar">
				<button type="button" className="deck-exit" onClick={onExit} title="Zurueck (Esc)">
					← zurück
				</button>
				<div className="deck-picker">
					{decks.map((d, i) => (
						<button type="button" key={d.id} className={i === deckIndex ? "vt active" : "vt"} onClick={() => selectDeck(i)}>
							{d.title}
						</button>
					))}
				</div>
				{hasVariants && (
					<div className="deck-variant">
						<span className="deck-variant-label">Schema:</span>
						<button
							type="button"
							className={variant === "reduced" ? "vt active" : "vt"}
							onClick={() => {
								setVariant("reduced");
								setStep(0);
							}}
						>
							Visuell
						</button>
						<button
							type="button"
							className={variant === "full" ? "vt active" : "vt"}
							onClick={() => {
								setVariant("full");
								setStep(0);
							}}
						>
							Spec
						</button>
					</div>
				)}
			</div>

			{/* biome-ignore lint/a11y/noStaticElementInteractions: Klick auf die Buehne ist nur eine Maus-Komfort-Geste; vollwertige Tastatursteuerung laeuft global ueber den window-keydown-Listener */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: s.o. — Tastaturnavigation ist global implementiert */}
			<div className="deck-stage" onClick={next}>
				<div className="slide" key={slide.id}>
					{slide.blocks.map((b, i) => {
						if (b.t === "reveal") {
							fragSeen += 1;
							const shown = fragSeen < step;
							return (
								<div className={`frag ${shown ? "frag-shown" : ""}`} key={i} aria-hidden={!shown}>
									<BlockView b={b.inner} />
								</div>
							);
						}
						return <BlockView b={b} key={i} />;
					})}
				</div>
			</div>

			<div className="deck-footer">
				<span>
					{safeIndex + 1} / {slides.length}
				</span>
				<span className="deck-hint">← → blättern · Leertaste = Auflösung · Esc = zurück</span>
			</div>
		</div>
	);
}
