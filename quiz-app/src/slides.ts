// Vortrags-Slides fuer den Praesentationsteil nach dem Quiz. Block-Typen siehe
// Type `Block` in types.ts. Schema-Slides (Teil 3) gibt es in zwei Varianten
// (reduced/full), per Toggle umschaltbar; Slides ohne `variant` erscheinen immer.
// Gruppiert in zwei Decks (Export unten): coercionDeck und reactDeck.

import type { Deck, Slide } from "./types.ts";

const coercionSlides: Slide[] = [
	// ===================================================== Teil 1 — Was ist Coercion?
	{
		id: "s-title",
		kind: "title",
		blocks: [
			{ t: "h", text: "Type Coercion" },
			{ t: "sub", text: "Warum kam beim Quiz sowas raus?" },
			{
				t: "code",
				code: "[] == false        // true\nnull == undefined  // true\n[] == ![]          // true\ntrue + true        // 2\n+[]                // 0\nNaN === NaN        // false",
			},
			{
				t: "p",
				text: "Sieht aus wie Zufall. Im Quiz hast du geraten — jetzt das System dahinter.",
			},
		],
	},
	{
		id: "s-coercion-def",
		blocks: [
			{ t: "h", text: "Coercion = Typ-Umwandlung" },
			{
				t: "list",
				items: ["Bei vielen Operationen passt JS die Typen *automatisch* an", "Genau dieses Anpassen nennt man **Coercion**"],
			},
			{ t: "code", code: '"5" * 2\n→ "5" wird zur Zahl 5\n→ 5 * 2\n→ 10' },
		],
	},
	{
		id: "s-types",
		blocks: [
			{ t: "h", text: "Erst die Bausteine: Primitive vs. Objekte" },
			{
				t: "p",
				text: "Coercion wandelt zwischen Typen um — also kurz, welche es überhaupt gibt:",
			},
			{
				t: "sub",
				text: "Primitive (7) — der Wert selbst",
			},
			{
				t: "list",
				items: ["`string` · `number` · `boolean`", "`null` · `undefined`", "`symbol` · `bigint`"],
			},
			{
				t: "sub",
				text: "Objekte — alles andere",
			},
			{
				t: "list",
				items: ["`{}` Objekt · `[]` Array", "`function` …"],
			},
			{
				t: "callout",
				tone: "accent",
				text: "Merksatz: Primitive vergleicht JS nach *Wert*, Objekte nach *Referenz*.",
			},
		],
	},
	{
		id: "s-object",
		blocks: [
			{ t: "h", text: "Ein Objekt: Schlüssel → Werte" },
			{
				t: "code",
				code: 'const auto = {\n  marke: "VW",          // Property → String\n  baujahr: 2020,        // Property → Number\n  fahren() { … },       // Property → Funktion\n};',
			},
			{
				t: "callout",
				tone: "accent",
				text: "Ein Property-Wert kann *alles* sein — Number, String, wieder ein Objekt, oder eine Funktion.",
			},
		],
	},
	{
		id: "s-classes",
		blocks: [
			{ t: "h", text: "Und Klassen? Auch nur Objekte" },
			{
				t: "p",
				text: "Eine `class` ist kein eigener Typ — nur schönere Syntax für eine Konstruktor-Funktion:",
			},
			{
				t: "code",
				code: 'class Auto {}\n\n// entspricht im Kern einer Konstruktor-Funktion:\nfunction Auto() {}\n\ntypeof Auto        // "function"  ← die Klasse selbst\ntypeof new Auto()  // "object"    ← die Instanz',
			},
		],
	},
	{
		id: "s-explicit",
		blocks: [
			{ t: "h", text: "Explizit vs. implizit" },
			{
				t: "table",
				head: ["Explizit (du sagst es)", "Implizit (JS macht es)"],
				rows: [
					['`Number("5")`', '`"5" * 1`'],
					["`String(5)`", '`5 + ""`'],
					["`Boolean(0)`", "`if (0) …`"],
				],
			},
			{
				t: "p",
				text: "Coercion = die *implizite* Umwandlung. Sie passiert staendig unsichtbar.",
			},
		],
	},
	{
		id: "s-three",
		blocks: [
			{ t: "h", text: "Der Operator bestimmt das Ziel" },
			{
				t: "table",
				head: ["Kontext / Operator", "→ Ziel"],
				rows: [
					["`+` mit *einem* String", "→ `String`"],
					["`-` `*` `/` `%`, Vergleiche `< >`, unäres `+`", "→ `Number`"],
					["`if` `while` `? :`, `!` `&&` `||`", "→ `Boolean`"],
				],
			},
			{
				t: "callout",
				tone: "accent",
				text: 'Derselbe Wert, anderes Ziel:  `"5" + 1` → `"51"`  (String),  `"5" - 1` → `4`  (Number). Der Operator gibt die Richtung vor.',
			},
		],
	},
	{
		id: "s-many-ex",
		blocks: [
			{ t: "h", text: "Jetzt viele Beispiele" },
			{ t: "p", text: "Lies jeweils: welcher Operator → welches Ziel?" },
			{
				t: "code",
				code: '// → String   (+ mit einem String)\n1 + "2"          // "12"\n"" + null        // "null"\n"Age: " + 30     // "Age: 30"\n[1, 2] + ""      // "1,2"',
			},
			{
				t: "reveal",
				inner: {
					t: "code",
					code: '// → Number   (- * / Vergleiche)\n"5" * "2"        // 10\n"10" - 5         // 5\ntrue + 1         // 2\nnull + 1         // 1     (null → 0)\n"3" > 2          // true  (Vergleich)',
				},
			},
			{
				t: "reveal",
				inner: {
					t: "code",
					code: '// → Boolean   (if, !, &&)\n!!"hallo"        // true\n!!0              // false\n!!""             // false\n[] ? "j" : "n"   // "j"   ([] ist truthy!)',
				},
			},
		],
	},
	{
		id: "s-q2",
		kind: "question",
		blocks: [
			{ t: "h", text: "`+` gegen `-`" },
			{ t: "code", code: '"5" + 1\n"5" - 1' },
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "accent",
					text: '`"5" + 1` → `"51"` (`+` zieht zu String). `"5" - 1` → `4` (`-` zwingt zu Number).',
				},
			},
			{
				t: "reveal",
				inner: {
					t: "p",
					text: "`+` ist speziell: sobald *ein* String beteiligt ist, wird konkateniert.",
				},
			},
		],
	},

	// ===================================================== Teil 2 — Ohne Coercion: === & Object.is
	{
		id: "s-strict",
		blocks: [
			{ t: "h", text: "`===` — der ehrliche" },
			{
				t: "p",
				text: "Macht *keine* Coercion. Unterschiedliche Typen? Sofort `false`.",
			},
			{
				t: "code",
				code: '1 === 1      // true\n1 === "1"    // false  (keine Umwandlung!)\nfalse === 0  // false',
			},
			{
				t: "callout",
				text: "Primitive: nach Wert. Objekte / Arrays / Funktionen: nach Referenz.",
			},
		],
	},
	{
		id: "s-objectis",
		blocks: [
			{ t: "h", text: "`Object.is` — fast wie `===`" },
			{
				t: "p",
				text: "Auch keine Coercion. Identisch zu `===` — bis auf zwei Faelle:",
			},
			{
				t: "code",
				code: "Object.is(NaN, NaN)  // true    (=== : false)\nObject.is(0, -0)     // false   (=== : true)",
			},
			{ t: "p", text: "Genau diesen Vergleich nutzt React konzeptionell." },
		],
	},
	{
		id: "s-compare",
		blocks: [
			{ t: "h", text: "Die drei im Überblick" },
			{
				t: "table",
				head: ["", "Typumwandlung?", "Bedeutung"],
				rows: [
					["`==`", "**ja**", "Vergleich *mit* Coercion"],
					["`===`", "nein", "gleicher Typ + Wert / Referenz"],
					["`Object.is`", "nein", "wie `===`, aber `NaN` & `-0`"],
				],
			},
			{
				t: "callout",
				tone: "accent",
				text: "Nur EINER macht Coercion: `==`. Dessen Regeln sind jetzt der Rest des Vortrags.",
			},
		],
	},
	{
		id: "s-q1",
		kind: "question",
		blocks: [
			{ t: "h", text: "Welcher macht Typumwandlung?" },
			{ t: "code", code: '1 == "1"\n1 === "1"\nObject.is(1, "1")' },
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "accent",
					text: "`==` → `true` (wandelt um). `===` und `Object.is` → `false`.",
				},
			},
		],
	},

	// ===================================================== Teil 3 — Schema
	// ---- ToBoolean ----
	{
		id: "s-bool-reduced",
		variant: "reduced",
		blocks: [
			{ t: "h", text: "ToBoolean" },
			{
				t: "falsy",
				falsy: ["false", "0", "-0", "0n", '""', "null", "undefined", "NaN"],
				truthyValues: ["[]", "{}", '"0"', '"false"', '" "'],
			},
		],
	},
	{
		id: "s-bool-full",
		variant: "full",
		blocks: [
			{ t: "h", text: "ToBoolean (Spec)" },
			{
				t: "falsy",
				falsy: ["false", "0", "-0", "0n", '""', "null", "undefined", "NaN"],
				truthy: "Genau diese 8 sind falsy. Sonst alles truthy — ohne Ausnahme.",
			},
			{
				t: "code",
				code: 'Boolean([])    // true   — leeres Array ist truthy!\nBoolean("0")   // true   — String "0" ist truthy\nBoolean(" ")   // true\nBoolean("")    // false',
			},
			{
				t: "p",
				text: "Historische Kuriositaet: `document.all` ist falsy. Im Alltag ignorierbar.",
			},
		],
	},
	// ---- ToNumber ----
	{
		id: "s-num-reduced",
		variant: "reduced",
		blocks: [
			{ t: "h", text: "ToNumber" },
			{
				t: "table",
				head: ["Wert", "→ Number"],
				rows: [
					["`undefined`", "`NaN`"],
					["`null`", "`0`"],
					["`true` / `false`", "`1` / `0`"],
					['`""` / `" "`', "`0`"],
					['`"42"`', "`42`"],
					['`"42px"`', "`NaN`"],
					["`[]`", "`0`"],
					["`[42]`", "`42`"],
					["`[1,2]` / `{}`", "`NaN`"],
				],
			},
		],
	},
	{
		id: "s-num-full",
		variant: "full",
		blocks: [
			{ t: "h", text: "ToNumber (Spec)" },
			{
				t: "table",
				head: ["Wert", "→ Number"],
				rows: [
					["`undefined`", "`NaN`"],
					["`null`", "`0`"],
					["`true` / `false`", "`1` / `0`"],
					['`""` / Whitespace', "`0`"],
					['`"0x1F"` / `"1e3"`', "`31` / `1000`"],
					["`[]` / `[42]`", "`0` / `42`"],
					["`[1,2]` / `{}`", "`NaN`"],
				],
			},
			{
				t: "p",
				text: "Objekt → erst `ToPrimitive(number)`: `valueOf()` zuerst, sonst `toString()`.",
			},
			{
				t: "callout",
				tone: "warn",
				text: '`Number` ≠ `parseInt`:  `Number("42px")` → `NaN`,  `parseInt("42px")` → `42`.',
			},
		],
	},
	// ---- ToString ----
	{
		id: "s-str-reduced",
		variant: "reduced",
		blocks: [
			{ t: "h", text: "ToString" },
			{
				t: "table",
				head: ["Wert", "→ String"],
				rows: [
					["`null` / `undefined`", '`"null"` / `"undefined"`'],
					["`42`", '`"42"`'],
					["`[]`", '`""`'],
					["`[1,2]`", '`"1,2"`'],
					["`{}`", '`"[object Object]"`'],
				],
			},
		],
	},
	{
		id: "s-str-full",
		variant: "full",
		blocks: [
			{ t: "h", text: "ToString (Spec)" },
			{
				t: "table",
				head: ["Wert", "→ String"],
				rows: [
					["`null` / `undefined`", '`"null"` / `"undefined"`'],
					["`[]` / `[1,2]`", '`""` / `"1,2"`'],
					["`[1,[2,3]]`", '`"1,2,3"`  (rekursiv)'],
					["`{}`", '`"[object Object]"`'],
					["`Symbol()`", "`TypeError`"],
				],
			},
			{
				t: "p",
				text: "Objekt → `ToPrimitive(string)`: `toString()` zuerst, sonst `valueOf()`.",
			},
		],
	},
	// ---- ToPrimitive ----
	{
		id: "s-prim-reduced",
		variant: "reduced",
		blocks: [
			{ t: "h", text: "Objekte → ToPrimitive" },
			{
				t: "p",
				text: "Bevor ein Objekt zu Number/String wird, wird es zu einem Primitiv:",
			},
			{
				t: "code",
				code: '[]     →  ""\n[1, 2] →  "1,2"\n{}     →  "[object Object]"',
			},
			{
				t: "p",
				text: "Deshalb verhalten sich `[]` und `[1,2]` in `==` so seltsam.",
			},
		],
	},
	{
		id: "s-prim-full",
		variant: "full",
		blocks: [
			{ t: "h", text: "Objekte → ToPrimitive (Spec)" },
			{
				t: "p",
				text: "`ToPrimitive(input, hint)` probiert `Symbol.toPrimitive`, sonst `valueOf`/`toString` je nach hint:",
			},
			{
				t: "table",
				head: ["hint", "Reihenfolge"],
				rows: [
					["`number`", "`valueOf` → `toString`"],
					["`string`", "`toString` → `valueOf`"],
					["`default`", "`valueOf` → `toString`"],
				],
			},
			{
				t: "p",
				text: "`==` nutzt hint `default`. Bei Arrays gibt `valueOf` das Array zurueck (kein Primitiv) → `toString` greift.",
			},
		],
	},
	// ---- ==-Flussdiagramm ----
	{
		id: "s-flow-reduced",
		variant: "reduced",
		blocks: [
			{ t: "h", text: "Das `==`-Flussdiagramm" },
			{
				t: "flow",
				steps: [
					{ cond: "gleicher Typ?", action: "wie `===`" },
					{ cond: "`null` == `undefined`?", action: "`true`" },
					{ cond: "Number vs String?", action: "String → Number" },
					{ cond: "Boolean dabei?", action: "Boolean → Number" },
					{ cond: "Objekt vs Primitiv?", action: "Objekt → ToPrimitive" },
					{ cond: "sonst", action: "`false`" },
				],
			},
		],
	},
	{
		id: "s-flow-full",
		variant: "full",
		blocks: [
			{ t: "h", text: "Das `==`-Flussdiagramm (Spec)" },
			{
				t: "flow",
				steps: [
					{ cond: "Typen gleich", action: "Strict Equality (`===`)" },
					{ cond: "`null` ↔ `undefined`", action: "`true`" },
					{ cond: "Number ↔ String", action: "String → Number" },
					{
						cond: "BigInt ↔ String",
						action: "String → BigInt (sonst `false`)",
					},
					{ cond: "Boolean ↔ irgendwas", action: "Boolean → Number, erneut" },
					{ cond: "Objekt ↔ Primitiv", action: "Objekt → ToPrimitive, erneut" },
					{ cond: "Number ↔ BigInt", action: "mathematisch vergleichen" },
					{ cond: "sonst", action: "`false`" },
				],
			},
		],
	},
	/* --- Ab Slide 19 (s-q3) bis Ende vorerst ausgeblendet: nicht mehr zeigen ---
	{
		id: "s-q3",
		kind: "question",
		blocks: [
			{ t: "h", text: "`[] == 0` — durchs Schema" },
			{ t: "p", text: "Welche Schritte laufen ab?" },
			{
				t: "reveal",
				inner: {
					t: "code",
					code: '[] == 0\n→ [] ist Objekt → ToPrimitive → ""\n→ "" == 0  → "" → Number → 0\n→ 0 == 0   → true',
				},
			},
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "accent",
					text: "Objekt → Primitiv → Number. Genau die Reihenfolge aus dem Diagramm.",
				},
			},
		],
	},

	// ===================================================== Teil 4 — Entzaubern
	{
		id: "s-demystify",
		blocks: [
			{ t: "h", text: "`[] == false`" },
			{ t: "code", code: "[] == false" },
			{
				t: "reveal",
				inner: { t: "p", text: "1.  Boolean dabei → `false` → `0`" },
			},
			{
				t: "reveal",
				inner: {
					t: "p",
					text: '2.  `[] == 0` → `[]` ist Objekt → ToPrimitive → `""`',
				},
			},
			{ t: "reveal", inner: { t: "p", text: '3.  `"" == 0` → `""` → `0`' } },
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "accent",
					text: "4.  `0 == 0` → **true** ✓",
				},
			},
		],
	},
	{
		id: "s-q4",
		kind: "question",
		blocks: [
			{ t: "h", text: "`[] == ![]`" },
			{ t: "p", text: "Tipp: was ist `![]` zuerst?" },
			{
				t: "reveal",
				inner: {
					t: "p",
					text: "`![]` → `[]` ist truthy → `!truthy` → `false`",
				},
			},
			{
				t: "reveal",
				inner: { t: "p", text: "Jetzt `[] == false` → (wie eben) → `true`" },
			},
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "warn",
					text: "Ein Array ist gleich seiner eigenen Negation. Willkommen bei `==`.",
				},
			},
		],
	},
	{
		id: "s-cheatsheet",
		blocks: [
			{ t: "h", text: "7 Merksätze" },
			{
				t: "list",
				items: [
					"**Im Code immer `===`** — `==` nur bewusst als `x == null` (fängt `null` + `undefined`).",
					"**`+` klebt, der Rest rechnet:** ein String bei `+` → konkateniert; `-` `*` `/` → zwingt zu Number.",
					'**8 falsy auswendig:** `false 0 -0 0n "" null undefined NaN`.',
					"**`[]` ist truthy**, aber `[] == false` ist `true`. Truthiness ≠ `==`-Coercion.",
					"**Objekt in `==`** wird erst zum Primitiv (`ToPrimitive`, meist `toString`).",
					"**`NaN` ist mit nichts gleich** — auch nicht mit sich selbst. Test: `Number.isNaN(x)`.",
					'**String → Zahl:** `Number("42px")` → `NaN`, aber `parseInt("42px")` → `42`.',
				],
			},
		],
	},
	{
		id: "s-close",
		kind: "title",
		blocks: [
			{ t: "h", text: "Kernsatz" },
			{
				t: "callout",
				tone: "accent",
				text: "`==` ist nicht zufaellig — es ist genau dieses Schema. Verstehen muss man es, sonst sind Bugs Magie.",
			},
			{ t: "sub", text: "Fragen?" },
		],
	},
	*/
];

// React-Deck: Effekte & Referenzen.
// Quelle: quellen/react-effects-handout.md (react.dev, CC-BY-4.0).
const reactSlides: Slide[] = [
	{
		id: "r-title",
		kind: "title",
		blocks: [
			{ t: "h", text: "React, Effekte & Referenzen" },
			{
				t: "sub",
				text: "Warum lief der Effect nochmal? Warum rendert nichts?",
			},
			{
				t: "code",
				code: "setItems(items)          // gleiche Referenz -> kein Re-Render\nuseEffect(fn, [{ status }]) // neues Objekt -> laeuft immer",
			},
			{
				t: "p",
				text: "Im Quiz sah das nach Magie aus. Es ist genau ein Vergleich: `Object.is`.",
			},
		],
	},
	{
		id: "r-objectis",
		blocks: [
			{ t: "h", text: "Eine Regel verbindet alles: `Object.is`" },
			{
				t: "p",
				text: "React vergleicht damit State, Props und jede Dependency mit dem alten Wert.",
			},
			{
				t: "table",
				head: ["Was", "Vergleich"],
				rows: [
					['Primitive (`5`, `"music"`)', "nach *Wert*"],
					["Objekt / Array / Funktion", "nach *Referenz* (Identitaet)"],
				],
			},
			{
				t: "callout",
				tone: "accent",
				text: "Gleicher Inhalt heisst NICHT gleiche Referenz. Genau hier kippen die Quizfragen.",
			},
		],
	},
	{
		id: "r-newref",
		blocks: [
			{ t: "h", text: "Jeder Render erzeugt NEUE Objekte" },
			{
				t: "p",
				text: "Ein Objekt/eine Funktion im Komponentenkörper entsteht bei *jedem* Render neu:",
			},
			{
				t: "code",
				code: "const a = { status: 'open' };\nconst b = { status: 'open' };\nObject.is(a, b);   // false — verschiedene Referenzen",
			},
			{
				t: "p",
				text: "Deshalb war `setFilter({ status })` im Quiz immer ein Update: neue Referenz.",
			},
		],
	},
	{
		id: "r-q1",
		kind: "question",
		blocks: [
			{ t: "h", text: "Re-Render oder nicht?" },
			{
				t: "code",
				code: "const [items, setItems] = useState([1, 2, 3]);\nitems.push(4);\nsetItems(items);",
			},
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "accent",
					text: "Kein Re-Render. `push` mutiert — gleiche Referenz -> `Object.is` true -> React bailt aus. Fix: `setItems([...items, 4])`.",
				},
			},
		],
	},
	{
		id: "r-lifecycle",
		blocks: [
			{ t: "h", text: "Ein Effekt hat zwei Phasen" },
			{
				t: "flow",
				steps: [
					{ cond: "Mount", action: "Setup laeuft (nach DOM-Update)" },
					{
						cond: "Dependency aendert sich",
						action: "Cleanup (alte Werte) → Setup (neue Werte)",
					},
					{ cond: "Unmount", action: "Cleanup ein letztes Mal" },
				],
			},
			{
				t: "callout",
				text: "Merksatz: Cleanup laeuft *vor* jedem neuen Setup — und einmal am Ende.",
			},
		],
	},
	{
		id: "r-deps",
		blocks: [
			{ t: "h", text: "Das Dependency-Array steuert *wann*" },
			{
				t: "table",
				head: ["Variante", "Laeuft …"],
				rows: [
					["kein Array", "nach *jedem* Render"],
					["`[]`", "*einmal* nach dem Mount"],
					["`[a, b]`", "wenn sich `a` *oder* `b` aendert"],
				],
			},
			{
				t: "callout",
				tone: "warn",
				text: "Der Linter erzwingt: *alle* benutzten reaktiven Werte (Props, State) gehoeren ins Array.",
			},
		],
	},
	{
		id: "r-coreproblem",
		blocks: [
			{ t: "h", text: "Objekt als Dependency = laeuft immer" },
			{
				t: "code",
				code: "function Page({ status }) {\n  const filter = { status };        // neu pro Render\n  useEffect(() => load(filter), [filter]); // -> jedes Mal\n}",
			},
			{
				t: "p",
				text: "`filter` ist pro Render eine neue Referenz -> `Object.is` false -> Effekt feuert. Oft eine Endlosschleife.",
			},
		],
	},
	{
		id: "r-fix",
		blocks: [
			{ t: "h", text: "Dependencies entfernen — 4 Wege" },
			{
				t: "list",
				items: ["**Rausziehen:** statische Werte aus der Komponente nach außen", "**Reinziehen:** Objekt *im* Effekt erzeugen -> nur Primitive bleiben", "**Updater-Form:** `setX(prev => …)` statt `x` als Dependency", "**`useMemo` / `useCallback`:** Referenz über Renders stabil halten"],
			},
			{
				t: "callout",
				tone: "accent",
				text: "Ziel: im Array bleiben nur stabile/primitive Werte. Bevorzugt 1–3 vor 4.",
			},
		],
	},
	{
		id: "r-order",
		blocks: [
			{ t: "h", text: "Reihenfolge: top-down rendern, bottom-up Effekte" },
			{
				t: "code",
				code: "Parent render\nChild render\nChild effect     // Effekte: von INNEN nach außen\nParent effect",
			},
			{
				t: "p",
				text: "Render läuft von oben nach unten, Effekte erst nach dem Commit — und von unten nach oben.",
			},
		],
	},
	{
		id: "r-q2",
		kind: "question",
		blocks: [
			{ t: "h", text: "`[]` + Cleanup: welcher Wert?" },
			{
				t: "code",
				code: "useEffect(() => {\n  return () => console.log(count); // count war beim Mount 0\n}, []);   // count ist inzwischen 5",
			},
			{
				t: "reveal",
				inner: {
					t: "callout",
					tone: "warn",
					text: "Loggt `0`. Die Cleanup hat per Closure den Mount-Wert eingefroren — die klassische *Stale Closure* bei `[]`.",
				},
			},
		],
	},
	{
		id: "r-strict",
		blocks: [
			{ t: "h", text: "Strict Mode: alles doppelt (nur Dev)" },
			{
				t: "p",
				text: "In Entwicklung läuft beim Mount `Setup → Cleanup → Setup`. Absicht, kein Bug.",
			},
			{
				t: "code",
				code: "connect()\ndisconnect()\nconnect()   // nur im Dev-StrictMode",
			},
			{
				t: "callout",
				text: "Nicht wegbiegen: wenn Cleanup korrekt ist, ist doppeltes Setup harmlos. In Produktion: einmal.",
			},
		],
	},
	{
		id: "r-close",
		kind: "title",
		blocks: [
			{ t: "h", text: "Merksatz" },
			{
				t: "callout",
				tone: "accent",
				text: "Alles dreht sich um *eine* Frage: gleiche Referenz oder neue?",
			},
			{
				t: "list",
				items: ["Neues Objekt/Funktion pro Render -> `Object.is` false -> gilt als geaendert", "State mutieren ohne neue Referenz -> kein Re-Render", "Cleanup vor jedem Setup — der Schlüssel zu Effekt-Reihenfolge"],
			},
			{ t: "sub", text: "Fragen?" },
		],
	},
];

// Decks fuer den Praesentations-Modus. SlideDeck.jsx rendert das aktive Deck.
export const decks: Deck[] = [
	{ id: "coercion", title: "Type Coercion", slides: coercionSlides },
	{ id: "react", title: "React & Effekte", slides: reactSlides },
];

// Rueckwaertskompatibel: Default-Deck als `slides` (Coercion).
export const slides = coercionSlides;
