import { useCallback, useEffect, useRef, useState } from "react";
import { getHighlighter, type LanguageId } from "../lib/highlighter";

export function CodeEditor({
	code,
	onCodeChange,
	language,
	themeName,
	font,
}: {
	code: string;
	onCodeChange: (value: string) => void;
	language: LanguageId;
	themeName: string;
	font?: string;
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
	const fontStyle = font ? { fontFamily: font } : undefined;

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key !== "Tab") return;
			event.preventDefault();
			const textarea = event.currentTarget;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const next = `${code.slice(0, start)}\t${code.slice(end)}`;
			onCodeChange(next);
			requestAnimationFrame(() => {
				textarea.selectionStart = start + 1;
				textarea.selectionEnd = start + 1;
			});
		},
		[code, onCodeChange],
	);

	return (
		<div className="p-r ff-m fs-sm lh-4" style={fontStyle}>
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
				className="p-a t-0 l-0 w-100% h-100% p-0 m-0 bg-transparent c-transparent cc-accent bw-0 os-none o-h r-none ff-m fs-sm lh-4 ws-pw"
				style={fontStyle}
			/>
		</div>
	);
}
