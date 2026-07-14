import { Button } from "@base-ui/react/button";
import { NumberField } from "@base-ui/react/number-field";
import { Select } from "@base-ui/react/select";
import { Separator } from "@base-ui/react/separator";
import { Slider } from "@base-ui/react/slider";
import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import {
	CaretDownIcon,
	CaretUpIcon,
	CornersOutIcon,
	UploadSimpleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";
import { THEMES } from "../lib/highlighter";
import type { Background } from "../lib/types";
import { ColorInput } from "./color-input";
import type { FrameColors } from "./frame";

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

export interface CornerRadii {
	tl: number;
	tr: number;
	bl: number;
	br: number;
}

const RADIUS_MIN = 0;
const RADIUS_MAX = 16;

const CORNERS: {
	id: keyof CornerRadii;
	label: string;
	Icon: typeof CaretUpIcon;
	rotate: string;
}[] = [
	{ id: "tl", label: "Top left", Icon: CaretUpIcon, rotate: "ro-63" },
	{ id: "tr", label: "Top right", Icon: CaretUpIcon, rotate: "ro--63" },
	{ id: "bl", label: "Bottom left", Icon: CaretUpIcon, rotate: "ro--27" },
	{ id: "br", label: "Bottom right", Icon: CaretUpIcon, rotate: "ro-27" },
];

const RADIUS_TICKS = [0, 25, 50, 75, 100];

function RadiusControl({
	radii,
	onRadiiChange,
}: {
	radii: CornerRadii;
	onRadiiChange: (value: CornerRadii) => void;
}) {
	const { trigger: haptic } = useHaptics();
	const [split, setSplit] = useState(false);

	const values = [radii.tl, radii.tr, radii.bl, radii.br];
	const uniform = values.every((value) => value === values[0]);

	function setAll(value: number) {
		onRadiiChange({ tl: value, tr: value, bl: value, br: value });
	}

	function setCorner(corner: keyof CornerRadii, value: number) {
		onRadiiChange({ ...radii, [corner]: value });
		haptic("success");
	}

	return (
		<div className="d-f fd-c g-2 px-2 pt-1 pb-4">
			<span className="fs-sm ff-m c-accent-dim us-none">Border radius</span>

			<div className="d-f ai-c g-2">
				<Slider.Root
					value={uniform ? radii.tl : Math.max(...values)}
					onValueChange={(value) => setAll(value)}
					onValueCommitted={() => haptic("success")}
					min={RADIUS_MIN}
					max={RADIUS_MAX}
					step={1}
					className="d-f ai-c g-2 f-1"
				>
					<Slider.Control className="p-r d-f ai-c h-5 f-1 c-p">
						<div
							className="p-a l-0 r-0 h-px"
							style={{ top: "50%" }}
							aria-hidden="true"
						>
							{RADIUS_TICKS.map((pct) => (
								<span
									key={pct}
									className="p-a w-px h-1 bg-border"
									style={{ left: `${pct}%`, top: -2 }}
								/>
							))}
						</div>
						<Slider.Track className="p-r f-1 h-px bg-border">
							<Slider.Indicator className="h-px bg-accent" />
							<Slider.Thumb className="w-2 h-4 bg-accent bs-o-xs fv:os-s fv:oo-2 fv:oc-accent" />
						</Slider.Track>
					</Slider.Control>

					<Slider.Value
						className={`ff-m fs-xs ta-c w-9 py-1 bw-1 bs-s bc-border us-none ${
							uniform ? "c-accent-dim" : "c-border"
						}`}
					>
						{(formatted) => (uniform ? formatted[0] : "—")}
					</Slider.Value>
				</Slider.Root>

				<Button
					onClick={() => {
						setSplit((value) => !value);
						haptic("success");
					}}
					aria-pressed={split}
					className={`d-f ai-c jc-c w-7 h-7 fs-0 p-0 bw-1 bs-s c-p fv:os-s fv:oo-2 fv:oc-accent ${
						split
							? "bg-accent bc-accent c-page"
							: "bg-transparent bc-border c-accent-dim h:c-accent h:bc-accent"
					}`}
				>
					<CornersOutIcon size={14} weight="bold" />
				</Button>
			</div>

			{split && (
				<div
					className="g-1"
					style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
				>
					{CORNERS.map(({ id, label, Icon, rotate }) => (
						<div key={id} className="d-f bw-1 bs-s bc-border">
							<span className="d-f ai-c jc-c w-6 fs-0 c-accent-dim brw-1 bs-s bc-border">
								<Icon size={12} weight="bold" aria-hidden className={rotate} />
							</span>
							<NumberField.Root
								value={radii[id]}
								onValueChange={(value) => {
									if (value != null) setCorner(id, value);
								}}
								min={RADIUS_MIN}
								max={RADIUS_MAX}
								step={1}
								aria-label={`${label} radius`}
								className="f-1"
							>
								<NumberField.Input className="ff-m fs-xs c-accent-dim bg-transparent bw-0 px-1 py-1 w-100% ta-c" />
							</NumberField.Root>
						</div>
					))}
				</div>
			)}
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

function ThemePicker({
	value,
	onValueChange,
}: {
	value: string;
	onValueChange: (value: string) => void;
}) {
	const { trigger: haptic } = useHaptics();

	return (
		<Select.Root
			value={value}
			onValueChange={(next) => {
				if (next) {
					onValueChange(next);
					haptic("success");
				}
			}}
		>
			<Select.Trigger className="d-f ai-c jc-sb g-1 w-100% px-2 py-1 c-accent-dim fs-sm ff-m us-none c-p bw-1 bs-s bc-border fv:os-s fv:oo-2 fv:oc-accent h:bg-page">
				<Select.Value>
					{() => <span className="min-w-0 o-h to-e ws-nw">{value}</span>}
				</Select.Value>
				<Select.Icon className="d-f c-accent-dim">
					<CaretDownIcon size={12} weight="fill" />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Positioner
					sideOffset={8}
					alignItemWithTrigger={false}
					className="zi-90 p-0 ow-0 us-none"
				>
					<Select.Popup className="w-48 bw-1 bc-border bg-surface py-1 bs-o-xs">
						<Select.List>
							{(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((id) => (
								<Select.Item
									key={id}
									value={id}
									className={(state) =>
										`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-accent c-page" : state.selected ? "c-accent h:c-white fw-700 tdl-u" : "c-accent-dim"}`
									}
								>
									<Select.ItemText>{id}</Select.ItemText>
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	);
}

export function Inspector({
	showTabBar,
	onShowTabBarChange,
	showStatusBar,
	onShowStatusBarChange,
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
	showGridLines: boolean;
	onShowGridLinesChange: (value: boolean) => void;
	showBoundingBox: boolean;
	onShowBoundingBoxChange: (value: boolean) => void;
	showActiveTabBorder: boolean;
	onShowActiveTabBorderChange: (value: boolean) => void;
	background: Background;
	onBackgroundChange: (value: Background) => void;
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
		<aside className="d-none @lg:d-f fd-c w-72 fs-0 blw-1 bs-s bc-border bg-surface p-3">
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
					label="Tab border"
					value={frameColors.activeTabBorder}
					onChange={(activeTabBorder) =>
						onFrameColorsChange({ ...frameColors, activeTabBorder })
					}
				/>
			)}

			<div className="d-f fd-c g-1 px-2 pb-4">
				<span className="fs-sm ff-m c-accent-dim us-none">Font</span>
				<Select.Root
					value={font}
					onValueChange={(next) => {
						if (next) {
							onFontChange(next as FontId);
							haptic("success");
						}
					}}
				>
					<Select.Trigger className="d-f ai-c jc-sb g-1 w-100% px-2 py-1 c-accent-dim fs-sm ff-m us-none c-p bw-1 bs-s bc-border fv:os-s fv:oo-2 fv:oc-accent h:bg-page">
						<Select.Value>
							{() => (
								<span className="min-w-0 o-h to-e ws-nw">
									{FONTS[font].label}
								</span>
							)}
						</Select.Value>
						<Select.Icon className="d-f c-accent-dim">
							<CaretDownIcon size={12} weight="fill" />
						</Select.Icon>
					</Select.Trigger>
					<Select.Portal>
						<Select.Positioner
							sideOffset={8}
							alignItemWithTrigger={false}
							className="zi-90 p-0 ow-0 us-none"
						>
							<Select.Popup className="w-48 bw-1 bc-border bg-surface py-1 bs-o-xs">
								<Select.List>
									{(Object.keys(FONTS) as FontId[]).map((id) => (
										<Select.Item
											key={id}
											value={id}
											className={(state) =>
												`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-accent c-page" : state.selected ? "c-accent h:c-white fw-700 tdl-u" : "c-accent-dim"}`
											}
										>
											<Select.ItemText>
												<span
													style={
														FONTS[id].stack
															? { fontFamily: FONTS[id].stack }
															: undefined
													}
												>
													{FONTS[id].label}
												</span>
											</Select.ItemText>
										</Select.Item>
									))}
								</Select.List>
							</Select.Popup>
						</Select.Positioner>
					</Select.Portal>
				</Select.Root>
			</div>

			<SectionSeparator label="Background" />

			<OptionSwitch
				label="Grid lines"
				checked={showGridLines}
				onCheckedChange={onShowGridLinesChange}
			/>

			<div className="px-2 pb-4">
				<Tabs.Root
					value={background}
					onValueChange={(value) => {
						const next = value as Background | undefined;
						if (next) {
							onBackgroundChange(next);
							haptic("success");
						}
					}}
					className="bw-1 bs-s bc-border"
				>
					<Tabs.List className="d-f p-r g-1 p-1">
						<Tabs.Tab
							value="stripes"
							className={`p-r zi-10 f-1 px-2 py-1 fs-xs ff-m ta-c us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${background === "stripes" ? "c-page bg-accent fw-700" : "c-accent-dim bg-transparent h:bg-page"}`}
						>
							Stripes
						</Tabs.Tab>
						<Tabs.Tab
							value="solid"
							className={`p-r zi-10 f-1 px-2 py-1 fs-xs ff-m ta-c us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${background === "solid" ? "c-page bg-accent fw-700" : "c-accent-dim bg-transparent h:bg-page"}`}
						>
							Solid
						</Tabs.Tab>
						<Tabs.Indicator
							className="p-a l-0 zi-0 bg-accent bs-o-xs"
							style={{
								translate: "var(--active-tab-left) 0",
								width: "var(--active-tab-width)",
								top: "var(--active-tab-top)",
								height: "var(--active-tab-height)",
							}}
						/>
					</Tabs.List>
				</Tabs.Root>
			</div>

			<SectionSeparator label="Appearance" />

			<div className="d-f fd-c g-1 px-2 pb-4">
				<span className="fs-sm ff-m c-accent-dim us-none">Theme</span>
				<ThemePicker value={themeName} onValueChange={onThemeChange} />
			</div>

			<div className="px-2 pb-4">
				<Button
					onClick={() => {
						const input = document.createElement("input");
						input.type = "file";
						input.accept = ".json,.jsonc,application/json";
						input.onchange = () => {
							const file = input.files?.[0];
							if (file) {
								onUploadTheme(file);
								haptic("success");
							}
						};
						input.click();
					}}
					className="d-f ai-c jc-c g-2 w-100% px-2 py-2 bw-1 bs-d bc-border bg-transparent c-accent-dim fs-xs ff-m us-none c-p h:c-accent h:bc-accent-dim fv:os-s fv:oo-2 fv:oc-accent"
				>
					<UploadSimpleIcon size={14} weight="fill" />
					Import VS Code theme
				</Button>
			</div>

			<ColorInput
				label="Page"
				value={frameColors.page}
				onChange={(page) => onFrameColorsChange({ ...frameColors, page })}
			/>
			<ColorInput
				label="Surface"
				value={frameColors.surface}
				onChange={(surface) => onFrameColorsChange({ ...frameColors, surface })}
			/>
			<ColorInput
				label="Border"
				value={frameColors.border}
				onChange={(border) => onFrameColorsChange({ ...frameColors, border })}
			/>
			<ColorInput
				label="Text"
				value={frameColors.accentDim}
				onChange={(accentDim) =>
					onFrameColorsChange({ ...frameColors, accentDim })
				}
			/>
			<ColorInput
				label="Tab"
				value={frameColors.tabBar}
				onChange={(tabBar) => onFrameColorsChange({ ...frameColors, tabBar })}
			/>
			<ColorInput
				label="Tab active"
				value={frameColors.tabActive}
				onChange={(tabActive) =>
					onFrameColorsChange({ ...frameColors, tabActive })
				}
			/>
			<ColorInput
				label="Status bar"
				value={frameColors.statusBarBg}
				onChange={(statusBarBg) =>
					onFrameColorsChange({ ...frameColors, statusBarBg })
				}
			/>
		</aside>
	);
}
