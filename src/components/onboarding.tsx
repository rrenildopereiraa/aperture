import { Button } from "@base-ui/react/button";
import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useChromeTheme, useHover } from "../lib/chrome-theme";
import { overlayColor } from "../lib/color";
import { getHighlighter } from "../lib/highlighter";
import { modLabel } from "../lib/platform";
import type { HighlightType } from "../lib/types";
import type { FrameColors } from "./frame";

const STORAGE_KEY = "prisharp-onboarding-seen";

// The mouse gestures are the only genuinely undiscoverable part of the app -
// there's no affordance on screen hinting that Alt does anything - so those
// lead. Everything below them is reachable from the command palette anyway.
const SHORTCUTS: { keys: string; description: string }[] = [
	{ keys: "Alt + click", description: "Highlight a line" },
	{ keys: "Alt + drag", description: "Highlight a range of lines" },
	{ keys: "Alt + Shift + drag", description: "Highlight exact text" },
	{ keys: "click again", description: "Cycle mark → add → remove → off" },
	{ keys: `${modLabel} K`, description: "Open the command palette" },
	{ keys: `${modLabel} S`, description: "Export" },
];

const PREVIEW_CODE = `export function shuffle(items) {
	const arr = [...items];
	for (let i = arr.length - 1; i > 0; i--) {
		swap(arr, i, randomIndex(i));
	}
	return arr;
}`;

// Mirrors what the real editor would render after a few highlight
// gestures, so the preview is an honest sample rather than a drawing:
// a marked range, an added line, and a single highlighted word.
const PREVIEW_LINES: Record<number, HighlightType> = { 2: "mark", 3: "add" };
const PREVIEW_WORD = {
	line: 1,
	startCol: 7,
	endCol: 10,
	type: "mark" as const,
};

export function hasSeenOnboarding(): boolean {
	if (typeof window === "undefined") return true;
	return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function CodePreview({
	frameColors,
	themeName,
}: {
	frameColors: FrameColors;
	themeName: string;
}) {
	const [tokens, setTokens] = useState<{ content: string; color?: string }[][]>(
		[],
	);

	useEffect(() => {
		let cancelled = false;
		getHighlighter().then((highlighter) => {
			if (cancelled) return;
			setTokens(
				highlighter.codeToTokens(PREVIEW_CODE, {
					lang: "javascript",
					theme: themeName,
				}).tokens,
			);
		});
		return () => {
			cancelled = true;
		};
	}, [themeName]);

	const lines = PREVIEW_CODE.split("\n");

	return (
		<div
			className="w-100% max-w-120 bw-1 bs-s o-h"
			style={{
				backgroundColor: frameColors.surface,
				borderColor: frameColors.border,
			}}
		>
			<div
				className="d-f ai-c px-3 py-2 bbw-1 bs-s"
				style={{
					backgroundColor: frameColors.tabBar,
					borderColor: frameColors.border,
				}}
			>
				<span className="ff-m fs-xs" style={{ color: frameColors.accentDim }}>
					shuffle.js
				</span>
			</div>
			<div className="p-4 ff-m fs-xs lh-4 ox-auto">
				{lines.map((line, lineIndex) => {
					const lineType = PREVIEW_LINES[lineIndex];
					const lineTokens = tokens[lineIndex] ?? [
						{ content: line, color: undefined },
					];
					let col = 0;
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: lines are purely positional
							key={lineIndex}
							className="ws-pw d-b mx--4 px-4"
							style={
								lineType
									? {
											backgroundColor: overlayColor(
												frameColors[
													lineType === "mark"
														? "highlightMark"
														: lineType === "add"
															? "highlightAdd"
															: "highlightRemove"
												],
												0.16,
											),
										}
									: undefined
							}
						>
							{lineTokens.map((token, tokenIndex) => {
								const start = col;
								col += token.content.length;
								const isWord =
									lineIndex === PREVIEW_WORD.line &&
									start >= PREVIEW_WORD.startCol &&
									start < PREVIEW_WORD.endCol;
								return (
									<span
										// biome-ignore lint/suspicious/noArrayIndexKey: tokens are purely positional within a line
										key={tokenIndex}
										className={isWord ? "bw-1" : ""}
										style={{
											color: token.color,
											...(isWord
												? {
														backgroundColor: overlayColor(
															frameColors.highlightMark,
															0.2,
														),
														borderColor: overlayColor(
															frameColors.highlightMark,
															0.6,
														),
													}
												: {}),
										}}
									>
										{token.content}
									</span>
								);
							})}
							{line.length === 0 && " "}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function Onboarding({
	open,
	onOpenChange,
	frameColors,
	themeName,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	frameColors: FrameColors;
	themeName: string;
}) {
	const { colors } = useChromeTheme();
	const { hovered: closeHovered, hoverHandlers: closeHoverHandlers } =
		useHover();
	const { hovered: startHovered, hoverHandlers: startHoverHandlers } =
		useHover();
	// Drives a staggered entrance; flipped on shortly after mount so the
	// first paint still has everything in its "before" state.
	//
	// This deliberately uses a timer rather than requestAnimationFrame:
	// rAF does not fire while the document is hidden, so opening the app in
	// a background tab would leave every animated row stuck at opacity 0
	// forever (the effect only re-runs when `open` changes). A timer fires
	// regardless, so the worst case is the transition being skipped - never
	// invisible content.
	const [entered, setEntered] = useState(false);

	useEffect(() => {
		if (!open) {
			setEntered(false);
			return;
		}
		window.localStorage.setItem(STORAGE_KEY, "true");
		const timer = setTimeout(() => setEntered(true), 20);
		return () => clearTimeout(timer);
	}, [open]);

	function entranceStyle(index: number): React.CSSProperties {
		return {
			opacity: entered ? 1 : 0,
			transform: entered ? "translateY(0)" : "translateY(6px)",
			transition: `opacity 300ms ease ${index * 45}ms, transform 300ms ease ${index * 45}ms`,
		};
	}

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal keepMounted>
				<Dialog.Backdrop
					className="p-f i-0 zi-80"
					style={{ backgroundColor: colors.page }}
				/>
				<Dialog.Popup
					className="p-f i-0 zi-90 d-f fd-c @lg:fd-r"
					style={{ backgroundColor: colors.page }}
				>
					<Dialog.Close
						aria-label="Close"
						className="p-a t-4 r-4 zi-10 d-f ai-c jc-c w-8 h-8 p-0 bg-transparent bw-0 c-p fv:os-s fv:oo-2 fv:oc-accent"
						style={{ color: closeHovered ? colors.accent : colors.accentDim }}
						{...closeHoverHandlers}
					>
						<XIcon size={16} weight="bold" />
					</Dialog.Close>

					<div className="f-1 d-f fd-c jc-c g-4 px-6 @lg:px-12 py-8 min-w-0">
						<div style={entranceStyle(0)}>
							<Dialog.Title
								className="fs-3xl ff-m fw-700 us-none m-0"
								style={{ color: colors.accentDim }}
							>
								Pri<span style={{ color: colors.accent }}>sharp</span>
							</Dialog.Title>
							<p
								className="fs-sm ff-m mt-2 m-0"
								style={{ color: colors.accentDim }}
							>
								Beautiful code screenshots, fully yours to style.
								<br />
								Highlighting lives on the Alt key.
							</p>
						</div>

						<div className="d-f fd-c g-2">
							{SHORTCUTS.map(({ keys, description }, index) => (
								<div
									key={keys}
									className="d-f ai-c g-3"
									style={entranceStyle(index + 1)}
								>
									<span
										className="px-2 py-1 bw-1 bs-s fs-xs ff-m ws-nw ta-c"
										style={{
											borderColor: colors.border,
											color: colors.accentDim,
											backgroundColor: colors.surface,
											minWidth: 132,
										}}
									>
										{keys}
									</span>
									<span
										className="fs-xs ff-m"
										style={{ color: colors.accentDim }}
									>
										{description}
									</span>
								</div>
							))}
						</div>

						<div style={entranceStyle(SHORTCUTS.length + 1)}>
							<Button
								onClick={() => onOpenChange(false)}
								className="d-f ai-c g-2 px-4 py-2 bw-1 bs-s fs-sm ff-m us-none c-p fv:os-s fv:oo-2 fv:oc-accent"
								style={{
									backgroundColor: startHovered ? colors.accent : "transparent",
									borderColor: startHovered ? colors.accent : colors.border,
									color: startHovered ? colors.onAccent : colors.accentDim,
								}}
								{...startHoverHandlers}
							>
								Start →
							</Button>
						</div>
					</div>

					<div
						className="d-none @lg:d-f f-1 ai-c jc-c p-8 blw-1 bs-s min-w-0"
						style={{
							backgroundColor: colors.surface,
							borderColor: colors.border,
						}}
					>
						<div
							className="w-100% d-f jc-c"
							style={entranceStyle(SHORTCUTS.length + 2)}
						>
							<CodePreview frameColors={frameColors} themeName={themeName} />
						</div>
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
