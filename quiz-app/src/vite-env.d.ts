/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_REVIEW?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
