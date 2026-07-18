import { useHotkey } from "@tanstack/react-hotkeys";
import { toBlob } from "html-to-image";
import { useQueryStates } from "nuqs";
import { useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "./components/canvas";
import { CommandPalette } from "./components/command-palette";
import { EditorTabBar } from "./components/editor-tabs";
import type { ExportFormat } from "./components/format-picker";
import {
	FONT_FAMILIES,
	type FontFamilyId,
	Inspector,
} from "./components/inspector";
import { RADIUS_MAX, RADIUS_MIN } from "./components/radius-control";
import { StatusBar } from "./components/status-bar";
import { useToast } from "./components/toast-provider";
import { buildCommands } from "./lib/commands";
import { captureDataUrl } from "./lib/export";
import { loadCustomTheme, THEME_FRAME_COLORS } from "./lib/highlighter";
import { randomSnippet } from "./lib/snippets";
import {
	type BackgroundPattern,
	type CanvasMode,
	type CornerRadii,
	type EditorDocument,
	MAX_DOCUMENTS,
} from "./lib/types";
import { settingsParsers } from "./lib/url-state";

function App() {
	const [documents, setDocuments] = useState<EditorDocument[]>(() => {
		const snippet = randomSnippet();
		return [
			{
				id: crypto.randomUUID(),
				fileName: snippet.fileName,
				code: snippet.code,
				language: snippet.language,
			},
		];
	});
	const [activeId, setActiveId] = useState(() => documents[0].id);
	const [mode, setMode] = useState<CanvasMode>("static");
	const [format, setFormat] = useState<ExportFormat>("png");
	const [exporting, setExporting] = useState(false);
	const [showBoundingBox, setShowBoundingBox] = useState(true);
	const [themeIsRandom, setThemeIsRandom] = useState(false);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [settings, setSettings] = useQueryStates(settingsParsers, {
		history: "replace",
	});
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const frameRef = useRef<HTMLDivElement>(null);
	const toast = useToast();

	const active = documents.find((doc) => doc.id === activeId) ?? documents[0];

	const radii: CornerRadii = {
		tl: settings.rtl,
		tr: settings.rtr,
		bl: settings.rbl,
		br: settings.rbr,
	};

	function setRadii(next: CornerRadii) {
		setSettings({ rtl: next.tl, rtr: next.tr, rbl: next.bl, rbr: next.br });
	}

	function updateActive(patch: Partial<EditorDocument>) {
		setDocuments((docs) =>
			docs.map((doc) => (doc.id === activeId ? { ...doc, ...patch } : doc)),
		);
	}

	function addDocument() {
		if (documents.length >= MAX_DOCUMENTS) {
			toast.add({
				title: "Snippet limit reached",
				description: `You can have up to ${MAX_DOCUMENTS} snippets.`,
				type: "error",
			});
			return;
		}
		const snippet = randomSnippet();
		const doc: EditorDocument = {
			id: crypto.randomUUID(),
			fileName: snippet.fileName,
			code: snippet.code,
			language: snippet.language,
		};
		setDocuments((docs) =>
			docs.length >= MAX_DOCUMENTS ? docs : [...docs, doc],
		);
		setActiveId(doc.id);
	}

	function closeDocument(id: string) {
		if (documents.length <= 1) return;
		const index = documents.findIndex((doc) => doc.id === id);
		const remaining = documents.filter((doc) => doc.id !== id);
		setDocuments(remaining);
		if (id === activeId) {
			setActiveId(remaining[Math.min(index, remaining.length - 1)].id);
		}
	}

	function selectDocument(id: string) {
		setActiveId(id);
	}

	async function handleUploadTheme(file: File) {
		try {
			const result = await loadCustomTheme(await file.text());
			setSettings({ theme: result.name, colors: result.frameColors });
			setThemeIsRandom(false);
			toast.add({
				title: "Theme loaded",
				description: result.name,
				type: "success",
			});
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
		const colors = THEME_FRAME_COLORS[name];
		setSettings({ theme: name, ...(colors ? { colors } : {}) });
	}

	function handleManualThemeChange(name: string) {
		handleThemeChange(name);
		setThemeIsRandom(false);
	}

	function randomizeAll() {
		const randomBool = () => Math.random() < 0.5;
		const fontFamilyIds = Object.keys(FONT_FAMILIES) as FontFamilyId[];
		const patterns: BackgroundPattern[] = ["stripes-right", "stripes-left"];
		const radius =
			RADIUS_MIN + Math.floor(Math.random() * (RADIUS_MAX - RADIUS_MIN + 1));

		// Colors are randomized by picking among the curated themes rather
		// than generating independent random hex values per token - arbitrary
		// colors have no contrast or taste guarantees, real themes do.
		const themeNames = Object.keys(THEME_FRAME_COLORS);
		const themePool = themeNames.filter((name) => name !== settings.theme);
		const pool = themePool.length > 0 ? themePool : themeNames;
		const nextTheme = pool[Math.floor(Math.random() * pool.length)];

		setSettings({
			tabBar: randomBool(),
			gridLines: randomBool(),
			bgPattern: randomBool(),
			pattern: patterns[Math.floor(Math.random() * patterns.length)],
			rtl: radius,
			rtr: radius,
			rbl: radius,
			rbr: radius,
			tabBorder: randomBool(),
			font: fontFamilyIds[Math.floor(Math.random() * fontFamilyIds.length)],
			theme: nextTheme,
			colors: THEME_FRAME_COLORS[nextTheme],
		});
		setThemeIsRandom(true);
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
	}, [
		active.code,
		active.fileName,
		active.language,
		settings.tabBar,
		settings.statusBar,
		settings.font,
	]);

	async function handleExport() {
		if (!frameRef.current || exporting) return;
		setExporting(true);
		try {
			const dataUrl = await captureDataUrl(frameRef.current, format);
			const link = document.createElement("a");
			link.download = `${active.fileName || "prisharp"}.${format}`;
			link.href = dataUrl;
			link.click();
			toast.add({ title: "Exported", type: "success" });
		} finally {
			setExporting(false);
		}
	}

	async function handleCopyImage() {
		if (!frameRef.current) return;
		const blob = await toBlob(frameRef.current, { pixelRatio: 2 });
		if (!blob) return;
		await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
		toast.add({
			title: "Copied",
			description: "Image copied to clipboard",
			type: "success",
		});
	}

	async function handleShare() {
		await navigator.clipboard.writeText(window.location.href);
		toast.add({
			title: "Link copied",
			description: "Anyone with this link sees the same settings",
			type: "success",
		});
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
		setSettings((current) => ({ bgPattern: !current.bgPattern }));
	});
	useHotkey("Mod+Shift+R", (event) => {
		event.preventDefault();
		randomizeAll();
	});

	const commands = buildCommands({
		showTabBar: settings.tabBar,
		onShowTabBarChange: (value) => setSettings({ tabBar: value }),
		showStatusBar: settings.statusBar,
		onShowStatusBarChange: (value) => setSettings({ statusBar: value }),
		showBackgroundPattern: settings.bgPattern,
		onShowBackgroundPatternChange: (value) => setSettings({ bgPattern: value }),
		showGridLines: settings.gridLines,
		onShowGridLinesChange: (value) => setSettings({ gridLines: value }),
		onBackgroundChange: (value) => setSettings({ pattern: value }),
		onSetLanguage: (value) => updateActive({ language: value }),
		onSetFormat: setFormat,
		onSetFontFamily: (value) => setSettings({ font: value }),
		onCopyCode: () => {
			navigator.clipboard.writeText(active.code);
			toast.add({ title: "Copied" });
		},
		onExport: handleExport,
		onCopyImage: handleCopyImage,
		onNewDocument: addDocument,
		onCloseDocument: () => closeDocument(activeId),
		onRandomizeAll: randomizeAll,
	});

	return (
		<div className="d-f fd-c h-vh o-h bg-page">
			<EditorTabBar
				documents={documents}
				activeId={activeId}
				onSelect={selectDocument}
				onClose={closeDocument}
				onAdd={addDocument}
				onOpenPalette={() => setPaletteOpen(true)}
				onCopy={handleCopyImage}
				onExport={handleExport}
				onShare={handleShare}
				exporting={exporting}
				format={format}
				onFormatChange={setFormat}
			/>

			<div className="f-1 d-f min-h-0">
				<Canvas
					code={active.code}
					onCodeChange={(value) => updateActive({ code: value })}
					language={active.language}
					fileName={active.fileName}
					onFileNameChange={(value) => updateActive({ fileName: value })}
					showTabBar={settings.tabBar}
					showStatusBar={settings.statusBar}
					showGridLines={settings.gridLines}
					showBackgroundPattern={settings.bgPattern}
					showActiveTabBorder={settings.tabBorder}
					background={settings.pattern}
					radii={radii}
					fontFamily={FONT_FAMILIES[settings.font].stack}
					themeName={settings.theme}
					colors={settings.colors}
					showBoundingBox={showBoundingBox}
					frameRef={frameRef}
					mode={mode}
				/>

				<Inspector
					mode={mode}
					onModeChange={setMode}
					showTabBar={settings.tabBar}
					onShowTabBarChange={(value) => setSettings({ tabBar: value })}
					showStatusBar={settings.statusBar}
					onShowStatusBarChange={(value) => setSettings({ statusBar: value })}
					showGridLines={settings.gridLines}
					onShowGridLinesChange={(value) => setSettings({ gridLines: value })}
					showBackgroundPattern={settings.bgPattern}
					onShowBackgroundPatternChange={(value) =>
						setSettings({ bgPattern: value })
					}
					showBoundingBox={showBoundingBox}
					onShowBoundingBoxChange={setShowBoundingBox}
					showActiveTabBorder={settings.tabBorder}
					onShowActiveTabBorderChange={(value) =>
						setSettings({ tabBorder: value })
					}
					background={settings.pattern}
					onBackgroundChange={(value) => setSettings({ pattern: value })}
					radii={radii}
					onRadiiChange={setRadii}
					fontFamily={settings.font}
					onFontFamilyChange={(value) => setSettings({ font: value })}
					themeName={settings.theme}
					onThemeChange={handleManualThemeChange}
					themeIsRandom={themeIsRandom}
					frameColors={settings.colors}
					onFrameColorsChange={(value) => setSettings({ colors: value })}
					onUploadTheme={handleUploadTheme}
				/>
			</div>

			<StatusBar
				language={active.language}
				onLanguageChange={(value) => updateActive({ language: value })}
				background={settings.pattern}
				onBackgroundChange={(value) => setSettings({ pattern: value })}
				themeName={settings.theme}
				onThemeChange={handleManualThemeChange}
				themeIsRandom={themeIsRandom}
				onRandomize={randomizeAll}
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
