import { Input } from "@base-ui/react/input";
import { forwardRef } from "react";
import type { LanguageId } from "../lib/highlighter";
import { LANGUAGES } from "../lib/highlighter";
import type { Background } from "../lib/types";
import { CodeEditor } from "./code-editor";
import type { CornerRadii } from "./inspector";

export interface FrameColors {
	page: string;
	surface: string;
	border: string;
	accentDim: string;
	tabBar: string;
	tabActive: string;
	statusBarBg: string;
	activeTabBorder: string;
}

// Diagonal hatch texture
const hatchBackground = (border: string) =>
	`repeating-linear-gradient(45deg, transparent 0, transparent 7px, ${border}80 7px, ${border}80 9px)`;

const FRAME_PADDING = 64;

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
		showActiveTabBorder: boolean;
		background: Background;
		radii: CornerRadii;
		font?: string;
		themeName: string;
		colors: FrameColors;
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
		showActiveTabBorder,
		background,
		radii,
		font,
		themeName,
		colors,
	},
	ref,
) {
	const fontStyle = font ? { fontFamily: font } : undefined;
	const borderRadius = `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`;

	return (
		<div
			ref={ref}
			className="p-r min-w-0"
			style={{ padding: FRAME_PADDING, backgroundColor: colors.page }}
		>
			<div
				className="p-r zi-10 w-192 max-w-100% o-v"
				style={{ backgroundColor: colors.surface, borderRadius }}
			>
				{background === "stripes" && (
					<div
						className="p-a t--16 r--16 b--16 l--16 o-h zi--10"
						style={{
							backgroundImage: hatchBackground(colors.border),
							backgroundColor: colors.page,
						}}
						aria-hidden="true"
					/>
				)}

				{showGridLines && (
					<>
						<div
							className="p-a t-0 l--16 r--16 h-px"
							style={{ backgroundColor: colors.border }}
							aria-hidden="true"
						/>
						<div
							className="p-a b-0 l--16 r--16 h-px"
							style={{ backgroundColor: colors.border }}
							aria-hidden="true"
						/>
						<div
							className="p-a l-0 t--16 b--16 w-px"
							style={{ backgroundColor: colors.border }}
							aria-hidden="true"
						/>
						<div
							className="p-a r-0 t--16 b--16 w-px"
							style={{ backgroundColor: colors.border }}
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
					<div className="f-1 min-w-0">
						{showTabBar && (
							<div className="o-h">
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
						)}

						<div className="p-4">
							<CodeEditor
								code={code}
								onCodeChange={onCodeChange}
								language={language}
								themeName={themeName}
								font={font}
							/>
						</div>

						{showStatusBar && (
							<div className="o-h">
								<div
									className="d-f ai-c jc-fe px-4 py-2 btw-1 bs-s"
									style={{
										backgroundColor: colors.statusBarBg,
										borderColor: colors.border,
									}}
								>
									<span
										className="ff-m fs-xs c-accent h:c-white tds-u fw-700"
										style={fontStyle}
									>
										{LANGUAGES[language]}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});
