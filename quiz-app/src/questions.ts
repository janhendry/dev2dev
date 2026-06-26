// Fragenkatalog fuer beide Vortragstage: jsQuestions (Tag 1) und reactQuestions
// (Tag 2). Die Spielreihenfolge je Tag ergibt sich aus RAMP_JS / RAMP_REACT am
// Dateiende; Frage-Schema siehe Type `Question` in types.ts.

import type { Option, Question } from "./types.ts";

// TF: Default-Optionen fuer reine true/false-Fragen.
export const TF: Option[] = [
	{ id: "true", label: "true" },
	{ id: "false", label: "false" },
];

// TFED: TF plus Fehler/depends, wo diese Antworten plausibel sind.
export const TFED: Option[] = [
	{ id: "true", label: "true" },
	{ id: "false", label: "false" },
	{ id: "error", label: "Fehler" },
	{ id: "depends", label: "hängt vom Kontext ab" },
];

// Optionen einer Frage (mit Default) und Label-Aufloesung fuer eine choice-id.
export const optionsFor = (q: Question): Option[] => q.options ?? TF;
export const labelFor = (q: Question, choiceId: string): string => optionsFor(q).find((o) => o.id === choiceId)?.label ?? choiceId;

// Rueckwaertskompatibel: aus dem TFED-Preset abgeleitet (eine Quelle der Wahrheit).
export const ANSWER_LABELS: Record<string, string> = Object.fromEntries(TFED.map((o) => [o.id, o.label]));

const questionPool: Question[] = [
	// ---------------------------------------------------------------- === Grundlagen
	{
		id: "q01",
		category: "===",
		code: "1 === 1",
		answer: "true",
		explanation: "Gleicher primitiver Typ und gleicher Wert.",
	},
	{
		id: "q02",
		category: "===",
		code: "1 === '1'",
		answer: "false",
		explanation: "Unterschiedliche Typen, === macht keine Umwandlung.",
	},
	{
		id: "q03",
		category: "===",
		code: "false === 0",
		answer: "false",
		explanation: "Boolean und Number sind unterschiedliche Typen.",
	},
	{
		id: "q04",
		category: "===",
		code: "null === undefined",
		answer: "false",
		explanation: "Unterschiedliche Typen; nur == behandelt sie als gleich.",
	},
	{
		id: "q05",
		category: "===",
		code: "NaN === NaN",
		answer: "false",
		explanation: "Sonderfall der Strict Equality: NaN ist zu nichts gleich, auch nicht zu sich selbst.",
	},
	{
		id: "q06",
		category: "===",
		code: "0 === -0",
		answer: "true",
		explanation: "=== unterscheidet +0 und -0 nicht. (Object.is schon.)",
	},

	// ---------------------------------------------------------------- == Coercion
	{
		id: "q07",
		category: "==",
		code: "'0' == 0",
		answer: "true",
		explanation: "String wird zu Number: Number('0') -> 0, dann 0 == 0.",
	},
	{
		id: "q08",
		category: "==",
		code: "'' == false",
		answer: "true",
		explanation: "Boolean wird zuerst zu Number (false -> 0), dann '' -> 0. 0 == 0.",
	},
	{
		id: "q09",
		category: "==",
		code: "' ' == 0",
		answer: "true",
		explanation: "Whitespace-String wird numerisch zu 0.",
	},
	{
		id: "q10",
		category: "==",
		code: "null == undefined",
		answer: "true",
		explanation: "Spezielle Abstract-Equality-Regel: null und undefined sind nur zueinander ==.",
	},
	{
		id: "q11",
		category: "==",
		code: "undefined == 0",
		answer: "false",
		explanation: "Keine passende Sonderregel; null/undefined werden gegenueber Zahlen nicht umgewandelt.",
	},
	{
		id: "q12",
		category: "==",
		code: "[] == false",
		answer: "true",
		explanation: "[] -> '' -> 0, false -> 0. 0 == 0.",
	},
	{
		id: "q13",
		category: "==",
		code: "[0] == 0",
		answer: "true",
		explanation: "[0] -> '0' -> 0.",
	},
	{
		id: "q14",
		category: "==",
		code: "[1] == true",
		answer: "true",
		explanation: "[1] -> '1' -> 1, true -> 1.",
	},
	{
		id: "q15",
		category: "==",
		code: "[1, 2] == '1,2'",
		answer: "true",
		explanation: "Array wird via ToPrimitive zum String '1,2'.",
	},
	{
		id: "q16",
		category: "==",
		code: "[] == ![]",
		answer: "true",
		explanation: "![] ist false (Objekte sind truthy). Dann [] == false -> [] -> '' -> 0, false -> 0.",
	},

	// ---------------------------------------------------------------- Object.is
	{
		id: "q17",
		category: "object.is",
		code: "Object.is(NaN, NaN)",
		answer: "true",
		explanation: "SameValue behandelt NaN als gleich zu sich selbst (anders als ===).",
	},
	{
		id: "q18",
		category: "object.is",
		code: "Object.is(0, -0)",
		answer: "false",
		explanation: "SameValue unterscheidet +0 und -0 (anders als ===).",
	},
	{
		id: "q19",
		category: "object.is",
		code: "Object.is({}, {})",
		answer: "false",
		explanation: "Zwei verschiedene Objektidentitaeten.",
	},
	{
		id: "q20",
		category: "object.is",
		code: "Object.is(1, '1')",
		answer: "false",
		explanation: "Unterschiedliche Typen, keine Umwandlung.",
	},

	// ---------------------------------------------------------------- Referenz / Identitaet
	{
		id: "q21",
		category: "reference",
		code: "{} === {}",
		answer: "false",
		explanation: "Zwei unabhaengig erzeugte Objekte mit verschiedener Identitaet.",
	},
	{
		id: "q22",
		category: "reference",
		code: "[] === []",
		answer: "false",
		explanation: "Arrays sind Objekte; zwei verschiedene Instanzen.",
	},
	{
		id: "q23",
		category: "reference",
		code: "(() => {}) === (() => {})",
		answer: "false",
		explanation: "Zwei verschiedene Funktionsobjekte.",
	},
	{
		id: "q24",
		category: "reference",
		code: "const a = { id: 1 };\nconst b = a;\na === b",
		answer: "true",
		explanation: "b referenziert dasselbe Objekt wie a.",
	},
	{
		id: "q25",
		category: "reference",
		code: "const a = { id: 1 };\nconst c = { ...a };\na === c",
		answer: "false",
		explanation: "Spread erzeugt ein neues Objekt mit neuer Referenz.",
	},
	{
		id: "q26",
		category: "reference",
		code: "const u = { active: false };\nconst same = u;\nu.active = true;\nu === same",
		answer: "true",
		explanation: "Mutation aendert den Inhalt, nicht die Referenz. Beide zeigen aufs selbe Objekt.",
	},

	// ---------------------------------------------------------------- typeof-Fallen
	{
		id: "q27",
		category: "typeof",
		code: "typeof null === 'object'",
		answer: "true",
		explanation: "Historischer JavaScript-Fehler; null ist primitiv, typeof liefert trotzdem 'object'.",
	},
	{
		id: "q28",
		category: "typeof",
		code: "typeof (() => {}) === 'function'",
		answer: "true",
		explanation: "Funktionen sind Objekte, typeof liefert aber die Sonderkategorie 'function'.",
	},

	// ---------------------------------------------------------------- React
	{
		id: "q29",
		category: "react-state",
		code: "const [count, setCount] = useState(0);\n// count ist aktuell 0\nsetCount(0);",
		prompt: "React kann hier ein erneutes Rendern dieser Komponente vermeiden (bail out), weil der neue State per Object.is gleich dem alten ist.",
		answer: "true",
		explanation: "Object.is(0, 0) ist true. React bailt aus und rendert diese Komponente nicht neu (ggf. nach 1x). Kein neuer Wert -> kein Update.",
	},
	{
		id: "q30",
		category: "react-state",
		code: "const [filter, setFilter] = useState({ status: 'open' });\nsetFilter({ status: 'open' });",
		prompt: "Loest dieses setFilter ein Update / Re-Render aus?",
		answer: "true",
		explanation: "Das neue Objekt hat eine neue Referenz. Object.is(prev, next) ist false -> React behandelt es als Aenderung.",
	},
	{
		id: "q31",
		category: "react-deps",
		code: "function Page({ status }) {\n  const filter = { status };\n  useEffect(() => {\n    load(filter);\n  }, [filter]);\n}",
		prompt: "Laeuft der Effect bei (nahezu) jedem Render erneut?",
		answer: "true",
		explanation: "filter wird bei jedem Render neu erzeugt -> neue Referenz -> Dependency gilt als geaendert.",
	},
	{
		id: "q32",
		category: "react-memo",
		code: "const Child = React.memo(function Child({ filter }) {\n  return null;\n});\nfunction Parent({ status }) {\n  return <Child filter={{ status }} />;\n}",
		prompt: "Kann React.memo das Child-Rendern hier zuverlaessig ueberspringen?",
		answer: "false",
		explanation: "Der Objekt-Prop {{ status }} ist pro Parent-Render eine neue Referenz -> shallow compare schlaegt fehl.",
	},
	{
		id: "q33",
		category: "react-context",
		code: "<Ctx.Provider value={{ locale, setLocale }}>\n  <App />\n</Ctx.Provider>",
		prompt: "Koennen Consumer hier re-rendern, obwohl locale und setLocale sich fachlich nicht geaendert haben?",
		answer: "true",
		explanation: "value ist bei jedem Provider-Render ein neues Objekt -> neue Referenz -> Consumer sehen eine Aenderung (ohne useMemo).",
	},
	{
		id: "q34",
		category: "react-memo",
		code: "function Parent() {\n  const onSave = () => save();\n  return <Child onSave={onSave} />;\n}\n// Child ist React.memo",
		prompt: "Verhindert React.memo hier das Re-Rendern von Child?",
		answer: "false",
		explanation: "onSave ist pro Render eine neue Funktionsreferenz. Ohne useCallback bricht das die shallow-Gleichheit der Props.",
	},

	// Fragen mit eigenen `options` + `type`.
	// ---------------------------------------------------------------- Coercion: was kommt RAUS? (output)
	{
		id: "q35",
		category: "coercion-output",
		type: "output",
		code: "'5' + 3",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: '"53"', mono: true },
			{ id: "b", label: "8", mono: true },
			{ id: "c", label: '"8"', mono: true },
			{ id: "d", label: "NaN", mono: true },
		],
		answer: "a",
		explanation: 'Bei + genuegt EIN String-Operand -> Konkatenation. 3 wird zu "3", Ergebnis "53" (String, nicht Zahl 8).',
		source: "type-coercion-quiz K6 / bfe-js K2",
	},
	{
		id: "q36",
		category: "coercion-output",
		type: "output",
		code: "'5' - 3",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "2", mono: true },
			{ id: "e", label: "53", mono: true },
			{ id: "b", label: '"2"', mono: true },
			{ id: "c", label: "NaN", mono: true },
			{ id: "d", label: "Fehler" },
		],
		answer: "a",
		explanation: "- hat keine String-Variante: beide Seiten via ToNumber. '5' -> 5, dann 5 - 3 = 2 (Zahl). \"53\" waere nur bei '5' + 3 (Konkatenation) richtig.",
		source: "type-coercion-quiz K5",
	},
	{
		id: "q37",
		category: "coercion-output",
		type: "output",
		code: "[] + []",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: '"" (leerer String)', mono: false },
			{ id: "b", label: '"[object Object]"', mono: true },
			{ id: "c", label: "0", mono: true },
			{ id: "d", label: "Fehler" },
		],
		answer: "a",
		explanation: 'Beide Arrays werden via ToPrimitive zu Strings: [].toString() ist "". "" + "" -> "".',
		source: "type-coercion-quiz K1 / bfe-js K3",
	},
	{
		id: "q38",
		category: "coercion-output",
		type: "output",
		code: "[] + {}",
		prompt: "Was ergibt der Ausdruck (als Expression)?",
		options: [
			{ id: "a", label: '"[object Object]"', mono: true },
			{ id: "b", label: '"" (leerer String)', mono: false },
			{ id: "c", label: "0", mono: true },
			{ id: "d", label: "NaN", mono: true },
		],
		answer: "a",
		explanation: '[] -> "", {} -> "[object Object]". "" + "[object Object]" -> "[object Object]".',
		source: "type-coercion-quiz K2 / bfe-js K3",
	},
	{
		id: "q39",
		category: "coercion-output",
		type: "output",
		code: "+[]",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "0", mono: true },
			{ id: "b", label: "NaN", mono: true },
			{ id: "c", label: '"" (leerer String)', mono: false },
			{ id: "d", label: "Fehler" },
		],
		answer: "a",
		explanation: 'Unaeres + ruft ToNumber. [] -> ToString -> "", ToNumber("") -> 0.',
		source: "type-coercion-quiz K11",
	},
	{
		id: "q40",
		category: "coercion-output",
		type: "output",
		code: "+{}",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "NaN", mono: true },
			{ id: "b", label: "0", mono: true },
			{ id: "c", label: '"[object Object]"', mono: true },
			{ id: "d", label: "Fehler" },
		],
		answer: "a",
		explanation: 'Unaeres + -> ToNumber. {} -> "[object Object]", ToNumber davon ist keine gueltige Zahl -> NaN. (Vergleich zu +[] -> 0.)',
		source: "type-coercion-quiz K12",
	},
	{
		id: "q41",
		category: "coercion-output",
		type: "output",
		code: "[3] + [4]",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: '"34"', mono: true },
			{ id: "b", label: "7", mono: true },
			{ id: "c", label: '"7"', mono: true },
			{ id: "d", label: "34", mono: true },
		],
		answer: "a",
		explanation: 'Arrays -> ToString: [3] -> "3", [4] -> "4". Ein String beteiligt -> Konkatenation "3" + "4" = "34" (nicht 7!).',
		source: "type-coercion-quiz K22",
	},
	{
		id: "q42",
		category: "coercion-output",
		type: "output",
		code: "1 + null",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "1", mono: true },
			{ id: "b", label: "NaN", mono: true },
			{ id: "c", label: '"1null"', mono: true },
			{ id: "d", label: "null", mono: true },
		],
		answer: "a",
		explanation: "Kein String/Objekt -> numerische Addition. ToNumber(null) = 0, also 1 + 0 = 1.",
		source: "type-coercion-quiz K19",
	},
	{
		id: "q43",
		category: "coercion-output",
		type: "output",
		code: "1 + undefined",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "NaN", mono: true },
			{ id: "b", label: "1", mono: true },
			{ id: "c", label: '"1undefined"', mono: true },
			{ id: "d", label: "undefined", mono: true },
		],
		answer: "a",
		explanation: "ToNumber(undefined) = NaN, also 1 + NaN = NaN. Genau hier unterscheiden sich null (-> 0) und undefined (-> NaN).",
		source: "type-coercion-quiz K20",
	},
	{
		id: "q43b",
		category: "coercion-output",
		type: "output",
		code: "true + true",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "2", mono: true },
			{ id: "b", label: "true", mono: true },
			{ id: "c", label: '"truetrue"', mono: true },
			{ id: "d", label: "1", mono: true },
		],
		answer: "a",
		explanation: "Kein String/Objekt -> numerische Addition. ToNumber(true) = 1, also 1 + 1 = 2.",
		source: "type-coercion-quiz K4",
	},

	// ---------------------------------------------------------------- ++ und NaN (output)
	{
		id: "q44",
		category: "increment",
		type: "output",
		code: "let x = 5;\nconst a = x++;\nconst b = ++x;\nconsole.log(a, b, x);",
		prompt: "Was loggt console.log(a, b, x)?",
		options: [
			{ id: "a", label: "5 7 7", mono: true },
			{ id: "b", label: "6 7 7", mono: true },
			{ id: "c", label: "5 6 7", mono: true },
			{ id: "d", label: "6 8 8", mono: true },
		],
		answer: "a",
		explanation: "Postfix x++ gibt den ALTEN Wert zurueck (a=5), dann x=6. Prefix ++x erhoeht zuerst (x=7) und gibt den NEUEN Wert (b=7). Ende: x=7.",
		source: "bfe-js K1",
	},
	{
		id: "q45",
		category: "nan",
		type: "output",
		code: "[NaN].indexOf(NaN)",
		prompt: "Was ergibt der Ausdruck?",
		options: [
			{ id: "a", label: "-1", mono: true },
			{ id: "b", label: "0", mono: true },
			{ id: "c", label: "NaN", mono: true },
			{ id: "d", label: "Fehler" },
		],
		answer: "a",
		explanation: "indexOf nutzt === und NaN === NaN ist false -> nie gefunden -> -1. Dagegen findet [NaN].includes(NaN) das NaN (SameValueZero) und ergibt true.",
		source: "bfe-js K5",
	},
	{
		id: "q46",
		category: "nan",
		type: "output",
		code: "isNaN('hallo')\nNumber.isNaN('hallo')",
		prompt: "Was ergeben die beiden Zeilen (in dieser Reihenfolge)?",
		options: [
			{ id: "a", label: "true, false", mono: true },
			{ id: "b", label: "true, true", mono: true },
			{ id: "c", label: "false, false", mono: true },
			{ id: "d", label: "false, true", mono: true },
		],
		answer: "a",
		explanation: "Globales isNaN konvertiert zuerst: Number('hallo') ist NaN -> true. Number.isNaN konvertiert NICHT, prueft strikt auf den Wert NaN -> ein String ist kein NaN -> false.",
		source: "bfe-js K5",
	},

	// ---------------------------------------------------------------- ==-Fallen (true/false) — null vs 0
	{
		id: "q47",
		category: "==",
		code: "null == 0",
		answer: "false",
		explanation: "Intuitiv erwartet man true (null -> 0), aber == hat KEINE Regel, die null in eine Zahl wandelt. null ist nur zu null/undefined lose gleich.",
		source: "type-coercion-quiz K9",
	},
	{
		id: "q48",
		category: "==",
		code: "null >= 0",
		answer: "true",
		explanation: "Relationaloperatoren (>=) konvertieren anders als ==: null -> 0. Da 0 < 0 falsch ist, ist >= true. Beruechtigter Widerspruch zu null == 0 (false).",
		source: "bfe-js K4",
	},

	// ---------------------------------------------------------------- React: was zeigt die UI? (output)
	{
		id: "q49",
		category: "react-state",
		type: "output",
		code: "const [items, setItems] = useState([1, 2, 3]);\nfunction add() {\n  items.push(4);      // mutiert dasselbe Array\n  setItems(items);    // gleiche Referenz!\n}",
		prompt: "Was zeigt die Anzeige nach einem Klick auf add()?",
		options: [
			{ id: "a", label: "1, 2, 3" },
			{ id: "b", label: "1, 2, 3, 4" },
			{ id: "c", label: "Fehler" },
			{ id: "d", label: "leer" },
		],
		answer: "a",
		explanation: "push mutiert das Array, die Referenz bleibt gleich. Object.is(prev, next) ist true -> React bailt aus, kein Re-Render. Loesung: setItems([...items, 4]).",
		source: "sudheer-react-exercises K2",
	},
	{
		id: "q50",
		category: "react-ref",
		type: "output",
		code: "const ref = useRef(0);\nfunction onClick() {\n  ref.current = ref.current + 1;\n}\n// <span>Count: {ref.current}</span>",
		prompt: "Was zeigt das <span> nach 3 Klicks?",
		options: [
			{ id: "a", label: "Count: 0" },
			{ id: "b", label: "Count: 3" },
			{ id: "c", label: "Count: 1" },
			{ id: "d", label: "Fehler" },
		],
		answer: "a",
		explanation: "Eine Ref-Mutation loest KEIN Re-Render aus. ref.current ist intern 3, aber die Komponente rendert nie neu -> die Anzeige bleibt bei 0.",
		source: "sudheer-react-exercises K7/K8",
	},
	{
		id: "q51",
		category: "react-deps",
		code: "useEffect(() => { setCount(1); });      // KEIN Dependency-Array\nuseEffect(() => { setCount(2); }, []);",
		prompt: "Was passiert nach dem Mounten?",
		options: TFED,
		answer: "error",
		explanation: "Der erste Effekt hat kein Dependency-Array -> laeuft nach JEDEM Render. setCount loest ein Re-Render aus, das den Effekt erneut triggert -> Endlosschleife: 'Maximum update depth exceeded'.",
		source: "sudheer-react-exercises K3",
	},

	// ---------------------------------------------------------------- React: Effekt-Reihenfolge (order)
	{
		id: "q52",
		category: "react-effects",
		type: "order",
		code: "function Child() {\n  console.log('Child render');\n  useEffect(() => {\n    console.log('Child effect');\n    return () => console.log('Child cleanup');\n  });\n  return null;\n}\nfunction Parent() {\n  console.log('Parent render');\n  useEffect(() => {\n    console.log('Parent effect');\n    return () => console.log('Parent cleanup');\n  });\n  return <Child />;\n}\n// Parent mounten, dann unmounten",
		prompt: "In welcher Reihenfolge wird geloggt (Mount, dann Unmount)?",
		options: [
			{
				id: "a",
				label: "Parent render → Child render → Child effect → Parent effect → Parent cleanup → Child cleanup",
				mono: true,
			},
			{
				id: "b",
				label: "Parent render → Child render → Parent effect → Child effect → Parent cleanup → Child cleanup",
				mono: true,
			},
			{
				id: "c",
				label: "Parent render → Parent effect → Child render → Child effect → Child cleanup → Parent cleanup",
				mono: true,
			},
		],
		answer: "a",
		explanation: "Render top-down (Parent vor Child), Effekte aber bottom-up (Child effect vor Parent effect) — ein Parent-Effekt darf sich auf die Effekte seiner Kinder verlassen. Unmount-Cleanups laufen top-down (Parent vor Child).",
		source: "bfe-react K24",
	},
	{
		id: "q53",
		category: "react-effects",
		type: "order",
		code: "function Counter({ count }) {\n  console.log('render ' + count);\n  useEffect(() => {\n    console.log('effect ' + count);\n    return () => console.log('cleanup ' + count);\n  }, []);   // leeres Dependency-Array\n  return null;\n}\n// count geht 0 -> 1, danach Unmount",
		prompt: "In welcher Reihenfolge wird geloggt?",
		options: [
			{ id: "a", label: "render 0 → effect 0 → render 1 → cleanup 0", mono: true },
			{
				id: "b",
				label: "render 0 → effect 0 → render 1 → cleanup 0 → effect 1",
				mono: true,
			},
			{
				id: "c",
				label: "render 0 → effect 0 → cleanup 0 → render 1 → effect 1",
				mono: true,
			},
		],
		answer: "a",
		explanation: "[] heisst 'keine Abhaengigkeiten': der Effekt laeuft nur EINMAL (effect 0), beim zweiten Render (render 1) NICHT erneut. Die Cleanup laeuft erst beim Unmount und kennt per Closure noch den alten Wert -> cleanup 0 (Stale Closure).",
		source: "bfe-react K21",
	},
];

// Spielreihenfolge je Tag (Difficulty-Ramp). IDs hier umsortieren/entfernen.
// Eine ID in keinem Ramp taucht im Quiz nicht auf, bleibt aber in `questions`.

// Tag 1 — JavaScript: Equality & Coercion (reines JS)
const RAMP_JS: string[] = [
	// Warm-up — Strict Equality & typeof (leicht)
	"q01",
	"q02",
	"q03",
	"q04",
	"q05",
	"q06",
	"q27",
	"q28",
	// == Coercion: Grundlagen (mittel)
	"q07",
	"q08",
	"q09",
	"q10",
	"q11",
	// == Coercion: Arrays & die fiesen Faelle (mittel-schwer)
	"q12",
	"q13",
	"q14",
	"q15",
	"q16",
	"q47",
	"q48",
	// Was kommt RAUS? Output-Coercion (mittel-schwer)
	"q35",
	"q36",
	"q37",
	"q38",
	"q39",
	"q40",
	"q41",
	"q42",
	"q43",
	// ++ und NaN (output)
	"q44",
	"q45",
	"q46",
	// Object.is & Referenzidentitaet — Schlusspunkt & Bruecke zu Tag 2 (mittel)
	"q17",
	"q18",
	"q19",
	"q20",
	"q21",
	"q22",
	"q23",
	"q24",
	"q25",
	"q26",
];

// Tag 2 — React: Referenzen & Effekte
const RAMP_REACT: string[] = [
	// State, Refs & Re-Render (mittel)
	"q29",
	"q30",
	"q49",
	"q50",
	// Dependencies, Memo, Context (mittel-schwer)
	"q31",
	"q32",
	"q33",
	"q34",
	"q51",
	// Effekt-Reihenfolge (am haertesten)
	"q52",
	"q53",
];

const _byId: Record<string, Question> = Object.fromEntries(questionPool.map((q) => [q.id, q]));
const pick = (ramp: string[]): Question[] => ramp.map((id) => _byId[id]).filter((q): q is Question => Boolean(q));

// Fragen je Session, exakt in Ramp-Reihenfolge.
export const jsQuestions: Question[] = pick(RAMP_JS);
export const reactQuestions: Question[] = pick(RAMP_REACT);

// Alle Fragen fuer Lookups/Auswertung (Tag 1, dann Tag 2, dann evtl. Reste).
const _used = new Set([...RAMP_JS, ...RAMP_REACT]);
const _leftovers = questionPool.filter((q) => !_used.has(q.id));
export const questions = [...jsQuestions, ...reactQuestions, ..._leftovers];
