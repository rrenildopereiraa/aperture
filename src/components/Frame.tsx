import { forwardRef } from "react";
import type { LanguageId } from "../lib/highlighter";
import { LANGUAGES } from "../lib/highlighter";
import { CodeEditor } from "./CodeEditor";

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
	}
>(function Frame({ code, onCodeChange, language, fileName, onFileNameChange }, ref) {
	const lineCount = code.split("\n").length;

	return (
		<div ref={ref} className="p-r min-w-0 bg-page" style={{ padding: FRAME_PADDING }}>
			<div className="p-r zi-10 w-192 max-w-100% bg-surface o-v">
				{/* Hatch texture */}
				<div className="p-a t--16 r--16 b--16 l--16 o-h zi--10 bg-page" style={hatchStyle} aria-hidden="true" />

				{/* Grid lines */}
				<div className="p-a t-0 l--16 r--16 h-px bg-border" aria-hidden="true" />
				<div className="p-a b-0 l--16 r--16 h-px bg-border" aria-hidden="true" />
				<div className="p-a l-0 t--16 b--16 w-px bg-border" aria-hidden="true" />
				<div className="p-a r-0 t--16 b--16 w-px bg-border" aria-hidden="true" />

				<div className="d-f bg-surface bw-1 bs-s bc-border o-h">
					<div className="d-f fd-c ai-c g-3 w-10 py-4 brw-1 bs-s bc-border">
						<span className="w-2 h-2 bg-accent-dim" aria-hidden="true" />
						<span className="w-2 h-2 bg-accent-dim/50" aria-hidden="true" />
						<span className="w-2 h-2 bg-accent-dim/25" aria-hidden="true" />
					</div>

					<div className="f-1 min-w-0">
						{/* Tab bar */}
						<div className="d-f ai-c bbw-1 bs-s bc-border bg-page">
							<div className="d-f ai-c g-2 px-4 bg-surface py-3 bbw-2 bs-s bc-accent">
								<input
									value={fileName}
									onChange={(event) => onFileNameChange(event.target.value)}
									spellCheck={false}
									placeholder="Untitled-1"
									className="ff-m fs-sm c-accent-dim bg-transparent bw-0 os-none p-0 w-fc"
								/>
							</div>
						</div>

						{/* Code body */}
						<div className="p-4">
							<CodeEditor code={code} onCodeChange={onCodeChange} language={language} />
						</div>

						{/* Status bar */}
						<div className="d-f ai-c jc-fe px-4 py-2 btw-1 bs-s bc-border">
							<span className="ff-m fs-xs c-accent-dim">
								{LANGUAGES[language]} · {lineCount} {lineCount === 1 ? "line" : "lines"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
