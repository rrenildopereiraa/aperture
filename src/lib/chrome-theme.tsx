import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export type ChromeMode = "light" | "dark";

export interface ChromeColors {
	page: string;
	surface: string;
	border: string;
	accent: string;
	accentDim: string;
	// Text color placed on top of an accent-colored background/hover state -
	// needs to flip independently of `page`/`accent` since Eclipsa's accent
	// is a light periwinkle, not a dark saturated blue like the light theme's.
	onAccent: string;
	diffAdd: string;
}

const LIGHT_CHROME_COLORS: ChromeColors = {
	page: "#ffffff",
	surface: "#f1f5f9",
	border: "#cbd5e1",
	accent: "#2563eb",
	accentDim: "#64748b",
	onAccent: "#ffffff",
	diffAdd: "#86efac",
};

// Same palette as the Eclipsa code-frame theme.
const DARK_CHROME_COLORS: ChromeColors = {
	page: "#21243f",
	surface: "#1e2039",
	border: "#31365e",
	accent: "#bec6f2",
	accentDim: "#b9bed5",
	onAccent: "#21243f",
	diffAdd: "#86efac",
};

export const CHROME_COLORS: Record<ChromeMode, ChromeColors> = {
	light: LIGHT_CHROME_COLORS,
	dark: DARK_CHROME_COLORS,
};

const STORAGE_KEY = "prisharp-chrome-mode";

function readStoredMode(): ChromeMode {
	if (typeof window === "undefined") return "dark";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return stored === "light" ? "light" : "dark";
}

const ChromeThemeContext = createContext<{
	mode: ChromeMode;
	colors: ChromeColors;
	toggle: () => void;
} | null>(null);

export function useChromeTheme() {
	const ctx = useContext(ChromeThemeContext);
	if (!ctx) {
		throw new Error("useChromeTheme must be used within ChromeThemeProvider");
	}
	return ctx;
}

// The Yumma CSS `h:` hover-variant classes bake in the light theme's colors, so a
// hover state in dark mode would show the wrong (light) tint - track hover
// as JS state instead so hover colors can come from the current theme too.
export function useHover() {
	const [hovered, setHovered] = useState(false);
	return {
		hovered,
		hoverHandlers: {
			onMouseEnter: () => setHovered(true),
			onMouseLeave: () => setHovered(false),
		},
	};
}

export function ChromeThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<ChromeMode>(readStoredMode);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, mode);
	}, [mode]);

	const toggle = () =>
		setMode((current) => (current === "light" ? "dark" : "light"));

	return (
		<ChromeThemeContext.Provider
			value={{ mode, colors: CHROME_COLORS[mode], toggle }}
		>
			{children}
		</ChromeThemeContext.Provider>
	);
}
