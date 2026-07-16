import type { LanguageId } from "./highlighter";

export interface Snippet {
	fileName: string;
	language: LanguageId;
	code: string;
}

export const SNIPPETS: Snippet[] = [
	{
		fileName: "yumma.config.mjs",
		language: "mjs",
		code: `import { defineConfig } from "yummacss";

export default defineConfig({
	theme: {
		colors: {
			accent: "#bec6f2",
			code: "#dda2f6",
		},
	},
});
`,
	},
	{
		fileName: "debounce.ts",
		language: "typescript",
		code: `export function debounce<A extends unknown[]>(
	fn: (...args: A) => void,
	delay = 300,
) {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: A) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}
`,
	},
	{
		fileName: "useToggle.ts",
		language: "typescript",
		code: `import { useCallback, useState } from "react";

export function useToggle(initial = false) {
	const [on, setOn] = useState(initial);
	const toggle = useCallback(() => setOn((v) => !v), []);
	return [on, toggle] as const;
}
`,
	},
	{
		fileName: "Greeting.tsx",
		language: "tsx",
		code: `interface Props {
	name: string;
}

export function Greeting({ name }: Props) {
	return <h1 className="fs-5xl fw-100 ff-c lh-2">Hello, {name}!</h1>;
}
`,
	},
	{
		fileName: "shuffle.js",
		language: "javascript",
		code: `export function shuffle(items) {
	const arr = [...items];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
`,
	},
	{
		fileName: "index.css",
		language: "css",
		code: `@import "@fontsource/ia-writer-quattro";

@yummacss;

:root {
	color-scheme: light dark;
}`,
	},
];

export function randomSnippet(): Snippet {
	return SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
}
