import type { LanguageId } from "../lib/highlighter";
import type { BackgroundPattern } from "../lib/types";
import { BoundingBox } from "./bounding-box";
import { Frame, type FrameColors } from "./frame";
import type { CornerRadii } from "./inspector";

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
	fontFamily,
	themeName,
	colors,
	showBoundingBox,
	frameRef,
	codeRef,
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
	fontFamily?: string;
	themeName: string;
	colors: FrameColors;
	showBoundingBox: boolean;
	frameRef: React.RefObject<HTMLDivElement | null>;
	codeRef: React.RefObject<HTMLDivElement | null>;
}) {
	return (
		<main className="f-1 d-f min-h-0 min-w-0 o-auto px-2 @sm:px-4 py-8 @sm:py-16">
			<div className="m-auto p-r min-w-0">
				<Frame
					ref={frameRef}
					codeRef={codeRef}
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
					fontFamily={fontFamily}
					themeName={themeName}
					colors={colors}
				/>

				{showBoundingBox && <BoundingBox />}
			</div>
		</main>
	);
}
