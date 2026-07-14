import { Button } from "@base-ui/react/button";
import { Select } from "@base-ui/react/select";
import { Separator } from "@base-ui/react/separator";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useHaptics } from "../lib/haptics";
import { type LanguageId, THEMES } from "../lib/highlighter";
import type { Background } from "../lib/types";
import { LanguagePicker } from "./language-picker";

export function StatusBar({
	language,
	onLanguageChange,
	background,
	onBackgroundChange,
	themeName,
	onThemeChange,
	width,
	height,
}: {
	language: LanguageId;
	onLanguageChange: (value: LanguageId) => void;
	background: Background;
	onBackgroundChange: (value: Background) => void;
	themeName: string;
	onThemeChange: (value: string) => void;
	width: number;
	height: number;
}) {
	const { trigger: haptic } = useHaptics();

	return (
		<footer className="d-f ai-c btw-1 bs-s bc-border bg-surface">
			<LanguagePicker value={language} onValueChange={onLanguageChange} />

			<Separator orientation="vertical" className="h-4 w-px bg-border" />

			<Button
				onClick={() => {
					onBackgroundChange(background === "stripes" ? "solid" : "stripes");
					haptic("success");
				}}
				className="px-3 py-1 bg-transparent c-accent-dim fs-xs ff-m us-none c-p h:c-accent h:bg-page fv:os-s fv:oo--2 fv:oc-accent"
			>
				{background === "stripes" ? "Stripes" : "Solid"}
			</Button>

			<Separator orientation="vertical" className="h-4 w-px bg-border" />

			<Select.Root
				value={themeName}
				onValueChange={(next) => {
					if (next) {
						onThemeChange(next);
						haptic("success");
					}
				}}
			>
				<Select.Trigger className="d-f ai-c g-1 px-3 py-1 bg-transparent c-accent-dim fs-xs ff-m us-none c-p bw-0 h:c-accent h:bg-page fv:os-s fv:oo--2 fv:oc-accent">
					<Select.Value>
						{() => (
							<span className="min-w-0 max-w-28 o-h to-e ws-nw">
								{themeName}
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
								{(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((id) => (
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

			<div className="f-1" />

			<span className="px-3 py-1 ff-m fs-xs c-accent-dim">
				{width} × {height}
			</span>
			<Separator orientation="vertical" className="h-4 w-px bg-border" />
			<span className="py-1 px-3 ff-m fs-xs c-accent-dim">2x</span>
		</footer>
	);
}
