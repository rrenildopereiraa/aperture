import { Button } from "@base-ui/react/button";
import { Select } from "@base-ui/react/select";
import { Separator } from "@base-ui/react/separator";
import { Slider } from "@base-ui/react/slider";
import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { CaretDownIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";
import { THEMES } from "../lib/highlighter";
import { ColorInput } from "./color-input";
import type { FrameColors } from "./frame";
import type { Background } from "./toolbar";

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

type CornerScope = "all" | keyof CornerRadii;

const CORNER_TABS: { id: CornerScope; label: string }[] = [
	{ id: "all", label: "All" },
	{ id: "tl", label: "TL" },
	{ id: "tr", label: "TR" },
	{ id: "bl", label: "BL" },
	{ id: "br", label: "BR" },
];

function RadiusControl({
	radii,
	onRadiiChange,
}: {
	radii: CornerRadii;
	onRadiiChange: (value: CornerRadii) => void;
}) {
	const [scope, setScope] = useState<CornerScope>("all");
	const current = scope === "all" ? radii.tl : radii[scope];
	const { trigger: haptic } = useHaptics();

	function apply(value: number) {
		if (scope === "all") {
			onRadiiChange({ tl: value, tr: value, bl: value, br: value });
		} else {
			onRadiiChange({ ...radii, [scope]: value });
		}
		haptic("success");
	}

	return (
		<div className="d-f fd-c g-1 px-2 pt-1 pb-3">
			<span className="fs-sm ff-m c-accent-dim us-none">Border Radius</span>
			<Tabs.Root
				value={scope}
				onValueChange={(value) => setScope(value as CornerScope)}
			>
				<Tabs.List className="d-f bw-1 bs-s bc-border">
					{CORNER_TABS.map(({ id, label }) => (
						<Tabs.Tab
							key={id}
							value={id}
							className={(state) =>
								`f-1 px-1 py-1 fs-xs ff-m ta-c us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${state.active ? "c-page bg-accent fw-700" : "c-accent-dim bg-transparent h:bg-page"}`
							}
						>
							{label}
						</Tabs.Tab>
					))}
				</Tabs.List>
			</Tabs.Root>
			<div className="d-f ai-c g-2">
				<Slider.Root
					value={current}
					onValueChange={(value) => {
						apply(Array.isArray(value) ? value[0] : value);
					}}
					min={0}
					max={16}
					step={1}
					className="f-1"
				>
					<Slider.Control className="d-f ai-c py-2 us-none ta-none">
						<Slider.Track className="p-r h-1 w-100% bg-page">
							<Slider.Indicator className="bg-accent" />
							<Slider.Thumb className="w-3 h-3 bg-accent fv:os-s fv:oo-2 fv:oc-accent" />
						</Slider.Track>
					</Slider.Control>
				</Slider.Root>
				<span className="fs-xs ff-m c-accent-dim w-4 ta-r">{current}</span>
			</div>
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
		<div className="d-f ai-c jc-sb g-2 px-2 pb-2">
			<span className="fs-sm ff-m c-accent-dim us-none">{label}</span>
			<Switch.Root
				checked={checked}
				onCheckedChange={(value) => {
					onCheckedChange(value);
					haptic("success");
				}}
				className={`p-r d-f ai-c h-5 w-9 m-0 px-1 bw-1 bs-s c-p tp-c tdu-150 ttf-io fv:os-s fv:oo-2 fv:oc-accent ${
					checked ? "bg-accent bc-accent" : "bg-page bc-border"
				}`}
			>
				<Switch.Thumb
					render={
						<motion.span
							animate={{ x: checked ? 12 : 0 }}
							transition={{ duration: 0.2, ease: "easeInOut" }}
						/>
					}
					className={`w-4 h-3 bs-o-xs ${checked ? "bg-page" : "bg-accent-dim"}`}
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
	const [open, setOpen] = useState(false);
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
			open={open}
			onOpenChange={setOpen}
		>
			<Select.Trigger
				className={`d-f ai-c jc-sb g-1 w-100% px-2 py-1 c-accent-dim fs-sm ff-m us-none c-p bw-1 bs-s bc-border fv:os-s fv:oo-2 fv:oc-accent ${open ? "bg-page" : "bg-transparent"} h:bg-page`}
			>
				<Select.Value>
					{() => <span className="min-w-0 o-h to-e ws-nw">{value}</span>}
				</Select.Value>
				<Select.Icon className="d-f c-accent-dim">
					<CaretDownIcon size={12} weight="fill" />
				</Select.Icon>
			</Select.Trigger>
			<AnimatePresence>
				{open && (
					<Select.Portal>
						<Select.Positioner
							sideOffset={8}
							alignItemWithTrigger={false}
							className="zi-90 p-0 ow-0 us-none"
						>
							<Select.Popup
								render={
									<motion.div
										initial={{ opacity: 0, scale: 0.97 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.97 }}
										transition={{ duration: 0.12, ease: "easeOut" }}
									/>
								}
								className="w-48 bw-1 bc-border bg-surface py-1 bs-o-xs"
							>
								<Select.List>
									{(Object.keys(THEMES) as (keyof typeof THEMES)[]).map(
										(id) => (
											<Select.Item
												key={id}
												value={id}
												className={(state) =>
													`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-page c-accent" : "c-accent-dim"}`
												}
											>
												<Select.ItemText>{id}</Select.ItemText>
											</Select.Item>
										),
									)}
								</Select.List>
							</Select.Popup>
						</Select.Positioner>
					</Select.Portal>
				)}
			</AnimatePresence>
		</Select.Root>
	);
}

function segmentClass(pressed: boolean) {
	return `f-1 px-2 py-1 fs-xs ff-m us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${pressed ? "c-page bg-accent fw-700" : "c-accent-dim bg-transparent h:bg-page"}`;
}

export function Inspector({
	showTabBar,
	onShowTabBarChange,
	showStatusBar,
	onShowStatusBarChange,
	showGridLines,
	onShowGridLinesChange,
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
		<aside className="d-none @lg:d-f fd-c w-56 fs-0 blw-1 bs-s bc-border bg-surface p-3">
			<SectionSeparator label="Frame" />

			<OptionSwitch
				label="Tab bar"
				checked={showTabBar}
				onCheckedChange={onShowTabBarChange}
			/>
			<OptionSwitch
				label="Status bar"
				checked={showStatusBar}
				onCheckedChange={onShowStatusBarChange}
			/>

			<RadiusControl radii={radii} onRadiiChange={onRadiiChange} />

			<div className="d-f fd-c g-1 px-2 pb-3">
				<span className="fs-sm ff-m c-accent-dim us-none">Font</span>
				<div className="d-f bw-1 bs-s bc-border">
					{(Object.keys(FONTS) as FontId[]).map((id) => (
						<Button
							key={id}
							onClick={() => {
								onFontChange(id);
								haptic("success");
							}}
							style={
								FONTS[id].stack ? { fontFamily: FONTS[id].stack } : undefined
							}
							className={`f-1 px-1 py-1 fs-xs ff-m us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${font === id ? "c-page bg-accent fw-700" : "c-accent-dim bg-transparent h:bg-page"}`}
						>
							Aa
						</Button>
					))}
				</div>
			</div>

			<SectionSeparator label="Background" />

			<OptionSwitch
				label="Grid lines"
				checked={showGridLines}
				onCheckedChange={onShowGridLinesChange}
			/>

			<div className="px-2 pb-3">
				<ToggleGroup
					value={[background]}
					onValueChange={(value) => {
						const next = value[0] as Background | undefined;
						if (next) {
							onBackgroundChange(next);
							haptic("success");
						}
					}}
					className="d-f bw-1 bs-s bc-border"
				>
					<Toggle
						value="stripes"
						className={(state) => segmentClass(state.pressed)}
					>
						Stripes
					</Toggle>
					<Toggle
						value="solid"
						className={(state) => segmentClass(state.pressed)}
					>
						Solid
					</Toggle>
				</ToggleGroup>
			</div>

			<SectionSeparator label="Colors" />

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
				label="Dim accent"
				value={frameColors.accentDim}
				onChange={(accentDim) =>
					onFrameColorsChange({ ...frameColors, accentDim })
				}
			/>
			<ColorInput
				label="Tab bar"
				value={frameColors.tabBar}
				onChange={(tabBar) =>
					onFrameColorsChange({ ...frameColors, tabBar })
				}
			/>
			<ColorInput
				label="Tab active"
				value={frameColors.tabActive}
				onChange={(tabActive) =>
					onFrameColorsChange({ ...frameColors, tabActive })
				}
			/>

			<SectionSeparator label="Theme" />

			<div className="d-f fd-c g-1 px-2 pb-3">
				<span className="fs-sm ff-m c-accent-dim us-none">Syntax theme</span>
				<ThemePicker value={themeName} onValueChange={onThemeChange} />
			</div>

			<div className="px-2">
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
					Upload .json theme
				</Button>
			</div>
		</aside>
	);
}
