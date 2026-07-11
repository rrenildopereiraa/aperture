import type { LanguageId } from "../lib/highlighter";
import { Frame, type FrameColors } from "./frame";
import type { CornerRadii } from "./inspector";
import { BoundingBox } from "./bounding-box";
import type { Background } from "./toolbar";

export function Canvas({
	code,
	onCodeChange,
	language,
	fileName,
	onFileNameChange,
	showTabBar,
	showStatusBar,
	showGridLines,
	background,
	radii,
	font,
	themeName,
	colors,
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
	background: Background;
	radii: CornerRadii;
	font?: string;
	themeName: string;
	colors: FrameColors;
	frameRef: React.RefObject<HTMLDivElement | null>;
}) {
	return (
		<main className="f-1 d-f ai-c jc-c p-r px-4 @sm:px-8 py-8 @sm:py-24">
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
					background={background}
					radii={radii}
					font={font}
					themeName={themeName}
					colors={colors}
				/>

				<BoundingBox />
			</div>
		</main>
	);
}
