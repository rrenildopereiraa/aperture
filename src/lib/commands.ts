import type { ExportFormat } from "../components/format-picker";
import { FONTS, type FontId } from "../components/inspector";
import type { Background } from "../components/toolbar";
import { LANGUAGES, type LanguageId } from "./highlighter";

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
	showHashtagLines,
	onShowHashtagLinesChange,
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
	showHashtagLines: boolean;
	onShowHashtagLinesChange: (value: boolean) => void;
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
		{ id: "export", label: "Export image", kbd: "Ctrl S", run: onExport },
		{
			id: "copy-image",
			label: "Copy image to clipboard",
			kbd: "Ctrl Shift C",
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
			kbd: "Ctrl B",
			run: () =>
				onBackgroundChange(background === "stripes" ? "solid" : "stripes"),
		},
		{
			id: "toggle-hashtag-lines",
			label: `${showHashtagLines ? "Hide" : "Show"} hashtag lines`,
			run: () => onShowHashtagLinesChange(!showHashtagLines),
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
