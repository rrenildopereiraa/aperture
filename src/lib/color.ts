import tinycolor from "tinycolor2";

export function contrastColor(color: string): "#000000" | "#ffffff" {
	return tinycolor(color).isLight() ? "#000000" : "#ffffff";
}

// A translucent line color guaranteed to stay visible against `background`:
// darker than light backgrounds, lighter than dark ones, regardless of hue.
export function patternLineColor(background: string): string {
	const color = tinycolor(background);
	const line = color.isLight() ? color.darken(12) : color.lighten(16);
	return line.setAlpha(0.4).toRgbString();
}

// A random, reasonably saturated color - built from HSL rather than raw RGB
// so results stay legible instead of landing on muddy or washed-out tones.
export function randomColor(): string {
	return tinycolor({
		h: Math.floor(Math.random() * 360),
		s: 0.35 + Math.random() * 0.5,
		l: 0.35 + Math.random() * 0.5,
	}).toHexString();
}
