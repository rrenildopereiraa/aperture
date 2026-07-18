import { useCallback, useEffect, useRef, useState } from "react";
import { contrastColor } from "../lib/color";
import { getHighlighter, type LanguageId } from "../lib/highlighter";

const TAB = "\t";

export function CodeEditor({
	code,
	onCodeChange,
	language,
	themeName,
	fontFamily,
	background,
}: {
	code: string;
	onCodeChange: (value: string) => void;
	language: LanguageId;
	themeName: string;
	fontFamily?: string;
	background: string;
}) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [tokens, setTokens] = useState<{ content: string; color?: string }[][]>(
		[],
	);

	useEffect(() => {
		let cancelled = false;
		getHighlighter().then((highlighter) => {
			if (cancelled) return;
			const lang = language === "mjs" ? "javascript" : language;
			const result = highlighter.codeToTokens(code, {
				lang,
				theme: themeName,
			});
			setTokens(result.tokens);
		});
		return () => {
			cancelled = true;
		};
	}, [code, language, themeName]);

	const lines = code.split("\n");
	const editorStyle = {
		tabSize: 2,
		...(fontFamily ? { fontFamily } : {}),
	};
	const caretColor = contrastColor(background);

	const setSelection = useCallback(
		(textarea: HTMLTextAreaElement, start: number, end: number) => {
			// The textarea is controlled, so the value updates on re-render;
			// restore the caret afterwards.
			requestAnimationFrame(() => {
				textarea.selectionStart = start;
				textarea.selectionEnd = end;
			});
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key !== "Tab") return;
			event.preventDefault();
			const textarea = event.currentTarget;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const dedent = event.shiftKey;

			// Plain Tab with no selection: insert a single indent at the caret.
			if (!dedent && start === end) {
				const next = code.slice(0, start) + TAB + code.slice(end);
				onCodeChange(next);
				setSelection(textarea, start + TAB.length, start + TAB.length);
				return;
			}

			// Otherwise indent/dedent every line the selection touches.
			const firstLineStart = code.lastIndexOf("\n", start - 1) + 1;
			const nextBreak = code.indexOf("\n", end);
			const regionEnd = nextBreak === -1 ? code.length : nextBreak;
			const regionLines = code.slice(firstLineStart, regionEnd).split("\n");

			let firstDelta = 0;
			let totalDelta = 0;
			const transformed = regionLines.map((line, index) => {
				if (dedent) {
					const cut = line.startsWith(TAB)
						? 1
						: (line.match(/^ {1,2}/)?.[0].length ?? 0);
					if (index === 0) firstDelta = -cut;
					totalDelta -= cut;
					return line.slice(cut);
				}
				if (index === 0) firstDelta = TAB.length;
				totalDelta += TAB.length;
				return TAB + line;
			});

			const next =
				code.slice(0, firstLineStart) +
				transformed.join("\n") +
				code.slice(regionEnd);
			onCodeChange(next);
			setSelection(
				textarea,
				Math.max(firstLineStart, start + firstDelta),
				end + totalDelta,
			);
		},
		[code, onCodeChange, setSelection],
	);

	return (
		<div className="p-r ff-m fs-sm lh-4" style={editorStyle}>
			{lines.map((line, lineIndex) => (
				// biome-ignore lint: index is stable, lines are purely positional
				<div key={lineIndex} className="ws-pw">
					{/* Fall back to the plain line while Shiki tokens load, so
					    lines keep their real height from the first paint */}
					{(tokens[lineIndex] ?? [{ content: line, color: undefined }]).map(
						(token, tokenIndex) => (
							// biome-ignore lint: index is stable, tokens are purely positional within a line
							<span key={tokenIndex} style={{ color: token.color }}>
								{token.content}
							</span>
						),
					)}
					{line.length === 0 && " "}
				</div>
			))}
			<textarea
				value={code}
				onChange={(event) => onCodeChange(event.target.value)}
				spellCheck={false}
				autoCapitalize="off"
				autoCorrect="off"
				ref={textareaRef}
				onKeyDown={handleKeyDown}
				className="p-a t-0 l-0 w-100% h-100% p-0 m-0 bg-transparent c-transparent bw-0 os-none o-h r-none ff-m fs-sm lh-4 ws-pw"
				style={{ ...editorStyle, caretColor }}
			/>
		</div>
	);
}
