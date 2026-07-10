import { Button } from "@base-ui/react/button";
import { Select } from "@base-ui/react/select";
import { Separator } from "@base-ui/react/separator";
import { Slider } from "@base-ui/react/slider";
import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import {
	CaretDownIcon,
	CheckIcon,
	UploadSimpleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";
import type { Background } from "./Toolbar";

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

// Figma-style per-corner radius: tabs pick the scope (all corners or a
// single one), the slider edits whatever is selected.
function RadiusControl({
	radii,
	onRadiiChange,
}: {
	radii: CornerRadii;
	onRadiiChange: (value: CornerRadii) => void;
}) {
	const [scope, setScope] = useState<CornerScope>("all");
	const current = scope === "all" ? radii.tl : radii[scope];

	function apply(value: number) {
		if (scope === "all") {
			onRadiiChange({ tl: value, tr: value, bl: value, br: value });
		} else {
			onRadiiChange({ ...radii, [scope]: value });
		}
	}

	return (
		<div className="d-f fd-c g-1 px-2 py-1">
			<span className="fs-sm ff-m c-accent-dim us-none">Radius</span>
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

// --[LABEL]---------- section separator; text beats icons for clarity
function SectionSeparator({ label }: { label: string }) {
	return (
		<div className="d-f ai-c g-2 py-2">
			<Separator orientation="horizontal" className="w-3 h-px bg-border" />
			<span className="fs-xs ff-m c-accent-dim us-none ws-nw">{label}</span>
			<Separator orientation="horizontal" className="f-1 h-px bg-border" />
		</div>
	);
}

// Yumma UI switch-square pattern, recolored to the Aperture palette
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
		<div className="d-f ai-c jc-sb g-2 px-2 py-1">
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

function FontPicker({
	value,
	onValueChange,
}: {
	value: FontId;
	onValueChange: (value: FontId) => void;
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
					{() => (
						<span className="min-w-0 o-h to-e ws-nw">{FONTS[value].label}</span>
					)}
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
									{(Object.keys(FONTS) as FontId[]).map((id) => (
										<Select.Item
											key={id}
											value={id}
											className={(state) =>
												`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-page c-accent" : "c-accent-dim"}`
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
											<Select.ItemIndicator className="d-f ai-c c-accent">
												<CheckIcon size={14} weight="fill" />
											</Select.ItemIndicator>
										</Select.Item>
									))}
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
	showHashtagLines,
	onShowHashtagLinesChange,
	background,
	onBackgroundChange,
	radii,
	onRadiiChange,
	font,
	onFontChange,
	themeName,
	onUploadTheme,
}: {
	showTabBar: boolean;
	onShowTabBarChange: (value: boolean) => void;
	showStatusBar: boolean;
	onShowStatusBarChange: (value: boolean) => void;
	showHashtagLines: boolean;
	onShowHashtagLinesChange: (value: boolean) => void;
	background: Background;
	onBackgroundChange: (value: Background) => void;
	radii: CornerRadii;
	onRadiiChange: (value: CornerRadii) => void;
	font: FontId;
	onFontChange: (value: FontId) => void;
	themeName: string;
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

			<div className="d-f fd-c g-1 px-2 py-1">
				<span className="fs-sm ff-m c-accent-dim us-none">Font</span>
				<FontPicker value={font} onValueChange={onFontChange} />
			</div>

			<SectionSeparator label="Background" />

			<OptionSwitch
				label="Hashtag lines"
				checked={showHashtagLines}
				onCheckedChange={onShowHashtagLinesChange}
			/>

			<div className="px-2 py-1">
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

			<SectionSeparator label="Theme" />

			<div className="d-f ai-c jc-sb g-2 px-2 py-1">
				<span className="fs-sm ff-m c-accent us-none min-w-0 o-h to-e ws-nw">
					{themeName}
				</span>
				<CheckIcon size={14} weight="fill" className="c-accent fs-0" />
			</div>

			<div className="px-2 py-1">
				<Button
					onClick={() => {
						const input = document.createElement("input");
						input.type = "file";
						input.accept = ".json,.jsonc,application/json";
						input.onchange = () => {
							const file = input.files?.[0];
							if (file) onUploadTheme(file);
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
