import type { ExportFormat } from "../components/format-picker";
import { FONTS, type FontId } from "../components/inspector";
import { LANGUAGES, type LanguageId } from "./highlighter";
import { modLabel } from "./platform";
import type { BackgroundPattern } from "./types";

export interface Command {
	id: string;
	label: string;
	kbd?: string;
	run: () => void;
}

export function buildCommands({
	showTabBar,
	onShowTabBarChange,
	showStatusBar,
	onShowStatusBarChange,
	showBackgroundPattern,
	onShowBackgroundPatternChange,
	showGridLines,
	onShowGridLinesChange,
	onBackgroundChange,
	onSetLanguage,
	onSetFormat,
	onSetFont,
	onCopyCode,
	onExport,
	onCopyImage,
	onNewDocument,
	onCloseDocument,
	onRandomizeAll,
}: {
	showTabBar: boolean;
	onShowTabBarChange: (value: boolean) => void;
	showStatusBar: boolean;
	onShowStatusBarChange: (value: boolean) => void;
	showBackgroundPattern: boolean;
	onShowBackgroundPatternChange: (value: boolean) => void;
	showGridLines: boolean;
	onShowGridLinesChange: (value: boolean) => void;
	onBackgroundChange: (value: BackgroundPattern) => void;
	onSetLanguage: (value: LanguageId) => void;
	onSetFormat: (value: ExportFormat) => void;
	onSetFont: (value: FontId) => void;
	onCopyCode: () => void;
	onExport: () => void;
	onCopyImage: () => void;
	onNewDocument: () => void;
	onCloseDocument: () => void;
	onRandomizeAll: () => void;
}): Command[] {
	const BACKGROUND_PATTERNS: Record<BackgroundPattern, string> = {
		"stripes-right": "Stripes Right",
		"stripes-left": "Stripes Left",
	};

	return [
		{
			id: "new-snippet",
			label: "New snippet",
			run: onNewDocument,
		},
		{
			id: "close-snippet",
			label: "Close snippet",
			run: onCloseDocument,
		},
		{
			id: "randomize",
			label: "Randomize appearance",
			run: onRandomizeAll,
		},
		{
			id: "export",
			label: "Export image",
			kbd: `${modLabel} S`,
			run: onExport,
		},
		{
			id: "copy-image",
			label: "Copy image to clipboard",
			kbd: `${modLabel} Shift C`,
			run: onCopyImage,
		},
		{
			id: "copy-code",
			label: "Copy code to clipboard",
			run: onCopyCode,
		},
		{
			id: "toggle-tab-bar",
			label: `${showTabBar ? "Hide" : "Show"} tab bar`,
			run: () => onShowTabBarChange(!showTabBar),
		},
		{
			id: "toggle-status-bar",
			label: `${showStatusBar ? "Hide" : "Show"} status bar`,
			run: () => onShowStatusBarChange(!showStatusBar),
		},
		{
			id: "toggle-background-pattern",
			label: `${showBackgroundPattern ? "Hide" : "Show"} background pattern`,
			kbd: `${modLabel} B`,
			run: () => onShowBackgroundPatternChange(!showBackgroundPattern),
		},
		{
			id: "toggle-grid-lines",
			label: `${showGridLines ? "Hide" : "Show"} grid lines`,
			run: () => onShowGridLinesChange(!showGridLines),
		},
		{
			id: "set-background-stripes-right",
			label: `Background: Stripes Right`,
			run: () => onBackgroundChange("stripes-right"),
		},
		{
			id: "set-background-stripes-left",
			label: `Background: Stripes Left`,
			run: () => onBackgroundChange("stripes-left"),
		},
		...(Object.keys(BACKGROUND_PATTERNS) as BackgroundPattern[]).map(
			(id): Command => ({
				id: `background-${id}`,
				label: `Background: ${BACKGROUND_PATTERNS[id]}`,
				run: () => onBackgroundChange(id),
			}),
		),
		...(Object.keys(FONTS) as FontId[]).map(
			(id): Command => ({
				id: `font-${id}`,
				label: `Set font: ${FONTS[id].label}`,
				run: () => onSetFont(id),
			}),
		),
		...(Object.entries(LANGUAGES) as [LanguageId, string][]).map(
			([id, label]): Command => ({
				id: `language-${id}`,
				label: `Set language: ${label}`,
				run: () => onSetLanguage(id),
			}),
		),
		...(["png", "jpg", "webp", "svg"] as ExportFormat[]).map(
			(id): Command => ({
				id: `format-${id}`,
				label: `Set format: ${id.toUpperCase()}`,
				run: () => onSetFormat(id),
			}),
		),
	];
}
