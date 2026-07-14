import { useHotkey } from "@tanstack/react-hotkeys";
import { toBlob } from "html-to-image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "./components/canvas";
import { CommandPalette } from "./components/command-palette";
import { EditorTabBar } from "./components/editor-tabs";
import type { ExportFormat } from "./components/format-picker";
import type { FrameColors } from "./components/frame";
import {
	type CornerRadii,
	FONTS,
	type FontId,
	Inspector,
} from "./components/inspector";
import { StatusBar } from "./components/status-bar";
import { useToast } from "./components/toast-provider";
import { buildCommands } from "./lib/commands";
import { captureDataUrl } from "./lib/export";
import { useHaptics } from "./lib/haptics";
import {
	type LanguageId,
	loadCustomTheme,
	THEME_FRAME_COLORS,
	THEME_NAME,
} from "./lib/highlighter";
import type { Background } from "./lib/types";

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
	const [language, setLanguage] = useState<LanguageId>("mjs");
	const [fileName, setFileName] = useState("yumma.config.mjs");
	const [format, setFormat] = useState<ExportFormat>("png");
	const [exporting, setExporting] = useState(false);
	const [showTabBar, setShowTabBar] = useState(true);
	const [showStatusBar, setShowStatusBar] = useState(false);
	const [background, setBackground] = useState<Background>("stripes");
	const [showGridLines, setShowGridLines] = useState(true);
	const [showBoundingBox, setShowBoundingBox] = useState(true);
	const [showActiveTabBorder, setShowActiveTabBorder] = useState(true);
	const [radii, setRadii] = useState<CornerRadii>({
		tl: 0,
		tr: 0,
		bl: 0,
		br: 0,
	});
	const [font, setFont] = useState<FontId>("default");
	const [themeName, setThemeName] = useState(THEME_NAME);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [frameColors, setFrameColors] = useState<FrameColors>(
		THEME_FRAME_COLORS[THEME_NAME],
	);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const frameRef = useRef<HTMLDivElement>(null);
	const { trigger: haptic } = useHaptics();
	const toast = useToast();

	// biome-ignore lint/correctness/useExhaustiveDependencies: fire on dims change
	useEffect(() => {
		if (dimensions.width > 0 || dimensions.height > 0) {
			haptic("success");
		}
	}, [dimensions.width, dimensions.height]);

	async function handleUploadTheme(file: File) {
		try {
			const result = await loadCustomTheme(await file.text());
			setThemeName(result.name);
			setFrameColors(result.frameColors);
			toast.add({ title: "Theme loaded", description: result.name });
		} catch (_error) {
			toast.add({
				title: "Invalid theme",
				description:
					"Could not parse the uploaded file as a VS Code color theme.",
				type: "error",
			});
		}
	}

	function handleThemeChange(name: string) {
		setThemeName(name);
		const colors = THEME_FRAME_COLORS[name];
		if (colors) setFrameColors(colors);
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
			toast.add({ title: "Exported" });
		} finally {
			setExporting(false);
		}
	}

	async function handleCopyImage() {
		if (!frameRef.current) return;
		const blob = await toBlob(frameRef.current, { pixelRatio: 2 });
		if (!blob) return;
		await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
		toast.add({ title: "Copied", description: "Image copied to clipboard" });
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
		showGridLines,
		onShowGridLinesChange: (value) => setShowGridLines(value),
		background,
		onBackgroundChange: setBackground,
		onSetLanguage: setLanguage,
		onSetFormat: setFormat,
		onSetFont: setFont,
		onCopyCode: () => {
			navigator.clipboard.writeText(code);
			toast.add({ title: "Copied" });
		},
		onExport: handleExport,
		onCopyImage: handleCopyImage,
	});

	return (
		<div className="d-f fd-c min-h-vh bg-page">
			<EditorTabBar
				fileName={fileName}
				onOpenPalette={() => setPaletteOpen(true)}
				onCopy={handleCopyImage}
				onExport={handleExport}
				exporting={exporting}
				format={format}
				onFormatChange={setFormat}
			/>

			<div className="f-1 d-f">
				<Canvas
					code={code}
					onCodeChange={setCode}
					language={language}
					fileName={fileName}
					onFileNameChange={setFileName}
					showTabBar={showTabBar}
					showStatusBar={showStatusBar}
					showGridLines={showGridLines}
					showActiveTabBorder={showActiveTabBorder}
					background={background}
					radii={radii}
					font={FONTS[font].stack}
					themeName={themeName}
					colors={frameColors}
					showBoundingBox={showBoundingBox}
					frameRef={frameRef}
				/>

				<Inspector
					showTabBar={showTabBar}
					onShowTabBarChange={setShowTabBar}
					showStatusBar={showStatusBar}
					onShowStatusBarChange={setShowStatusBar}
					showGridLines={showGridLines}
					onShowGridLinesChange={setShowGridLines}
					showBoundingBox={showBoundingBox}
					onShowBoundingBoxChange={setShowBoundingBox}
					showActiveTabBorder={showActiveTabBorder}
					onShowActiveTabBorderChange={setShowActiveTabBorder}
					background={background}
					onBackgroundChange={setBackground}
					radii={radii}
					onRadiiChange={setRadii}
					font={font}
					onFontChange={setFont}
					themeName={themeName}
					onThemeChange={handleThemeChange}
					frameColors={frameColors}
					onFrameColorsChange={setFrameColors}
					onUploadTheme={handleUploadTheme}
				/>
			</div>

			<StatusBar
				language={language}
				onLanguageChange={setLanguage}
				background={background}
				onBackgroundChange={setBackground}
				themeName={themeName}
				onThemeChange={handleThemeChange}
				width={dimensions.width}
				height={dimensions.height}
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
