import { Input } from "@base-ui/react/input";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { patternLineColor } from "../lib/color";
import type { LanguageId } from "../lib/highlighter";
import { LANGUAGES } from "../lib/highlighter";
import type { AspectRatio, BackgroundPattern } from "../lib/types";
import { CodeEditor } from "./code-editor";
import type { CornerRadii } from "./inspector";
import { RATIO_VALUES } from "./ratio-control";

export interface FrameColors {
	page: string;
	surface: string;
	border: string;
	accentDim: string;
	tabBar: string;
	tabActive: string;
	statusBarBg: string;
	statusBarText: string;
	activeTabBorder: string;
}

// Diagonal hatch texture. The line color is derived from the page color
// itself (not the independently-editable border color) so it always stays
// visible, live, no matter what page color is picked.
function getPatternStyle(
	pattern: BackgroundPattern,
	page: string,
): React.CSSProperties | null {
	const line = patternLineColor(page);
	switch (pattern) {
		case "stripes-right":
			return {
				backgroundImage: `repeating-linear-gradient(45deg, transparent 0, transparent 7px, ${line} 7px, ${line} 9px)`,
				backgroundColor: page,
			};
		case "stripes-left":
			return {
				backgroundImage: `repeating-linear-gradient(-45deg, transparent 0, transparent 7px, ${line} 7px, ${line} 9px)`,
				backgroundColor: page,
			};
	}
}

export const Frame = forwardRef<
	HTMLDivElement,
	{
		code: string;
		onCodeChange: (value: string) => void;
		language: LanguageId;
		fileName: string;
		onFileNameChange: (value: string) => void;
		showTabBar: boolean;
		showStatusBar: boolean;
		showGridLines: boolean;
		showBackgroundPattern: boolean;
		showActiveTabBorder: boolean;
		background: BackgroundPattern;
		radii: CornerRadii;
		padding: number;
		ratio: AspectRatio;
		fontFamily?: string;
		themeName: string;
		colors: FrameColors;
		codeRef?: React.Ref<HTMLDivElement>;
	}
>(function Frame(
	{
		code,
		onCodeChange,
		language,
		fileName,
		onFileNameChange,
		showTabBar,
		showStatusBar,
		showGridLines,
		showBackgroundPattern,
		showActiveTabBorder,
		background,
		radii,
		padding,
		ratio,
		fontFamily,
		themeName,
		colors,
		codeRef,
	},
	ref,
) {
	const fontStyle = fontFamily ? { fontFamily } : undefined;
	const borderRadius = `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`;
	const patternStyle = getPatternStyle(background, colors.page);
	const innerRef = useRef<HTMLDivElement>(null);
	const [ratioPadding, setRatioPadding] = useState({ x: 0, y: 0 });

	// A specific ratio letterboxes the padded content instead of scaling or
	// cropping it - extra space is added on whichever axis is needed to hit
	// the target ratio, so the code is never clipped regardless of how long
	// the snippet is.
	useLayoutEffect(() => {
		const node = innerRef.current;
		if (!node) return;
		if (ratio === "auto") {
			setRatioPadding({ x: 0, y: 0 });
			return;
		}
		const targetRatio = RATIO_VALUES[ratio];

		function recompute() {
			if (!node) return;
			const rect = node.getBoundingClientRect();
			const paddedWidth = rect.width + padding * 2;
			const paddedHeight = rect.height + padding * 2;
			if (paddedWidth / paddedHeight < targetRatio) {
				const targetWidth = paddedHeight * targetRatio;
				setRatioPadding({
					x: Math.max(0, (targetWidth - paddedWidth) / 2),
					y: 0,
				});
			} else {
				const targetHeight = paddedWidth / targetRatio;
				setRatioPadding({
					x: 0,
					y: Math.max(0, (targetHeight - paddedHeight) / 2),
				});
			}
		}

		recompute();
		const observer = new ResizeObserver(recompute);
		observer.observe(node);
		return () => observer.disconnect();
	}, [ratio, padding]);

	const bleed = padding / 4;

	return (
		<div
			ref={ref}
			className="p-r min-w-0"
			style={{
				paddingTop: padding + ratioPadding.y,
				paddingBottom: padding + ratioPadding.y,
				paddingLeft: padding + ratioPadding.x,
				paddingRight: padding + ratioPadding.x,
				backgroundColor: colors.page,
			}}
		>
			<div
				ref={innerRef}
				className="p-r zi-10 w-192 max-w-100% o-v"
				style={{ backgroundColor: colors.surface, borderRadius }}
			>
				{showBackgroundPattern && patternStyle && (
					<div
						className="p-a o-h zi--10"
						style={{
							...patternStyle,
							top: -bleed,
							right: -bleed,
							bottom: -bleed,
							left: -bleed,
						}}
						aria-hidden="true"
					/>
				)}

				{showGridLines && (
					<>
						<div
							className="p-a t-0 h-px"
							style={{
								backgroundColor: colors.border,
								left: -bleed,
								right: -bleed,
							}}
							aria-hidden="true"
						/>
						<div
							className="p-a b-0 h-px"
							style={{
								backgroundColor: colors.border,
								left: -bleed,
								right: -bleed,
							}}
							aria-hidden="true"
						/>
						<div
							className="p-a l-0 w-px"
							style={{
								backgroundColor: colors.border,
								top: -bleed,
								bottom: -bleed,
							}}
							aria-hidden="true"
						/>
						<div
							className="p-a r-0 w-px"
							style={{
								backgroundColor: colors.border,
								top: -bleed,
								bottom: -bleed,
							}}
							aria-hidden="true"
						/>
					</>
				)}

				<div
					className="d-f bw-1 bs-s o-h"
					style={{
						backgroundColor: colors.surface,
						borderColor: colors.border,
						borderRadius,
					}}
				>
					<div className="f-1 min-w-0 min-h-0">
						<div
							className={`frame-collapsible ${showTabBar ? "frame-collapsible-open" : ""}`}
						>
							<div className="o-h min-h-0">
								<div
									className="d-f ai-c bbw-1 bs-s"
									style={{
										backgroundColor: colors.tabBar,
										borderColor: colors.border,
									}}
								>
									<div
										className={`d-f ai-c g-2 px-4 py-3 bs-s ${showActiveTabBorder ? "bbw-2" : "bbw-0"}`}
										style={{
											backgroundColor: colors.tabActive,
											borderColor: showActiveTabBorder
												? colors.activeTabBorder
												: "transparent",
										}}
									>
										<Input
											value={fileName}
											onChange={(event) => onFileNameChange(event.target.value)}
											spellCheck={false}
											placeholder="Untitled-1"
											className="ff-m fs-sm bg-transparent bw-0 os-none p-0 w-fc"
											style={{ color: colors.accentDim, ...fontStyle }}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="p-4">
							<CodeEditor
								code={code}
								onCodeChange={onCodeChange}
								language={language}
								themeName={themeName}
								fontFamily={fontFamily}
								background={colors.surface}
								codeRef={codeRef}
							/>
						</div>

						<div
							className={`frame-collapsible ${showStatusBar ? "frame-collapsible-open" : ""}`}
						>
							<div className="o-h min-h-0">
								<div
									className="d-f ai-c jc-fe px-4 py-2 btw-1 bs-s"
									style={{
										backgroundColor: colors.statusBarBg,
										borderColor: colors.border,
									}}
								>
									<span
										className="ff-m fs-xs fw-700"
										style={{ color: colors.statusBarText, ...fontStyle }}
									>
										{LANGUAGES[language]}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
