import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Im Dev-Modus laeuft Vite (5173) parallel zum Express-Server (3001).
// Alle /api-Requests werden an den Express-Server weitergereicht.
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://localhost:3001",
		},
	},
	build: {
		outDir: "dist",
	},
});
