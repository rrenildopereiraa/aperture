import type { ExportFormat } from "../components/format-picker";
import { FONTS, type FontId } from "../components/inspector";
import { LANGUAGES, type LanguageId } from "./highlighter";
import { modLabel } from "./platform";
import type { Background } from "./types";

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
	showGridLines,
	onShowGridLinesChange,
	background,
	onBackgroundChange,
	onSetLanguage,
	onSetFormat,
	onSetFont,
	onCopyCode,
	onExport,
	onCopyImage,
}: {
	showTabBar: boolean;
	onShowTabBarChange: (value: boolean) => void;
	showStatusBar: boolean;
	onShowStatusBarChange: (value: boolean) => void;
	showGridLines: boolean;
	onShowGridLinesChange: (value: boolean) => void;
	background: Background;
	onBackgroundChange: (value: Background) => void;
	onSetLanguage: (value: LanguageId) => void;
	onSetFormat: (value: ExportFormat) => void;
	onSetFont: (value: FontId) => void;
	onCopyCode: () => void;
	onExport: () => void;
	onCopyImage: () => void;
}): Command[] {
	return [
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
			id: "toggle-background",
			label: `Background: switch to ${background === "stripes" ? "solid" : "stripes"}`,
			kbd: `${modLabel} B`,
			run: () =>
				onBackgroundChange(background === "stripes" ? "solid" : "stripes"),
		},
		{
			id: "toggle-grid-lines",
			label: `${showGridLines ? "Hide" : "Show"} grid lines`,
			run: () => onShowGridLinesChange(!showGridLines),
		},
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
