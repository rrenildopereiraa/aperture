import tinycolor from "tinycolor2";

export function contrastColor(color: string): "#000000" | "#ffffff" {
	return tinycolor(color).isLight() ? "#000000" : "#ffffff";
}
