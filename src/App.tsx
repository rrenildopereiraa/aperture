import { useHotkey } from "@tanstack/react-hotkeys";
import { toBlob } from "html-to-image";
import { useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "./components/canvas";
import { CommandPalette } from "./components/command-palette";
import type { ExportFormat } from "./components/format-picker";
import {
	type CornerRadii,
	FONTS,
	type FontId,
	Inspector,
} from "./components/inspector";
import { StatusBar } from "./components/status-bar";
import type { Background } from "./components/toolbar";
import { Toolbar } from "./components/toolbar";
import { buildCommands } from "./lib/commands";
import { captureDataUrl } from "./lib/export";
import {
	type LanguageId,
	loadCustomTheme,
	THEME_NAME,
} from "./lib/highlighter";

const defaultCode = `import { defineConfig } from "yummacss";

export default defineConfig({
	theme: {
		colors: {
			accent: "#bec6f2",
			code: "#dda2f6",
		},
	},
});
`;

function App() {
	const [code, setCode] = useState(defaultCode);
	const [language, setLanguage] = useState<LanguageId>("typescript");
	const [fileName, setFileName] = useState("yumma.config.mjs");
	const [format, setFormat] = useState<ExportFormat>("png");
	const [exporting, setExporting] = useState(false);
	const [showTabBar, setShowTabBar] = useState(true);
	const [showStatusBar, setShowStatusBar] = useState(true);
	const [background, setBackground] = useState<Background>("stripes");
	const [showHashtagLines, setShowHashtagLines] = useState(true);
	const [radii, setRadii] = useState<CornerRadii>({
		tl: 0,
		tr: 0,
		bl: 0,
		br: 0,
	});
	const [font, setFont] = useState<FontId>("default");
	const [themeName, setThemeName] = useState(THEME_NAME);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const frameRef = useRef<HTMLDivElement>(null);

	async function handleUploadTheme(file: File) {
		try {
			const name = await loadCustomTheme(await file.text());
			setThemeName(name);
		} catch (error) {
			console.error("Theme upload failed:", error);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: deps are size triggers
	useLayoutEffect(() => {
		const node = frameRef.current;
		if (!node) return;

		function measure(target: Element) {
			const rect = target.getBoundingClientRect();
			setDimensions((current) => {
				const width = Math.round(rect.width);
				const height = Math.round(rect.height);
				if (current.width === width && current.height === height)
					return current;
				return { width, height };
			});
		}

		measure(node);
		const observer = new ResizeObserver(([entry]) => measure(entry.target));
		observer.observe(node);
		return () => observer.disconnect();
	}, [code, fileName, language, showTabBar, showStatusBar, font]);

	async function handleExport() {
		if (!frameRef.current || exporting) return;
		setExporting(true);
		try {
			const dataUrl = await captureDataUrl(frameRef.current, format);
			const link = document.createElement("a");
			link.download = `${fileName || "aperture"}.${format}`;
			link.href = dataUrl;
			link.click();
		} finally {
			setExporting(false);
		}
	}

	async function handleCopyImage() {
		if (!frameRef.current) return;
		const blob = await toBlob(frameRef.current, { pixelRatio: 2 });
		if (!blob) return;
		await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
	}

	useHotkey("Mod+K", (event) => {
		event.preventDefault();
		setPaletteOpen((open) => !open);
	});
	useHotkey("Mod+S", (event) => {
		event.preventDefault();
		handleExport();
	});
	useHotkey("Mod+Shift+C", (event) => {
		event.preventDefault();
		handleCopyImage();
	});
	useHotkey("Mod+B", (event) => {
		event.preventDefault();
		setBackground((current) => (current === "stripes" ? "solid" : "stripes"));
	});

	const commands = buildCommands({
		showTabBar,
		onShowTabBarChange: (value) => setShowTabBar(value),
		showStatusBar,
		onShowStatusBarChange: (value) => setShowStatusBar(value),
		showHashtagLines,
		onShowHashtagLinesChange: (value) => setShowHashtagLines(value),
		background,
		onBackgroundChange: setBackground,
		onSetLanguage: setLanguage,
		onSetFormat: setFormat,
		onSetFont: setFont,
		onCopyCode: () => navigator.clipboard.writeText(code),
		onExport: handleExport,
		onCopyImage: handleCopyImage,
	});

	return (
		<div className="d-f fd-c min-h-vh bg-page">
			<StatusBar
				onOpenPalette={() => setPaletteOpen(true)}
				width={dimensions.width}
				height={dimensions.height}
			/>

			<div className="h-px bg-border" />

			<div className="f-1 d-f">
				<Canvas
					code={code}
					onCodeChange={setCode}
					language={language}
					fileName={fileName}
					onFileNameChange={setFileName}
					showTabBar={showTabBar}
					showStatusBar={showStatusBar}
					showHashtagLines={showHashtagLines}
					background={background}
					radii={radii}
					font={FONTS[font].stack}
					themeName={themeName}
					frameRef={frameRef}
				/>

				<Inspector
					showTabBar={showTabBar}
					onShowTabBarChange={setShowTabBar}
					showStatusBar={showStatusBar}
					onShowStatusBarChange={setShowStatusBar}
					showHashtagLines={showHashtagLines}
					onShowHashtagLinesChange={setShowHashtagLines}
					background={background}
					onBackgroundChange={setBackground}
					radii={radii}
					onRadiiChange={setRadii}
					font={font}
					onFontChange={setFont}
					themeName={themeName}
					onUploadTheme={handleUploadTheme}
				/>
			</div>

			<Toolbar
				language={language}
				onLanguageChange={setLanguage}
				format={format}
				onFormatChange={setFormat}
				exporting={exporting}
				onCopy={() => navigator.clipboard.writeText(code)}
				onExport={handleExport}
			/>

			<CommandPalette
				open={paletteOpen}
				onOpenChange={setPaletteOpen}
				commands={commands}
			/>
		</div>
	);
}

export default App;
