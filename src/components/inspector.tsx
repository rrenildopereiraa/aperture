import { Button } from "@base-ui/react/button";
import { NumberField } from "@base-ui/react/number-field";
import { Separator } from "@base-ui/react/separator";
import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import type { RevealStyle } from "../lib/animated-export";
import { THEMES } from "../lib/highlighter";
import type { BackgroundPattern, CornerRadii } from "../lib/types";
import { BottomSheet } from "./bottom-sheet";
import { ColorInput } from "./color-input";
import type { ExportFormat } from "./format-picker";
import { isVideoFormat } from "./format-picker";
import type { FrameColors } from "./frame";
import { PickerField } from "./picker-field";
import { RadiusControl } from "./radius-control";

export type { CornerRadii };

const PATTERN_LABELS: Record<BackgroundPattern, string> = {
	"stripes-right": "Stripes Right",
	"stripes-left": "Stripes Left",
};

export type FontFamilyId =
	| "default"
	| "jetbrains-mono"
	| "fira-code"
	| "ibm-plex-mono";

export const FONT_FAMILIES: Record<
	FontFamilyId,
	{ label: string; stack?: string }
> = {
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
	{ key: "page", label: "Frame Background" },
	{ key: "surface", label: "Frame Surface" },
	{ key: "border", label: "Frame Border" },
	{ key: "accentDim", label: "Frame Text" },
	{ key: "tabBar", label: "Tab Bar" },
	{ key: "tabActive", label: "Active Tab" },
	{ key: "statusBarBg", label: "Status Bar" },
	{ key: "statusBarText", label: "Status Bar Text" },
];

export type FormatCategory = "image" | "video";

function CategoryTabs({
	category,
	onCategoryChange,
}: {
	category: FormatCategory;
	onCategoryChange: (value: FormatCategory) => void;
}) {
	return (
		<div className="mt--3 mx--3 mb-3">
			<Tabs.Root
				value={category}
				onValueChange={(value) => {
					if (value) onCategoryChange(value as FormatCategory);
				}}
			>
				<Tabs.List className="d-f">
					<Tabs.Tab
						value="image"
						className={(state) =>
							`f-1 px-3 py-2 fs-xs ff-m ta-c us-none c-p brw-1 bs-s bc-border fv:os-s fv:oo--2 fv:oc-accent ${state.active ? "bg-surface c-accent-dim fw-700" : "bg-page c-accent-dim bbw-1 bc-border"}`
						}
					>
						Image
					</Tabs.Tab>
					<Tabs.Tab
						value="video"
						className={(state) =>
							`f-1 px-3 py-2 fs-xs ff-m ta-c us-none c-p fv:os-s fv:oo--2 fv:oc-accent ${state.active ? "bg-surface c-accent-dim fw-700" : "bg-page c-accent-dim bbw-1 bc-border"}`
						}
					>
						Video
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.Root>
		</div>
	);
}

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
	return (
		<div className="d-f ai-c jc-sb g-2 px-2 pb-3">
			<span className="fs-sm ff-m c-accent-dim us-none">{label}</span>
			<Switch.Root
				checked={checked}
				onCheckedChange={onCheckedChange}
				className={`switch-root p-r d-f ai-c h-5 w-9 m-0 px-1 bw-1 bs-s c-p fv:os-s fv:oo-2 fv:oc-accent ${
					checked ? "bg-accent bc-accent" : "bg-page bc-border"
				}`}
			>
				<Switch.Thumb
					className={`switch-thumb w-4 h-3 bs-o-xs ${checked ? "bg-page ml-3" : "bg-accent-dim ml-0"}`}
				/>
			</Switch.Root>
		</div>
	);
}

function NumberRow({
	label,
	value,
	onValueChange,
	min,
	max,
	step,
	suffix,
}: {
	label: string;
	value: number;
	onValueChange: (value: number) => void;
	min: number;
	max: number;
	step: number;
	suffix: string;
}) {
	return (
		<div className="d-f ai-c jc-sb g-2 px-2 pb-3">
			<span className="fs-sm ff-m c-accent-dim us-none">{label}</span>
			<div className="d-f ai-c bw-1 bs-s bc-border bg-page bs-i-xs">
				<NumberField.Root
					value={value}
					onValueChange={(next) => {
						if (next != null) onValueChange(next);
					}}
					min={min}
					max={max}
					step={step}
					aria-label={label}
					className="w-14"
				>
					<NumberField.Input className="ff-m fs-xs c-accent-dim bg-transparent bw-0 px-2 py-1 w-100% ta-c" />
				</NumberField.Root>
				<span className="fs-xs ff-m c-accent-dim us-none pr-2">{suffix}</span>
			</div>
		</div>
	);
}

const REVEAL_STYLE_LABELS: Record<RevealStyle, string> = {
	typewriter: "Typewriter",
	natural: "Natural",
};

function VideoSettings({
	videoStyle,
	onVideoStyleChange,
	videoSpeed,
	onVideoSpeedChange,
	videoStartDelay,
	onVideoStartDelayChange,
	videoHold,
	onVideoHoldChange,
}: {
	videoStyle: RevealStyle;
	onVideoStyleChange: (value: RevealStyle) => void;
	videoSpeed: number;
	onVideoSpeedChange: (value: number) => void;
	videoStartDelay: number;
	onVideoStartDelayChange: (value: number) => void;
	videoHold: number;
	onVideoHoldChange: (value: number) => void;
}) {
	return (
		<>
			<SectionSeparator label="Typing" />

			<PickerField
				label="Style"
				value={videoStyle}
				options={(Object.keys(REVEAL_STYLE_LABELS) as RevealStyle[]).map(
					(id) => ({ id, label: REVEAL_STYLE_LABELS[id] }),
				)}
				onValueChange={onVideoStyleChange}
			/>

			<NumberRow
				label="Type Speed"
				value={videoSpeed}
				onValueChange={onVideoSpeedChange}
				min={10}
				max={100}
				step={5}
				suffix="ms/char"
			/>
			<NumberRow
				label="Start Delay"
				value={videoStartDelay / 1000}
				onValueChange={(value) => onVideoStartDelayChange(value * 1000)}
				min={0}
				max={5}
				step={0.5}
				suffix="s"
			/>
			<NumberRow
				label="End Hold"
				value={videoHold / 1000}
				onValueChange={(value) => onVideoHoldChange(value * 1000)}
				min={0}
				max={5}
				step={0.5}
				suffix="s"
			/>
		</>
	);
}

interface InspectorContentProps {
	format: ExportFormat;
	onCategoryChange: (value: FormatCategory) => void;
	videoStyle: RevealStyle;
	onVideoStyleChange: (value: RevealStyle) => void;
	videoSpeed: number;
	onVideoSpeedChange: (value: number) => void;
	videoStartDelay: number;
	onVideoStartDelayChange: (value: number) => void;
	videoHold: number;
	onVideoHoldChange: (value: number) => void;
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
	fontFamily: FontFamilyId;
	onFontFamilyChange: (value: FontFamilyId) => void;
	themeName: string;
	onThemeChange: (value: string) => void;
	themeIsRandom: boolean;
	frameColors: FrameColors;
	onFrameColorsChange: (value: FrameColors) => void;
	onUploadTheme: (file: File) => void;
}

function InspectorContent({
	format,
	onCategoryChange,
	videoStyle,
	onVideoStyleChange,
	videoSpeed,
	onVideoSpeedChange,
	videoStartDelay,
	onVideoStartDelayChange,
	videoHold,
	onVideoHoldChange,
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
	fontFamily,
	onFontFamilyChange,
	themeName,
	onThemeChange,
	themeIsRandom,
	frameColors,
	onFrameColorsChange,
	onUploadTheme,
}: InspectorContentProps) {
	return (
		<>
			<CategoryTabs
				category={isVideoFormat(format) ? "video" : "image"}
				onCategoryChange={onCategoryChange}
			/>

			<OptionSwitch
				label="Bounding Box"
				checked={showBoundingBox}
				onCheckedChange={onShowBoundingBoxChange}
			/>

			{isVideoFormat(format) ? (
				<VideoSettings
					videoStyle={videoStyle}
					onVideoStyleChange={onVideoStyleChange}
					videoSpeed={videoSpeed}
					onVideoSpeedChange={onVideoSpeedChange}
					videoStartDelay={videoStartDelay}
					onVideoStartDelayChange={onVideoStartDelayChange}
					videoHold={videoHold}
					onVideoHoldChange={onVideoHoldChange}
				/>
			) : (
				<>
					<SectionSeparator label="Frame" />

					<OptionSwitch
						label="Tab Bar"
						checked={showTabBar}
						onCheckedChange={onShowTabBarChange}
					/>
					<OptionSwitch
						label="Status Bar"
						checked={showStatusBar}
						onCheckedChange={onShowStatusBarChange}
					/>

					<RadiusControl radii={radii} onRadiiChange={onRadiiChange} />

					<OptionSwitch
						label="Tab Border"
						checked={showActiveTabBorder}
						onCheckedChange={onShowActiveTabBorderChange}
					/>
					{showActiveTabBorder && (
						<ColorInput
							label="Color"
							indent
							value={frameColors.activeTabBorder}
							onChange={(activeTabBorder) =>
								onFrameColorsChange({ ...frameColors, activeTabBorder })
							}
						/>
					)}

					<PickerField
						label="Font Family"
						value={fontFamily}
						options={(Object.keys(FONT_FAMILIES) as FontFamilyId[]).map(
							(id) => ({
								id,
								label: FONT_FAMILIES[id].label,
								style: FONT_FAMILIES[id].stack
									? { fontFamily: FONT_FAMILIES[id].stack }
									: undefined,
							}),
						)}
						onValueChange={onFontFamilyChange}
					/>

					<SectionSeparator label="Background" />

					<OptionSwitch
						label="Grid Lines"
						checked={showGridLines}
						onCheckedChange={onShowGridLinesChange}
					/>

					<OptionSwitch
						label="Background Patterns"
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
						badge={
							themeIsRandom
								? { text: "*", title: "Randomly selected theme" }
								: undefined
						}
					/>

					<div className="px-2 pb-4">
						<Button
							onClick={() => {
								const input = document.createElement("input");
								input.type = "file";
								input.accept = ".json";
								input.onchange = () => {
									const file = input.files?.[0];
									if (file) onUploadTheme(file);
								};
								input.click();
							}}
							className="d-f ai-c jc-c g-2 w-100% px-2 py-2 bw-1 bs-d bc-border bg-transparent c-accent-dim fs-xs ff-m us-none c-p h:c-accent h:bc-accent fv:os-s fv:oo-2 fv:oc-accent"
						>
							<UploadSimpleIcon size={14} weight="fill" />
							Import VS Code Theme
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
				</>
			)}
		</>
	);
}

export function Inspector({
	open,
	onOpenChange,
	...contentProps
}: InspectorContentProps & {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<>
			<aside className="d-none @lg:d-f fd-c w-72 fs-0 min-h-0 oy-auto blw-1 bs-s bc-border bg-surface p-3">
				<InspectorContent {...contentProps} />
			</aside>

			<BottomSheet open={open} onOpenChange={onOpenChange} title="Settings">
				<InspectorContent {...contentProps} />
			</BottomSheet>
		</>
	);
}
