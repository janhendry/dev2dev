import { useCallback, useEffect, useState } from "react";
import EndScreen from "./components/EndScreen.tsx";
import QuizScreen from "./components/QuizScreen.tsx";
import SlideDeck from "./components/SlideDeck.tsx";
import StartScreen from "./components/StartScreen.tsx";
import { sessionById } from "./sessions.ts";
import type { Answer, SlidePosition, Variant } from "./types.ts";
import { readUrl, writeUrl } from "./url.ts";

type Screen = "start" | "quiz" | "end" | "slides";

const isScreen = (v: string | null): v is Screen => v === "start" || v === "quiz" || v === "end" || v === "slides";

// Screens: start -> quiz -> end, plus Praesentations-Modus (slides). Die
// Session (Tag 1 / Tag 2) bestimmt Quiz-Fragen und Deck. Der Zustand wird in
// der URL gespiegelt (url.ts), damit F5 die Position behaelt.
export default function App() {
	const initial = readUrl();
	const [screen, setScreen] = useState<Screen>(isScreen(initial.screen) ? initial.screen : "start");
	const [name, setName] = useState("");
	const [sessionId, setSessionId] = useState(sessionById(initial.sessionId).id);
	const [quizIndex, setQuizIndex] = useState(initial.q && initial.q > 0 ? initial.q - 1 : 0);
	const [answers, setAnswers] = useState<Answer[]>([]);

	// Slide-Position (nur im slides-Screen). deckId null = Deck der Session.
	const [deckId, setDeckId] = useState<string | null>(initial.deck || null);
	const [slideIndex, setSlideIndex] = useState(initial.slide && initial.slide > 0 ? initial.slide - 1 : 0);
	const [slideStep, setSlideStep] = useState(initial.step || 0);
	const [variant, setVariant] = useState<Variant>(initial.variant === "full" ? "full" : "reduced");

	const session = sessionById(sessionId);

	// State -> URL. q nur im Quiz (1-basiert), deck/slide/step/variant nur in slides.
	useEffect(() => {
		const slides = screen === "slides";
		writeUrl({
			sessionId,
			screen,
			q: screen === "quiz" ? quizIndex + 1 : null,
			deck: slides ? deckId : null,
			slide: slides ? slideIndex + 1 : null,
			step: slides ? slideStep : null,
			variant: slides ? variant : null,
		});
	}, [screen, sessionId, quizIndex, deckId, slideIndex, slideStep, variant]);

	// SlideDeck meldet seine Position nach oben (-> URL). Stabile Referenz.
	const handleSlidePos = useCallback((pos: SlidePosition) => {
		setDeckId(pos.deckId);
		setSlideIndex(pos.slide);
		setSlideStep(pos.step);
		setVariant(pos.variant);
	}, []);

	function handleStart(playerName: string, sid: string) {
		setName(playerName);
		setSessionId(sid);
		setAnswers([]);
		setQuizIndex(0);
		setScreen("quiz");
	}

	function handleFinish(finalAnswers: Answer[]) {
		setAnswers(finalAnswers);
		setScreen("end");
	}

	function handleRestart() {
		setName("");
		setAnswers([]);
		setQuizIndex(0);
		setScreen("start");
	}

	function openSlides(sid: string) {
		setSessionId(sid);
		// Frische Folien-Session: Deck der Session, Anfang, kein Fragment.
		setDeckId(null);
		setSlideIndex(0);
		setSlideStep(0);
		setVariant("reduced");
		setScreen("slides");
	}

	// Praesentations-Modus rendert vollflaechig ohne Card/Footer-Rahmen.
	if (screen === "slides") {
		return <SlideDeck initialDeckId={deckId ?? session.deck.id} initialSlide={slideIndex} initialStep={slideStep} initialVariant={variant} onPosChange={handleSlidePos} onExit={() => setScreen("start")} />;
	}

	return (
		<main className="app">
			{screen === "start" && <StartScreen sessionId={sessionId} onSessionChange={setSessionId} onStart={handleStart} onOpenSlides={openSlides} />}
			{screen === "quiz" && <QuizScreen questions={session.questions} initialIndex={quizIndex} onIndexChange={setQuizIndex} onFinish={handleFinish} />}
			{screen === "end" && <EndScreen name={name} session={session} answers={answers} onRestart={handleRestart} />}
			<footer className="app-footer">
				Dev2Dev · {session.label} · {session.title}
			</footer>
		</main>
	);
}
