# syntax=docker/dockerfile:1

# --- Build-Stage: Frontend mit Vite bauen ----------------------------------
# Braucht die devDependencies (vite, plugin-react, typescript) und den
# kompletten Quellbaum. Das Ergebnis ist allein der dist/-Ordner.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Runtime-Stage: nur Express-Server + gebautes Frontend -----------------
# Schlank: nur Produktions-Abhaengigkeiten (express), kein Build-Tooling.
FROM node:22-slim AS runtime
ENV NODE_ENV=production
# Type-Stripping ist experimentell und gibt sonst bei jedem Start eine
# ExperimentalWarning auf stderr aus -> gezielt stummschalten.
ENV NODE_OPTIONS=--disable-warning=ExperimentalWarning
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Server-Code (TypeScript) und das in der Build-Stage erzeugte dist/ uebernehmen.
# Node strippt die Typen zur Laufzeit (--experimental-strip-types), daher kein
# Compile-Schritt und kein tsx im Runtime-Image noetig.
COPY server ./server
COPY --from=build /app/dist ./dist

# Datenverzeichnis anlegen und Besitz an den unprivilegierten node-User geben.
# server/index.ts schreibt Submissions nach server/data/ -> als Volume mounten.
RUN mkdir -p server/data && chown -R node:node /app
USER node

EXPOSE 3001
CMD ["node", "--experimental-strip-types", "server/index.ts"]
