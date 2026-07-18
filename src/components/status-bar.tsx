import { Button } from "@base-ui/react/button";
import { Select } from "@base-ui/react/select";
import { Separator } from "@base-ui/react/separator";
import { CaretDownIcon, ShuffleIcon } from "@phosphor-icons/react";
import { type LanguageId, THEMES } from "../lib/highlighter";
import type { BackgroundPattern } from "../lib/types";
import { LanguagePicker } from "./language-picker";
import { Tooltip } from "./tooltip";

const PATTERN_LABELS: Record<BackgroundPattern, string> = {
	"stripes-right": "Stripes Right",
	"stripes-left": "Stripes Left",
};

export function StatusBar({
	language,
	onLanguageChange,
	background,
	onBackgroundChange,
	themeName,
	onThemeChange,
	themeIsRandom,
	onRandomize,
	width,
	height,
}: {
	language: LanguageId;
	onLanguageChange: (value: LanguageId) => void;
	background: BackgroundPattern;
	onBackgroundChange: (value: BackgroundPattern) => void;
	themeName: string;
	onThemeChange: (value: string) => void;
	themeIsRandom: boolean;
	onRandomize: () => void;
	width: number;
	height: number;
}) {
	const PATTERNS = Object.keys(PATTERN_LABELS) as BackgroundPattern[];
	const THEME_IDS = Object.keys(THEMES);

	function cycleBackground() {
		const idx = PATTERNS.indexOf(background);
		const next = PATTERNS[(idx + 1) % PATTERNS.length];
		onBackgroundChange(next);
	}

	return (
		<footer className="d-f ai-c btw-1 bs-s bc-border bg-surface">
			<LanguagePicker value={language} onValueChange={onLanguageChange} />

			<Separator orientation="vertical" className="h-4 w-px bg-border" />

			<Button
				onClick={cycleBackground}
				className="w-28 ta-c py-1 bg-transparent c-accent-dim fs-xs ff-m us-none c-p h:c-accent h:bg-page fv:os-s fv:oo--2 fv:oc-accent"
			>
				{PATTERN_LABELS[background]}
			</Button>

			<Separator orientation="vertical" className="h-4 w-px bg-border" />

			<Select.Root
				value={themeName}
				onValueChange={(next) => {
					if (next) onThemeChange(next);
				}}
			>
				<Select.Trigger className="d-f ai-c g-1 px-3 py-1 bg-transparent c-accent-dim fs-xs ff-m us-none c-p bw-0 h:c-accent h:bg-page fv:os-s fv:oo--2 fv:oc-accent">
					<Select.Value>
						{() => (
							<span className="d-if w-28 o-h to-e ws-nw">
								{themeName}
								{themeIsRandom && (
									<Tooltip content="Randomly selected theme">
										<span className="c-accent"> *</span>
									</Tooltip>
								)}
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
						<Select.Popup className="w-48 max-h-60 oy-auto bw-1 bc-border bg-surface py-1 bs-o-xs">
							<Select.List>
								{THEME_IDS.map((id) => (
									<Select.Item
										key={id}
										value={id}
										className={(state) =>
											`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-accent c-page" : "c-accent-dim"}`
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

			<Separator orientation="vertical" className="h-4 w-px bg-border" />

			<Tooltip content="Randomize appearance">
				<Button
					onClick={onRandomize}
					aria-label="Randomize appearance"
					className="d-f ai-c jc-c g-1 px-2 py-1 bg-transparent c-accent-dim fs-xs ff-m us-none bw-0 c-p h:c-accent h:bg-page fv:os-s fv:oo--2 fv:oc-accent"
				>
					<ShuffleIcon size={13} weight="bold" />
					Randomize
				</Button>
			</Tooltip>

			<div className="f-1" />

			<span className="d-if w-28 ta-c py-1 ff-m fs-xs c-accent-dim">
				{width} × {height}
			</span>
			<Separator orientation="vertical" className="h-4 w-px bg-border" />
			<span className="py-1 px-3 ff-m fs-xs c-accent-dim">2x</span>
		</footer>
	);
}
