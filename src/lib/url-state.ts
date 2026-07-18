import {
	parseAsBoolean,
	parseAsInteger,
	parseAsJson,
	parseAsString,
	parseAsStringEnum,
} from "nuqs";
import type { FrameColors } from "../components/frame";
import { FONT_FAMILIES, type FontFamilyId } from "../components/inspector";
import { THEME_FRAME_COLORS, THEME_NAME } from "./highlighter";
import type { BackgroundPattern } from "./types";

const FRAME_COLOR_KEYS: (keyof FrameColors)[] = [
	"page",
	"surface",
	"border",
	"accentDim",
	"tabBar",
	"tabActive",
	"statusBarBg",
	"statusBarText",
	"activeTabBorder",
];

function parseFrameColors(value: unknown): FrameColors | null {
	if (typeof value !== "object" || value === null) return null;
	const record = value as Record<string, unknown>;
	for (const key of FRAME_COLOR_KEYS) {
		if (typeof record[key] !== "string") return null;
	}
	return record as unknown as FrameColors;
}

export const settingsParsers = {
	tabBar: parseAsBoolean.withDefault(true),
	statusBar: parseAsBoolean.withDefault(true),
	bgPattern: parseAsBoolean.withDefault(true),
	pattern: parseAsStringEnum<BackgroundPattern>([
		"stripes-right",
		"stripes-left",
	]).withDefault("stripes-right"),
	gridLines: parseAsBoolean.withDefault(true),
	tabBorder: parseAsBoolean.withDefault(true),
	rtl: parseAsInteger.withDefault(0),
	rtr: parseAsInteger.withDefault(0),
	rbl: parseAsInteger.withDefault(0),
	rbr: parseAsInteger.withDefault(0),
	font: parseAsStringEnum<FontFamilyId>(
		Object.keys(FONT_FAMILIES) as FontFamilyId[],
	).withDefault("default"),
	theme: parseAsString.withDefault(THEME_NAME),
	colors: parseAsJson<FrameColors>(parseFrameColors).withDefault(
		THEME_FRAME_COLORS[THEME_NAME],
	),
};
