import type { LanguageId } from "./highlighter";

export type BackgroundPattern = "stripes-right" | "stripes-left";

export type CanvasMode = "static" | "animated";

export const MAX_DOCUMENTS = 5;

export interface EditorDocument {
	id: string;
	fileName: string;
	code: string;
	language: LanguageId;
}

export interface CornerRadii {
	tl: number;
	tr: number;
	bl: number;
	br: number;
}
