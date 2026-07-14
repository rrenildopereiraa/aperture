import type { LanguageId } from "../lib/highlighter";
import type { Background } from "../lib/types";
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
	showActiveTabBorder: boolean;
	background: Background;
	radii: CornerRadii;
	font?: string;
	themeName: string;
	colors: FrameColors;
	showBoundingBox: boolean;
	frameRef: React.RefObject<HTMLDivElement | null>;
}) {
	return (
		<main className="f-1 d-f ai-c jc-c p-r px-2 @sm:px-4 py-8 @sm:py-24">
			<div className="p-r min-w-0">
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
					showActiveTabBorder={showActiveTabBorder}
					background={background}
					radii={radii}
					font={font}
					themeName={themeName}
					colors={colors}
				/>

				{showBoundingBox && <BoundingBox />}
			</div>
		</main>
	);
}
