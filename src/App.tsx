import { useHotkey } from "@tanstack/react-hotkeys";
import { toBlob, toCanvas, toJpeg, toPng, toSvg } from "html-to-image";
import { useLayoutEffect, useRef, useState } from "react";
import { type Command, CommandPalette } from "./components/CommandPalette";
import type { ExportFormat } from "./components/FormatPicker";
import { Frame } from "./components/Frame";
import {
	type CornerRadii,
	FONTS,
	type FontId,
	Inspector,
} from "./components/Inspector";
import { StatusBar } from "./components/StatusBar";
import type { Background } from "./components/Toolbar";
import { Toolbar } from "./components/Toolbar";
import {
	LANGUAGES,
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

async function captureDataUrl(
	node: HTMLElement,
	format: ExportFormat,
): Promise<string> {
	switch (format) {
		case "svg":
			return toSvg(node);
		case "webp": {
			const canvas = await toCanvas(node, { pixelRatio: 2 });
			return canvas.toDataURL("image/webp");
		}
		case "jpg":
			return toJpeg(node, { pixelRatio: 2, quality: 0.95 });
		default:
			return toPng(node, { pixelRatio: 2 });
	}
}

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
			// Not a valid VS Code theme - leave the current theme untouched.
			console.error("Theme upload failed:", error);
		}
	}

	// Live px dimensions for the status bar - measured directly on every
	// size-affecting state change, with a ResizeObserver on top for changes
	// that don't go through React state (font loading, window resize).
	// biome-ignore lint/correctness/useExhaustiveDependencies: deps are size triggers, not read values
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

	// Palette-safe bindings only: Ctrl+T/N/W are browser-reserved and
	// plain Ctrl+C must keep copying selected text.
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

	const commands: Command[] = [
		{ id: "export", label: "Export image", kbd: "Ctrl S", run: handleExport },
		{
			id: "copy-image",
			label: "Copy image to clipboard",
			kbd: "Ctrl Shift C",
			run: handleCopyImage,
		},
		{
			id: "copy-code",
			label: "Copy code to clipboard",
			run: () => navigator.clipboard.writeText(code),
		},
		{
			id: "toggle-tab-bar",
			label: `${showTabBar ? "Hide" : "Show"} tab bar`,
			run: () => setShowTabBar((value) => !value),
		},
		{
			id: "toggle-status-bar",
			label: `${showStatusBar ? "Hide" : "Show"} status bar`,
			run: () => setShowStatusBar((value) => !value),
		},
		{
			id: "toggle-background",
			label: `Background: switch to ${background === "stripes" ? "solid" : "stripes"}`,
			kbd: "Ctrl B",
			run: () =>
				setBackground((current) =>
					current === "stripes" ? "solid" : "stripes",
				),
		},
		{
			id: "toggle-hashtag-lines",
			label: `${showHashtagLines ? "Hide" : "Show"} hashtag lines`,
			run: () => setShowHashtagLines((value) => !value),
		},
		...(Object.keys(FONTS) as FontId[]).map(
			(id): Command => ({
				id: `font-${id}`,
				label: `Set font: ${FONTS[id].label}`,
				run: () => setFont(id),
			}),
		),
		...(Object.entries(LANGUAGES) as [LanguageId, string][]).map(
			([id, label]): Command => ({
				id: `language-${id}`,
				label: `Set language: ${label}`,
				run: () => setLanguage(id),
			}),
		),
		...(["png", "jpg", "webp", "svg"] as ExportFormat[]).map(
			(id): Command => ({
				id: `format-${id}`,
				label: `Set format: ${id.toUpperCase()}`,
				run: () => setFormat(id),
			}),
		),
	];

	return (
		<div className="d-f fd-c min-h-vh bg-page">
			<StatusBar
				onOpenPalette={() => setPaletteOpen(true)}
				width={dimensions.width}
				height={dimensions.height}
			/>

			<div className="h-px bg-border" />

			<div className="f-1 d-f">
				{/*
					No overflow clamping - long wrapped content grows the frame
					taller and the page scrolls to show it, ray.so style.
				*/}
				<main className="f-1 d-f ai-c jc-c p-r px-4 @sm:px-8 py-8 @sm:py-24">
					{/*
						Selection chrome wraps the frame but lives OUTSIDE the
						exported node (frameRef points at <Frame> itself), so the
						outline and handles never appear in the downloaded image.
					*/}
					<div className="p-r min-w-0">
						<Frame
							ref={frameRef}
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
						/>

						<div
							className="p-a i--2 bw-1 bs-s bc-accent pe-none"
							aria-hidden="true"
						/>

						<div
							className="p-a t--3 l--3 w-2 h-2 bg-page bw-1 bs-s bc-accent pe-none"
							aria-hidden="true"
						/>
						<div
							className="p-a t--3 r--3 w-2 h-2 bg-page bw-1 bs-s bc-accent pe-none"
							aria-hidden="true"
						/>
						<div
							className="p-a b--3 l--3 w-2 h-2 bg-page bw-1 bs-s bc-accent pe-none"
							aria-hidden="true"
						/>
						<div
							className="p-a b--3 r--3 w-2 h-2 bg-page bw-1 bs-s bc-accent pe-none"
							aria-hidden="true"
						/>
					</div>
				</main>

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
