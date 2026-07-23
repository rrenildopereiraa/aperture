import { Button } from "@base-ui/react/button";
import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useChromeTheme, useHover } from "../lib/chrome-theme";
import { overlayColor } from "../lib/color";
import { modLabel } from "../lib/platform";

const STORAGE_KEY = "prisharp-onboarding-seen";

// The mouse gestures are the only genuinely undiscoverable part of the app -
// there's no affordance on screen hinting that Alt does anything - so those
// lead. Everything below them is reachable from the command palette anyway.
const SHORTCUTS: { keys: string; description: string }[] = [
	{ keys: "Alt + click", description: "Highlight a line" },
	{ keys: "Alt + drag", description: "Highlight a range of lines" },
	{
		keys: "Alt + Shift + drag",
		description: "Highlight exactly the text you drag over",
	},
	{ keys: "Alt + Shift + click", description: "Highlight a single word" },
	{
		keys: "click again",
		description: "Cycle a highlight: mark → add → remove → off",
	},
	{ keys: `${modLabel} K`, description: "Open the command palette" },
	{ keys: `${modLabel} S`, description: "Export" },
	{ keys: `${modLabel} Shift C`, description: "Copy image to clipboard" },
];

export function hasSeenOnboarding(): boolean {
	if (typeof window === "undefined") return true;
	return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function Onboarding({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { colors } = useChromeTheme();
	const { hovered: closeHovered, hoverHandlers: closeHoverHandlers } =
		useHover();
	const { hovered: doneHovered, hoverHandlers: doneHoverHandlers } = useHover();

	useEffect(() => {
		if (open) window.localStorage.setItem(STORAGE_KEY, "true");
	}, [open]);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal keepMounted>
				<Dialog.Backdrop
					className="p-f i-0 zi-80"
					style={{ backgroundColor: overlayColor(colors.page, 0.6) }}
				/>
				<Dialog.Popup
					className="p-f t-50% l-50% zi-90 w-120 max-w-90% bw-1 bs-s bs-o-xs"
					style={{
						// ttx--half and tty--half both write `transform`, so using
						// both classes together silently drops one axis - the
						// centering has to be a single declaration.
						transform: "translate(-50%, -50%)",
						backgroundColor: colors.surface,
						borderColor: colors.border,
					}}
				>
					<div
						className="d-f ai-c jc-sb px-4 py-3 bbw-1 bs-s"
						style={{ borderColor: colors.border }}
					>
						<Dialog.Title
							className="fs-sm ff-m fw-700 us-none"
							style={{ color: colors.accentDim }}
						>
							Welcome to Prisharp
						</Dialog.Title>
						<Dialog.Close
							aria-label="Close"
							className="d-f ai-c jc-c w-6 h-6 p-0 bg-transparent bw-0 c-p fv:os-s fv:oo-2 fv:oc-accent"
							style={{ color: closeHovered ? colors.accent : colors.accentDim }}
							{...closeHoverHandlers}
						>
							<XIcon size={14} weight="bold" />
						</Dialog.Close>
					</div>

					<div className="px-4 py-3">
						<p
							className="fs-xs ff-m pb-3 m-0"
							style={{ color: colors.accentDim }}
						>
							Type or paste code, then style it however you like. Highlighting
							runs on modifier keys — those are worth knowing:
						</p>

						<div className="d-f fd-c g-2">
							{SHORTCUTS.map(({ keys, description }) => (
								<div key={keys} className="d-f ai-c jc-sb g-3">
									<span
										className="px-2 py-1 bw-1 bs-s fs-xs ff-m ws-nw"
										style={{
											borderColor: colors.border,
											color: colors.accentDim,
											backgroundColor: colors.page,
										}}
									>
										{keys}
									</span>
									<span
										className="fs-xs ff-m ta-r"
										style={{ color: colors.accentDim }}
									>
										{description}
									</span>
								</div>
							))}
						</div>
					</div>

					<div
						className="d-f jc-fe px-4 py-3 btw-1 bs-s"
						style={{ borderColor: colors.border }}
					>
						<Button
							onClick={() => onOpenChange(false)}
							className="px-3 py-1 bw-1 bs-s fs-xs ff-m us-none c-p fv:os-s fv:oo-2 fv:oc-accent"
							style={{
								backgroundColor: doneHovered ? colors.accent : "transparent",
								borderColor: doneHovered ? colors.accent : colors.border,
								color: doneHovered ? colors.onAccent : colors.accentDim,
							}}
							{...doneHoverHandlers}
						>
							Got it
						</Button>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export function useOnboarding() {
	const [open, setOpen] = useState(() => !hasSeenOnboarding());
	return { open, setOpen };
}
