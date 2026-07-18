import { defineConfig } from "yummacss";

export default defineConfig({
	source: ["./src/**/*.{ts,tsx}"],
	theme: {
		colors: {
			accent: "#2563eb",
			"accent-dim": "#64748b",
			border: "#cbd5e1",
			code: "#2563eb",
			page: "#ffffff",
			surface: "#f1f5f9",
			"diff-add": "#86efac",
			"diff-remove": "#fca5a5",
			warning: "#fcd34d",
		},
	},
});
