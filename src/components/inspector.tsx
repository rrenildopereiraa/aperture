import { Button } from "@base-ui/react/button";
import { Separator } from "@base-ui/react/separator";
import { Switch } from "@base-ui/react/switch";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import { useHaptics } from "../lib/haptics";
import { THEMES } from "../lib/highlighter";
import type { BackgroundPattern, CornerRadii } from "../lib/types";
import { ColorInput } from "./color-input";
import type { FrameColors } from "./frame";
import { PickerField } from "./picker-field";
import { RadiusControl } from "./radius-control";

export type { CornerRadii };

const PATTERN_LABELS: Record<BackgroundPattern, string> = {
	"stripes-right": "Stripes Right",
	"stripes-left": "Stripes Left",
};

export type FontId =
	| "default"
	| "jetbrains-mono"
	| "fira-code"
	| "ibm-plex-mono";

export const FONTS: Record<FontId, { label: string; stack?: string }> = {
	default: { label: "Default" },
	"jetbrains-mono": {
		label: "JetBrains Mono",
		stack: '"JetBrains Mono", monospace',
	},
	"fira-code": { label: "Fira Code", stack: '"Fira Code", monospace' },
	"ibm-plex-mono": {
		label: "IBM Plex Mono",
		stack: '"IBM Plex Mono", monospace',
	},
};

const FRAME_COLOR_FIELDS: { key: keyof FrameColors; label: string }[] = [
	{ key: "page", label: "Page" },
	{ key: "surface", label: "Surface" },
	{ key: "border", label: "Border" },
	{ key: "accentDim", label: "Text" },
	{ key: "tabBar", label: "Tab" },
	{ key: "tabActive", label: "Tab active" },
	{ key: "statusBarBg", label: "Status bar" },
	{ key: "statusBarText", label: "Status bar text" },
];

function SectionSeparator({ label }: { label: string }) {
	return (
		<div className="d-f ai-c g-2 pb-2">
			<Separator orientation="horizontal" className="w-3 h-px bg-border" />
			<span className="fs-xs ff-m c-accent-dim us-none ws-nw">{label}</span>
			<Separator orientation="horizontal" className="f-1 h-px bg-border" />
		</div>
	);
}

function OptionSwitch({
	label,
	checked,
	onCheckedChange,
}: {
	label: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
}) {
	const { trigger: haptic } = useHaptics();

	return (
		<div className="d-f ai-c jc-sb g-2 px-2 pb-3">
			<span className="fs-sm ff-m c-accent-dim us-none">{label}</span>
			<Switch.Root
				checked={checked}
				onCheckedChange={(value) => {
					onCheckedChange(value);
					haptic("success");
				}}
				className={`p-r d-f ai-c h-5 w-9 m-0 px-1 bw-1 bs-s c-p fv:os-s fv:oo-2 fv:oc-accent ${
					checked ? "bg-accent bc-accent" : "bg-page bc-border"
				}`}
			>
				<Switch.Thumb
					className={`w-4 h-3 bs-o-xs ${checked ? "bg-page ml-3" : "bg-accent-dim ml-0"}`}
				/>
			</Switch.Root>
		</div>
	);
}

export function Inspector({
	showTabBar,
	onShowTabBarChange,
	showStatusBar,
	onShowStatusBarChange,
	showBackgroundPattern,
	onShowBackgroundPatternChange,
	showGridLines,
	onShowGridLinesChange,
	showBoundingBox,
	onShowBoundingBoxChange,
	showActiveTabBorder,
	onShowActiveTabBorderChange,
	background,
	onBackgroundChange,
	radii,
	onRadiiChange,
	font,
	onFontChange,
	themeName,
	onThemeChange,
	frameColors,
	onFrameColorsChange,
	onUploadTheme,
}: {
	showTabBar: boolean;
	onShowTabBarChange: (value: boolean) => void;
	showStatusBar: boolean;
	onShowStatusBarChange: (value: boolean) => void;
	showBackgroundPattern: boolean;
	onShowBackgroundPatternChange: (value: boolean) => void;
	showGridLines: boolean;
	onShowGridLinesChange: (value: boolean) => void;
	showBoundingBox: boolean;
	onShowBoundingBoxChange: (value: boolean) => void;
	showActiveTabBorder: boolean;
	onShowActiveTabBorderChange: (value: boolean) => void;
	background: BackgroundPattern;
	onBackgroundChange: (value: BackgroundPattern) => void;
	radii: CornerRadii;
	onRadiiChange: (value: CornerRadii) => void;
	font: FontId;
	onFontChange: (value: FontId) => void;
	themeName: string;
	onThemeChange: (value: string) => void;
	frameColors: FrameColors;
	onFrameColorsChange: (value: FrameColors) => void;
	onUploadTheme: (file: File) => void;
}) {
	const { trigger: haptic } = useHaptics();

	return (
		<aside className="d-none @lg:d-f fd-c w-72 fs-0 min-h-0 oy-auto blw-1 bs-s bc-border bg-surface p-3">
			<SectionSeparator label="Frame" />

			<OptionSwitch
				label="Tab bar"
				checked={showTabBar}
				onCheckedChange={onShowTabBarChange}
			/>
			<OptionSwitch
				label="Bounding box"
				checked={showBoundingBox}
				onCheckedChange={onShowBoundingBoxChange}
			/>
			<OptionSwitch
				label="Status bar"
				checked={showStatusBar}
				onCheckedChange={onShowStatusBarChange}
			/>

			<RadiusControl radii={radii} onRadiiChange={onRadiiChange} />

			<OptionSwitch
				label="Tab border"
				checked={showActiveTabBorder}
				onCheckedChange={onShowActiveTabBorderChange}
			/>
			{showActiveTabBorder && (
				<ColorInput
					label="Color"
					value={frameColors.activeTabBorder}
					onChange={(activeTabBorder) =>
						onFrameColorsChange({ ...frameColors, activeTabBorder })
					}
				/>
			)}

			<PickerField
				label="Font"
				value={font}
				options={(Object.keys(FONTS) as FontId[]).map((id) => ({
					id,
					label: FONTS[id].label,
					style: FONTS[id].stack ? { fontFamily: FONTS[id].stack } : undefined,
				}))}
				onValueChange={onFontChange}
			/>

			<SectionSeparator label="Background" />

			<OptionSwitch
				label="Grid lines"
				checked={showGridLines}
				onCheckedChange={onShowGridLinesChange}
			/>

			<OptionSwitch
				label="Background patterns"
				checked={showBackgroundPattern}
				onCheckedChange={onShowBackgroundPatternChange}
			/>

			{showBackgroundPattern && (
				<PickerField
					value={background}
					options={(Object.keys(PATTERN_LABELS) as BackgroundPattern[]).map(
						(id) => ({ id, label: PATTERN_LABELS[id] }),
					)}
					onValueChange={onBackgroundChange}
				/>
			)}

			<SectionSeparator label="Appearance" />

			<PickerField
				label="Theme"
				value={themeName}
				options={Object.keys(THEMES).map((id) => ({ id, label: id }))}
				onValueChange={onThemeChange}
			/>

			<div className="px-2 pb-4">
				<Button
					onClick={() => {
						const input = document.createElement("input");
						input.type = "file";
						input.accept = ".json";
						input.onchange = () => {
							const file = input.files?.[0];
							if (file) {
								onUploadTheme(file);
								haptic("success");
							}
						};
						input.click();
					}}
					className="d-f ai-c jc-c g-2 w-100% px-2 py-2 bw-1 bs-d bc-border bg-transparent c-accent-dim fs-xs ff-m us-none c-p h:c-accent h:bc-accent fv:os-s fv:oo-2 fv:oc-accent"
				>
					<UploadSimpleIcon size={14} weight="fill" />
					Import VS Code theme
				</Button>
			</div>

			{FRAME_COLOR_FIELDS.map(({ key, label }) => (
				<ColorInput
					key={key}
					label={label}
					value={frameColors[key]}
					onChange={(value) =>
						onFrameColorsChange({ ...frameColors, [key]: value })
					}
				/>
			))}
		</aside>
	);
}
