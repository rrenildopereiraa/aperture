import gsap from "gsap";
import { toCanvas } from "html-to-image";

import type { VideoFormat } from "../components/format-picker";

export type RevealStyle = "typewriter" | "natural";

export interface RecordAnimatedVideoOptions {
	frameEl: HTMLElement;
	codeEl: HTMLElement;
	code: string;
	background: string;
	format: VideoFormat;
	msPerChar?: number;
	startDelayMs?: number;
	holdMs?: number;
	style?: RevealStyle;
	onProgress?: (fraction: number) => void;
}

function pickMimeType(preferred: VideoFormat) {
	const webm = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
	const mp4 = ["video/mp4;codecs=avc1", "video/mp4"];
	const candidates =
		preferred === "mp4" ? [...mp4, ...webm] : [...webm, ...mp4];
	for (const type of candidates) {
		if (MediaRecorder.isTypeSupported(type)) return type;
	}
	return "video/webm";
}

export function extensionForMimeType(mimeType: string): string {
	return mimeType.startsWith("video/mp4") ? "mp4" : "webm";
}

export function isAnimatedExportSupported() {
	return (
		typeof MediaRecorder !== "undefined" &&
		typeof HTMLCanvasElement.prototype.captureStream === "function"
	);
}

function buildRevealTimeline(
	progress: { chars: number },
	code: string,
	msPerChar: number,
	style: RevealStyle,
	onUpdate: () => void,
) {
	const timeline = gsap.timeline();
	if (style === "natural") {
		// Reveal in word-sized bursts with randomized speed and occasional
		// pauses, rather than a perfectly uniform per-character rate - reads
		// closer to how someone actually types than a metronomic typewriter.
		const chunks = code.match(/\s+|\S+/g) ?? [];
		let cursor = 0;
		for (const chunk of chunks) {
			cursor += chunk.length;
			const jitter = 0.65 + Math.random() * 0.7;
			timeline.to(progress, {
				chars: cursor,
				duration: (chunk.length * msPerChar * jitter) / 1000,
				ease: "none",
				onUpdate,
			});
			if (Math.random() < 0.1) {
				timeline.to({}, { duration: 0.15 + Math.random() * 0.12 });
			}
		}
	} else {
		timeline.to(progress, {
			chars: code.length,
			duration: (code.length * msPerChar) / 1000,
			ease: "none",
			onUpdate,
		});
	}
	return timeline;
}

export async function recordAnimatedVideo({
	frameEl,
	codeEl,
	code,
	background,
	format,
	msPerChar = 35,
	startDelayMs = 800,
	holdMs = 2800,
	style = "natural",
	onProgress,
}: RecordAnimatedVideoOptions): Promise<Blob> {
	if (!isAnimatedExportSupported()) {
		throw new Error("Animated export isn't supported in this browser.");
	}

	const sourceCanvas = await toCanvas(frameEl, { pixelRatio: 2 });

	const frameRect = frameEl.getBoundingClientRect();
	const codeRect = codeEl.getBoundingClientRect();
	const scale = sourceCanvas.width / frameRect.width;
	const offsetX = (codeRect.left - frameRect.left) * scale;
	const offsetY = (codeRect.top - frameRect.top) * scale;
	const codeAreaWidth = codeRect.width * scale;
	const codeAreaHeight = codeRect.height * scale;
	const codeAreaRight = offsetX + codeAreaWidth;
	const codeAreaBottom = offsetY + codeAreaHeight;

	const computed = getComputedStyle(codeEl);
	const scaledFontSize = Number.parseFloat(computed.fontSize) * scale;
	const scaledLineHeight = Number.parseFloat(computed.lineHeight) * scale;

	const recordCanvas = document.createElement("canvas");
	recordCanvas.width = sourceCanvas.width;
	recordCanvas.height = sourceCanvas.height;
	const ctx = recordCanvas.getContext("2d");
	if (!ctx) throw new Error("Could not create a 2D canvas context.");
	ctx.font = `${computed.fontWeight} ${scaledFontSize}px ${computed.fontFamily}`;
	const charWidth = ctx.measureText("M").width;

	const lines = code.split("\n");

	function draw(revealedChars: number) {
		if (!ctx) return;
		ctx.drawImage(sourceCanvas, 0, 0);
		let remaining = revealedChars;
		ctx.fillStyle = background;
		for (let i = 0; i < lines.length; i++) {
			const lineLength = lines[i].length;
			if (remaining >= lineLength) {
				remaining -= lineLength + 1;
				continue;
			}
			const lineRevealed = Math.max(0, remaining);
			const maskStartX = offsetX + lineRevealed * charWidth;
			const rowY = offsetY + i * scaledLineHeight;
			// Mask only the unrevealed rest of the current line and the
			// still-untyped lines below it, bounded to the code area's own
			// box - NOT the full frame canvas. Everything outside the code
			// area (tab bar, status bar, padding, background pattern) must
			// stay visible from frame one instead of being hidden until the
			// typewriter reaches the bottom line.
			ctx.fillRect(
				maskStartX,
				rowY,
				codeAreaRight - maskStartX,
				scaledLineHeight,
			);
			ctx.fillRect(
				offsetX,
				rowY + scaledLineHeight,
				codeAreaWidth,
				codeAreaBottom - (rowY + scaledLineHeight),
			);
			return;
		}
	}

	draw(0);

	const stream = recordCanvas.captureStream(30);
	const mimeType = pickMimeType(format);
	const recorder = new MediaRecorder(stream, { mimeType });
	const chunks: Blob[] = [];
	recorder.ondataavailable = (event) => {
		if (event.data.size > 0) chunks.push(event.data);
	};

	const recorded = new Promise<Blob>((resolve, reject) => {
		recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
		recorder.onerror = () => reject(new Error("Recording failed."));
	});

	recorder.start();

	// Drive everything (the start delay, the tween, and the end hold) with
	// manual ticks on a plain interval instead of gsap's default
	// requestAnimationFrame loop, which browsers can suspend entirely for a
	// backgrounded/hidden tab - exactly the scenario a long recording risks
	// if the user switches away mid-export. The same interval doubles as the
	// progress clock, since it already ticks continuously across all three
	// phases (delay, reveal, hold).
	const tickMs = 1000 / 30;
	const revealEstimateMs = code.length * msPerChar;
	const totalMs = startDelayMs + revealEstimateMs + holdMs;
	let elapsedMs = 0;

	gsap.ticker.sleep();
	const intervalId = setInterval(() => {
		gsap.ticker.tick();
		elapsedMs += tickMs;
		onProgress?.(totalMs > 0 ? Math.min(1, elapsedMs / totalMs) : 1);
	}, tickMs);

	await new Promise<void>((resolve) => {
		setTimeout(resolve, startDelayMs);
	});

	await new Promise<void>((resolve) => {
		const progress = { chars: 0 };
		const timeline = buildRevealTimeline(progress, code, msPerChar, style, () =>
			draw(Math.floor(progress.chars)),
		);
		timeline.eventCallback("onComplete", () => {
			draw(code.length);
			resolve();
		});
	});

	await new Promise<void>((resolve) => setTimeout(resolve, holdMs));

	clearInterval(intervalId);
	gsap.ticker.wake();
	onProgress?.(1);
	recorder.stop();
	return recorded;
}
