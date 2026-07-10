import { toBlob, toCanvas, toJpeg, toPng, toSvg } from "html-to-image";
import type { ExportFormat } from "../components/format-picker";

export async function captureDataUrl(
	node: HTMLElement,
	format: ExportFormat,
): Promise<string> {
	switch (format) {
		case "svg":
			return toSvg(node);
		case "webp": {
			const canvas = await toCanvas(node, { pixelRatio: 2 });
			return canvas.toDataURL("image/webp");
		}
		case "jpg":
			return toJpeg(node, { pixelRatio: 2, quality: 0.95 });
		default:
			return toPng(node, { pixelRatio: 2 });
	}
}

export async function copyImageToClipboard(node: HTMLElement) {
	const blob = await toBlob(node, { pixelRatio: 2 });
	if (!blob) return;
	await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
