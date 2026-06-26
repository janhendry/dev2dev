# Dev2Dev Quiz — JS Equality & React

Kleine, stylische Quiz-App für die Dev-to-Dev-Session.
Antworten werden zentral und anonym gesammelt und lassen sich später auswerten.

## Setup

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Startet Vite (http://localhost:5173) **und** den API-Server (Port 3001) parallel.
Vite reicht `/api`-Requests an den Server durch.

## Session-Betrieb (mehrere Leute, eine URL)

```bash
npm run build      # baut das Frontend nach dist/
npm run server     # Express liefert dist/ + API auf Port 3001
```

Teile dann `http://<deine-LAN-IP>:3001` mit der Gruppe (alle im selben Netz).

## Auswertung

```bash
npm run eval       # lesbare Auswertung im Terminal
```

Oder roh als JSON: `GET http://localhost:3001/api/results`.

Alle Antworten liegen als NDJSON in `server/data/submissions.ndjson`
(eine Zeile pro Durchlauf). Diese Datei ist in `.gitignore`.

## Fragen anpassen

Alle Fragen stehen in [`src/questions.js`](src/questions.js), aufgeteilt in zwei
Sessions (Tag 1 / Tag 2). Nicht gewünschte Fragen einfach auskommentieren oder die
ID aus dem jeweiligen Ramp (`RAMP_JS` / `RAMP_REACT`) entfernen. `id`-Werte stabil
lassen (sie werden gespeichert). `category` dient dem Filtern in der Auswertung.

## Review-Modus (Fragen prüfen)

Zum Korrekturlesen der Fragen lässt sich pro Frage die richtige Antwort (grün
markiert) plus Erklärung und Quelle sofort einblenden — gesteuert per Env-Variable
`VITE_REVIEW`:

```bash
VITE_REVIEW=1 npm run dev        # Review-Modus an
```

Alternativ dauerhaft in einer `.env.local` (von Git ignoriert): `VITE_REVIEW=1`.
**Nicht** beim echten Durchlauf mit Teilnehmern aktivieren — dann sieht jeder direkt
die Lösung. Ohne die Variable (Default) verhält sich das Quiz normal.
