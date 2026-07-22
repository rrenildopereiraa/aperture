import type { LanguageId } from "./highlighter";

export type BackgroundPattern = "stripes-right" | "stripes-left";

export const MAX_DOCUMENTS = 5;

export type HighlightType = "mark" | "add" | "remove";

export interface HighlightedLine {
	line: number;
	type: HighlightType;
}

export interface HighlightedWord {
	line: number;
	tokenIndex: number;
	type: HighlightType;
}

export interface EditorDocument {
	id: string;
	fileName: string;
	code: string;
	language: LanguageId;
	highlightedLines: HighlightedLine[];
	highlightedWords: HighlightedWord[];
}

export interface CornerRadii {
	tl: number;
	tr: number;
	bl: number;
	br: number;
}
