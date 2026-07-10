import { Input } from "@base-ui/react/input";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef } from "react";
import type { LanguageId } from "../lib/highlighter";
import { LANGUAGES } from "../lib/highlighter";
import { CodeEditor } from "./CodeEditor";
import type { CornerRadii } from "./Inspector";
import type { Background } from "./Toolbar";

// Diagonal hatch texture
const hatchStyle = {
	backgroundImage:
		"repeating-linear-gradient(45deg, transparent 0, transparent 7px, #23274180 7px, #23274180 9px)",
};

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
		showHashtagLines: boolean;
		background: Background;
		radii: CornerRadii;
		font?: string;
		themeName: string;
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
		showHashtagLines,
		background,
		radii,
		font,
		themeName,
	},
	ref,
) {
	const fontStyle = font ? { fontFamily: font } : undefined;
	// CSS border-radius shorthand order: TL TR BR BL
	const borderRadius = `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`;

	return (
		<div
			ref={ref}
			className="p-r min-w-0 bg-page"
			style={{ padding: FRAME_PADDING }}
		>
			<div
				className="p-r zi-10 w-192 max-w-100% bg-surface o-v"
				style={{ borderRadius }}
			>
				{/* Hatch texture - "stripes" background only; "solid" leaves the
				    plain bg-page backdrop */}
				{background === "stripes" && (
					<div
						className="p-a t--16 r--16 b--16 l--16 o-h zi--10 bg-page"
						style={hatchStyle}
						aria-hidden="true"
					/>
				)}

				{/* Grid lines */}
				{showHashtagLines && (
					<>
						<div
							className="p-a t-0 l--16 r--16 h-px bg-border"
							aria-hidden="true"
						/>
						<div
							className="p-a b-0 l--16 r--16 h-px bg-border"
							aria-hidden="true"
						/>
						<div
							className="p-a l-0 t--16 b--16 w-px bg-border"
							aria-hidden="true"
						/>
						<div
							className="p-a r-0 t--16 b--16 w-px bg-border"
							aria-hidden="true"
						/>
					</>
				)}

				<div
					className="d-f bg-surface bw-1 bs-s bc-border o-h"
					style={{ borderRadius }}
				>
					<div className="f-1 min-w-0">
						<AnimatePresence>
							{showTabBar && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.15, ease: "easeOut" }}
									className="o-h"
								>
									<div className="d-f ai-c bbw-1 bs-s bc-border bg-page">
										<div className="d-f ai-c g-2 px-4 bg-surface py-3 bbw-2 bs-s bc-accent">
											<Input
												value={fileName}
												onChange={(event) =>
													onFileNameChange(event.target.value)
												}
												spellCheck={false}
												placeholder="Untitled-1"
												className="ff-m fs-sm c-accent-dim bg-transparent bw-0 os-none p-0 w-fc"
												style={fontStyle}
											/>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Code body */}
						<div className="p-4">
							<CodeEditor
								code={code}
								onCodeChange={onCodeChange}
								language={language}
								themeName={themeName}
								font={font}
							/>
						</div>

						<AnimatePresence>
							{showStatusBar && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.15, ease: "easeOut" }}
									className="o-h"
								>
									<div className="d-f ai-c jc-fe px-4 py-2 btw-1 bs-s bc-border">
										<span className="ff-m fs-xs c-accent-dim" style={fontStyle}>
											{LANGUAGES[language]}
										</span>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
});
