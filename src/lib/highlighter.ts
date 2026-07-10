import {
	createHighlighterCore,
	type HighlighterCore,
	type ThemeInput,
} from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";

import astro from "@shikijs/langs/astro";
import css from "@shikijs/langs/css";
import html from "@shikijs/langs/html";
import javascript from "@shikijs/langs/javascript";
import jsx from "@shikijs/langs/jsx";
import markdown from "@shikijs/langs/markdown";
import mdx from "@shikijs/langs/mdx";
import php from "@shikijs/langs/php";
import scss from "@shikijs/langs/scss";
import svelte from "@shikijs/langs/svelte";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import vue from "@shikijs/langs/vue";

import eclipsa from "../themes/eclipsa-theme.json";

export const LANGUAGES = {
	html: "HTML",
	javascript: "JavaScript",
	jsx: "JSX",
	typescript: "TypeScript",
	tsx: "TSX",
	astro: "Astro",
	vue: "Vue",
	svelte: "Svelte",
	markdown: "Markdown",
	mdx: "MDX",
	css: "CSS",
	scss: "SCSS",
	php: "PHP",
} as const;

export type LanguageId = keyof typeof LANGUAGES;

export const THEME_NAME = eclipsa.name;

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [eclipsa as unknown as ThemeInput],
			langs: [
				astro,
				css,
				html,
				javascript,
				jsx,
				markdown,
				mdx,
				php,
				scss,
				svelte,
				tsx,
				typescript,
				vue,
			],
			engine: createJavaScriptRegexEngine(),
		});
	}
	return highlighterPromise;
}

// VS Code theme files are JSONC - strip // and /* */ comments (outside
// strings) and trailing commas so JSON.parse accepts them.
function stripJsonComments(text: string): string {
	let result = "";
	let inString = false;
	let inLineComment = false;
	let inBlockComment = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const next = text[i + 1];

		if (inLineComment) {
			if (char === "\n") {
				inLineComment = false;
				result += char;
			}
			continue;
		}
		if (inBlockComment) {
			if (char === "*" && next === "/") {
				inBlockComment = false;
				i++;
			}
			continue;
		}
		if (inString) {
			result += char;
			if (char === "\\") {
				result += next ?? "";
				i++;
			} else if (char === '"') {
				inString = false;
			}
			continue;
		}
		if (char === '"') {
			inString = true;
			result += char;
			continue;
		}
		if (char === "/" && next === "/") {
			inLineComment = true;
			i++;
			continue;
		}
		if (char === "/" && next === "*") {
			inBlockComment = true;
			i++;
			continue;
		}
		result += char;
	}

	// Trailing commas before } or ]
	return result.replace(/,(\s*[}\]])/g, "$1");
}

/**
 * Register a user-uploaded VS Code theme (JSON or JSONC) with the
 * highlighter and return its name for use with codeToTokens.
 */
export async function loadCustomTheme(text: string): Promise<string> {
	const theme = JSON.parse(stripJsonComments(text)) as {
		name?: string;
		tokenColors?: unknown;
	};
	if (!theme.tokenColors) {
		throw new Error("Not a VS Code color theme (missing tokenColors)");
	}
	theme.name = theme.name || "Custom";
	const highlighter = await getHighlighter();
	await highlighter.loadTheme(theme as unknown as ThemeInput);
	return theme.name;
}
