import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request, type Response } from "express";
import type { Answer } from "../src/types.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.ndjson");
const DIST_DIR = path.join(__dirname, "..", "dist");
const PORT = process.env.PORT || 3001;

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: "256kb" }));

// Durchlauf entgegennehmen: als eine NDJSON-Zeile anhaengen. appendFileSync
// (single-threaded Node) verhindert Race Conditions bei parallelen Teilnehmern.
app.post("/api/submit", (req: Request, res: Response) => {
	const { name, answers } = req.body ?? {};
	if (typeof name !== "string" || !name.trim() || !Array.isArray(answers)) {
		return res.status(400).json({ error: "name (string) und answers (array) erforderlich" });
	}

	const record = {
		name: name.trim().slice(0, 60),
		session: typeof req.body.session === "string" ? req.body.session.slice(0, 40) : null,
		startedAt: Number(req.body.startedAt) || null,
		finishedAt: Number(req.body.finishedAt) || Date.now(),
		receivedAt: Date.now(),
		answers: answers.map(
			(a): Answer => ({
				id: String(a.id),
				choice: String(a.choice),
				correct: Boolean(a.correct),
				ms: Number(a.ms) || 0,
			}),
		),
	};

	try {
		fs.appendFileSync(DATA_FILE, JSON.stringify(record) + "\n");
		res.status(201).json({ ok: true });
	} catch (err) {
		console.error("Speichern fehlgeschlagen:", err);
		res.status(500).json({ error: "Speichern fehlgeschlagen" });
	}
});

// Aggregat fuer schnelle Sichtpruefung.
interface StoredRun {
	name: string;
	answers: Answer[];
}

interface QuestionStat {
	id: string;
	total: number;
	correct: number;
	choices: Record<string, number>;
}

app.get("/api/results", (_req: Request, res: Response) => {
	const runs = readRuns();
	const perQuestion: Record<string, QuestionStat> = {};
	for (const run of runs) {
		for (const a of run.answers) {
			let q = perQuestion[a.id];
			if (!q) {
				q = { id: a.id, total: 0, correct: 0, choices: {} };
				perQuestion[a.id] = q;
			}
			q.total += 1;
			if (a.correct) q.correct += 1;
			q.choices[a.choice] = (q.choices[a.choice] || 0) + 1;
		}
	}
	res.json({
		runCount: runs.length,
		participants: runs.map((r) => ({
			name: r.name,
			score: r.answers.filter((a) => a.correct).length,
			total: r.answers.length,
		})),
		perQuestion: Object.values(perQuestion),
	});
});

function readRuns(): StoredRun[] {
	if (!fs.existsSync(DATA_FILE)) return [];
	return fs
		.readFileSync(DATA_FILE, "utf8")
		.split("\n")
		.filter(Boolean)
		.map((line) => {
			try {
				return JSON.parse(line) as StoredRun;
			} catch {
				return null;
			}
		})
		.filter((run): run is StoredRun => run !== null);
}

// Gebautes Frontend ausliefern (Produktion: eine URL fuer alles).
if (fs.existsSync(DIST_DIR)) {
	app.use(express.static(DIST_DIR));
	app.get("*", (_req: Request, res: Response) => res.sendFile(path.join(DIST_DIR, "index.html")));
}

app.listen(PORT, () => {
	console.log(`Quiz-Server laeuft auf http://localhost:${PORT}`);
	if (!fs.existsSync(DIST_DIR)) {
		console.log("(dist/ fehlt — im Dev-Modus liefert Vite das Frontend auf Port 5173.)");
	}
});
