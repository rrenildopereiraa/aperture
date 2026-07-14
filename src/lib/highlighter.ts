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
import type { FrameColors } from "../components/frame";
import amber from "../themes/amber-theme.json";
import defaultTheme from "../themes/default-theme.json";
import eclipsa from "../themes/eclipsa-theme.json";
import monochrome from "../themes/monochrome-theme.json";

export const LANGUAGES = {
	html: "HTML",
	javascript: "JavaScript",
	mjs: "MJS",
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

export const THEME_NAME = defaultTheme.name;

const BUILTIN_THEMES = [
	defaultTheme,
	eclipsa,
	monochrome,
	amber,
] as ThemeInput[];

export const THEMES = {
	[THEME_NAME]: defaultTheme.name,
	[eclipsa.name]: eclipsa.name,
	[monochrome.name]: monochrome.name,
	[amber.name]: amber.name,
} as const;

export type ThemeId = keyof typeof THEMES;

export function readThemeFrameColors(theme: {
	name: string;
	colors?: Record<string, string | null>;
	frameColors?: Partial<FrameColors>;
}): FrameColors {
	const c = theme.colors ?? {};
	const f = theme.frameColors ?? {};

	return {
		page: getColor(c, "editor.background") ?? f.page ?? "#151724",
		surface: getColor(c, "sideBar.background") ?? f.surface ?? "#1a1d2e",
		border: getColor(c, "editorGroupHeader.border") ?? f.border ?? "#232741",
		accentDim: getColor(c, "editor.foreground") ?? f.accentDim ?? "#9aa5ef",
		tabBar: getColor(c, "tab.inactiveBackground") ?? f.tabBar ?? "#151724",
		tabActive: getColor(c, "tab.activeBackground") ?? f.tabActive ?? "#1a1d2e",
		statusBarBg:
			getColor(c, "statusBar.background") ?? f.statusBarBg ?? "#2d3151",
		activeTabBorder:
			getColor(c, "tab.activeBorder") ?? f.activeTabBorder ?? "#00000000",
	};
}

function getColor(
	colors: Record<string, string | null>,
	key: string,
): string | undefined {
	const value = colors[key];
	if (value != null && value !== "#00000000" && value.length >= 7) return value;
	return undefined;
}

export const THEME_FRAME_COLORS: Record<string, FrameColors> = {
	[defaultTheme.name]: {
		page: "#ffffff",
		surface: "#f1f5f9",
		border: "#cbd5e1",
		accentDim: "#64748b",
		tabBar: "#f1f5f9",
		tabActive: "#ffffff",
		statusBarBg: "#f1f5f9",
		activeTabBorder: "#2563eb",
	},
	[eclipsa.name]: readThemeFrameColors(
		eclipsa as unknown as {
			name: string;
			colors?: Record<string, string | null>;
			frameColors?: Partial<FrameColors>;
		},
	),
	[monochrome.name]: readThemeFrameColors(
		monochrome as unknown as {
			name: string;
			colors?: Record<string, string | null>;
			frameColors?: Partial<FrameColors>;
		},
	),
	[amber.name]: readThemeFrameColors(
		amber as unknown as {
			name: string;
			colors?: Record<string, string | null>;
			frameColors?: Partial<FrameColors>;
		},
	),
};

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: BUILTIN_THEMES,
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
 * highlighter and return its name and extracted frame colors.
 */
export async function loadCustomTheme(text: string): Promise<{
	name: string;
	frameColors: FrameColors;
}> {
	const theme = JSON.parse(stripJsonComments(text)) as {
		name?: string;
		tokenColors?: unknown;
		colors?: Record<string, string | null>;
		frameColors?: Partial<FrameColors>;
	};
	if (!theme.tokenColors) {
		throw new Error("Not a VS Code color theme (missing tokenColors)");
	}
	theme.name = theme.name || "Custom";
	const highlighter = await getHighlighter();
	await highlighter.loadTheme(theme as unknown as ThemeInput);
	return {
		name: theme.name,
		frameColors: readThemeFrameColors(
			theme as {
				name: string;
				colors?: Record<string, string | null>;
				frameColors?: Partial<FrameColors>;
			},
		),
	};
}
