import { useCallback, useEffect, useRef, useState } from "react";
import { contrastColor, overlayColor } from "../lib/color";
import { getHighlighter, type LanguageId } from "../lib/highlighter";
import type {
	HighlightedLine,
	HighlightedWord,
	HighlightType,
} from "../lib/types";

const TAB = "\t";

export interface HighlightColors {
	mark: string;
	add: string;
	remove: string;
}

function lineElementAt(
	clientX: number,
	clientY: number,
): HTMLElement | undefined {
	return document
		.elementsFromPoint(clientX, clientY)
		.find(
			(el): el is HTMLElement =>
				el instanceof HTMLElement && el.dataset.lineIndex !== undefined,
		);
}

function tokenElementAt(
	clientX: number,
	clientY: number,
): HTMLElement | undefined {
	return document
		.elementsFromPoint(clientX, clientY)
		.find(
			(el): el is HTMLElement =>
				el instanceof HTMLElement && el.dataset.tokenIndex !== undefined,
		);
}

function CodeLine({
	lineIndex,
	line,
	lineTokens,
	highlightType,
	isPreview,
	highlightedWords,
	highlightColors,
}: {
	lineIndex: number;
	line: string;
	lineTokens: { content: string; color?: string }[];
	highlightType: HighlightType | undefined;
	isPreview: boolean;
	highlightedWords: HighlightedWord[];
	highlightColors: HighlightColors;
}) {
	const lineBackground = highlightType
		? overlayColor(highlightColors[highlightType], 0.16)
		: isPreview
			? overlayColor(highlightColors.mark, 0.08)
			: undefined;

	return (
		<div
			data-line-index={lineIndex}
			className="ws-pw d-b mx--4 px-4"
			style={lineBackground ? { backgroundColor: lineBackground } : undefined}
		>
			{/* Fall back to the plain line while Shiki tokens load, so
			    lines keep their real height from the first paint */}
			{lineTokens.map((token, tokenIndex) => {
				const wordHighlight = highlightedWords.find(
					(w) => w.line === lineIndex && w.tokenIndex === tokenIndex,
				);
				return (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: index is stable, tokens are purely positional within a line
						key={tokenIndex}
						data-token-index={tokenIndex}
						style={{
							color: token.color,
							...(wordHighlight
								? {
										backgroundColor: overlayColor(
											highlightColors[wordHighlight.type],
											0.2,
										),
										borderColor: overlayColor(
											highlightColors[wordHighlight.type],
											0.6,
										),
									}
								: {}),
						}}
						className={wordHighlight ? "bw-1" : ""}
					>
						{token.content}
					</span>
				);
			})}
			{line.length === 0 && " "}
		</div>
	);
}

export function CodeEditor({
	code,
	onCodeChange,
	language,
	themeName,
	fontFamily,
	background,
	highlightedLines,
	highlightedWords,
	onCycleLineHighlight,
	onSetLineRangeHighlight,
	onCycleWordHighlight,
	textareaRef,
	highlightColors,
}: {
	code: string;
	onCodeChange: (value: string) => void;
	language: LanguageId;
	themeName: string;
	fontFamily?: string;
	background: string;
	highlightedLines: HighlightedLine[];
	highlightedWords: HighlightedWord[];
	onCycleLineHighlight: (line: number) => void;
	onSetLineRangeHighlight: (startLine: number, endLine: number) => void;
	onCycleWordHighlight: (line: number, tokenIndex: number) => void;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	highlightColors: HighlightColors;
}) {
	const [tokens, setTokens] = useState<{ content: string; color?: string }[][]>(
		[],
	);
	const [altHoverLine, setAltHoverLine] = useState<number | null>(null);
	const [dragPreview, setDragPreview] = useState<{
		start: number;
		end: number;
	} | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const dragStartLineRef = useRef<number | null>(null);
	const dragMovedRef = useRef(false);
	const dragPreviewRef = useRef(dragPreview);
	dragPreviewRef.current = dragPreview;

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

	const finishDrag = useCallback(() => {
		const startLine = dragStartLineRef.current;
		const preview = dragPreviewRef.current;
		if (startLine !== null) {
			if (dragMovedRef.current && preview) {
				onSetLineRangeHighlight(
					Math.min(preview.start, preview.end),
					Math.max(preview.start, preview.end),
				);
			} else {
				onCycleLineHighlight(startLine);
			}
		}
		dragStartLineRef.current = null;
		dragMovedRef.current = false;
		setDragPreview(null);
		setDragActive(false);
	}, [onCycleLineHighlight, onSetLineRangeHighlight]);

	// Alt+drag across lines previews and commits a whole range at once (all
	// set to "mark", or cleared if the range is already uniformly marked).
	// A plain Alt+click (no movement) instead cycles that single line through
	// mark -> add -> remove -> off. Tracked with window-level listeners so the
	// drag keeps working even if the cursor leaves the textarea mid-gesture.
	useEffect(() => {
		if (!dragActive) return;
		const handleWindowMouseMove = (event: MouseEvent) => {
			const lineEl = lineElementAt(event.clientX, event.clientY);
			if (!lineEl) return;
			const line = Number(lineEl.dataset.lineIndex);
			const startLine = dragStartLineRef.current;
			if (startLine === null) return;
			if (line !== startLine) dragMovedRef.current = true;
			setDragPreview({ start: startLine, end: line });
		};
		const handleWindowMouseUp = () => finishDrag();
		window.addEventListener("mousemove", handleWindowMouseMove);
		window.addEventListener("mouseup", handleWindowMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleWindowMouseMove);
			window.removeEventListener("mouseup", handleWindowMouseUp);
		};
	}, [dragActive, finishDrag]);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLTextAreaElement>) => {
			if (dragActive || !event.altKey || event.shiftKey) {
				setAltHoverLine(null);
				return;
			}
			const lineEl = lineElementAt(event.clientX, event.clientY);
			setAltHoverLine(lineEl ? Number(lineEl.dataset.lineIndex) : null);
		},
		[dragActive],
	);

	const handleMouseLeave = useCallback(() => setAltHoverLine(null), []);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLTextAreaElement>) => {
			if (!event.altKey) return;
			event.preventDefault();
			const lineEl = lineElementAt(event.clientX, event.clientY);
			if (!lineEl) return;
			const line = Number(lineEl.dataset.lineIndex);

			// Alt+Shift+Click highlights a single word instead of a line.
			if (event.shiftKey) {
				const tokenEl = tokenElementAt(event.clientX, event.clientY);
				if (tokenEl) {
					onCycleWordHighlight(line, Number(tokenEl.dataset.tokenIndex));
				}
				return;
			}

			setAltHoverLine(null);
			dragStartLineRef.current = line;
			dragMovedRef.current = false;
			setDragPreview({ start: line, end: line });
			setDragActive(true);
		},
		[onCycleWordHighlight],
	);

	return (
		<div className="p-r ff-m fs-sm lh-4" style={editorStyle}>
			{lines.map((line, lineIndex) => {
				const committed = highlightedLines.find((h) => h.line === lineIndex);
				const inDragRange =
					dragPreview &&
					lineIndex >= Math.min(dragPreview.start, dragPreview.end) &&
					lineIndex <= Math.max(dragPreview.start, dragPreview.end);
				return (
					<CodeLine
						// biome-ignore lint/suspicious/noArrayIndexKey: index is stable, lines are purely positional
						key={lineIndex}
						lineIndex={lineIndex}
						line={line}
						lineTokens={
							tokens[lineIndex] ?? [{ content: line, color: undefined }]
						}
						highlightType={
							inDragRange && dragMovedRef.current ? "mark" : committed?.type
						}
						isPreview={
							!committed && (inDragRange || altHoverLine === lineIndex)
						}
						highlightedWords={highlightedWords}
						highlightColors={highlightColors}
					/>
				);
			})}
			<textarea
				value={code}
				onChange={(event) => onCodeChange(event.target.value)}
				spellCheck={false}
				autoCapitalize="off"
				autoCorrect="off"
				ref={textareaRef}
				onKeyDown={handleKeyDown}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onMouseDown={handleMouseDown}
				className="p-a t-0 l-0 w-100% h-100% p-0 m-0 bg-transparent c-transparent bw-0 os-none o-h r-none ff-m fs-sm lh-4 ws-pw"
				style={{ ...editorStyle, caretColor }}
			/>
		</div>
	);
}
