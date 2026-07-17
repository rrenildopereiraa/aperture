import { Tabs } from "@base-ui/react/tabs";
import { useState } from "react";
import type { LanguageId } from "../lib/highlighter";
import type { BackgroundPattern } from "../lib/types";
import { BoundingBox } from "./bounding-box";
import { Frame, type FrameColors } from "./frame";
import type { CornerRadii } from "./inspector";

type CanvasMode = "static" | "animated";

export function Canvas({
	code,
	onCodeChange,
	language,
	fileName,
	onFileNameChange,
	showTabBar,
	showStatusBar,
	showGridLines,
	showBackgroundPattern,
	showActiveTabBorder,
	background,
	radii,
	font,
	themeName,
	colors,
	showBoundingBox,
	frameRef,
}: {
	code: string;
	onCodeChange: (value: string) => void;
	language: LanguageId;
	fileName: string;
	onFileNameChange: (value: string) => void;
	showTabBar: boolean;
	showStatusBar: boolean;
	showGridLines: boolean;
	showBackgroundPattern: boolean;
	showActiveTabBorder: boolean;
	background: BackgroundPattern;
	radii: CornerRadii;
	font?: string;
	themeName: string;
	colors: FrameColors;
	showBoundingBox: boolean;
	frameRef: React.RefObject<HTMLDivElement | null>;
}) {
	const [mode, setMode] = useState<CanvasMode>("static");

	return (
		<main className="f-1 d-f fd-c min-h-0 min-w-0 px-2 @sm:px-4 pt-4 @sm:pt-6">
			<div className="d-f jc-c pb-4 fs-0">
				<Tabs.Root
					value={mode}
					onValueChange={(value) => {
						if (value) setMode(value as CanvasMode);
					}}
				>
					<Tabs.List className="d-f p-r g-1 p-1 bw-1 bs-s bc-border bg-page">
						<Tabs.Tab
							value="static"
							className={(state) =>
								`p-r zi-10 px-4 py-1 fs-xs ff-m ta-c us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${state.active ? "c-page fw-700" : "c-accent-dim bg-transparent h:bg-surface"}`
							}
						>
							Static
						</Tabs.Tab>
						<Tabs.Tab
							value="animated"
							className={(state) =>
								`p-r zi-10 px-4 py-1 fs-xs ff-m ta-c us-none c-p bw-0 fv:os-s fv:oo--2 fv:oc-accent ${state.active ? "c-page fw-700" : "c-accent-dim bg-transparent h:bg-surface"}`
							}
						>
							Animated
						</Tabs.Tab>
						<Tabs.Indicator
							className="p-a l-0 zi-0 bg-accent bs-o-xs"
							style={{
								translate: "var(--active-tab-left) 0",
								width: "var(--active-tab-width)",
								top: "var(--active-tab-top)",
								height: "var(--active-tab-height)",
							}}
						/>
					</Tabs.List>
				</Tabs.Root>
			</div>

			<div className="f-1 d-f min-h-0 min-w-0 o-auto pb-8 @sm:pb-16">
				{mode === "static" ? (
					<div className="m-auto p-r min-w-0">
						<Frame
							ref={frameRef}
							code={code}
							onCodeChange={onCodeChange}
							language={language}
							fileName={fileName}
							onFileNameChange={onFileNameChange}
							showTabBar={showTabBar}
							showStatusBar={showStatusBar}
							showGridLines={showGridLines}
							showBackgroundPattern={showBackgroundPattern}
							showActiveTabBorder={showActiveTabBorder}
							background={background}
							radii={radii}
							font={font}
							themeName={themeName}
							colors={colors}
						/>

						{showBoundingBox && <BoundingBox />}
					</div>
				) : (
					<span className="m-auto fs-lg ff-m c-accent-dim us-none">
						Coming Soon
					</span>
				)}
			</div>
		</main>
	);
}
