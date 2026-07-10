import type { LanguageId } from "../lib/highlighter";
import { Frame } from "./frame";
import { SelectionHandles } from "./selection-handles";
import type { CornerRadii } from "./inspector";
import type { Background } from "./toolbar";

export function Canvas({
	code,
	onCodeChange,
	language,
	fileName,
	onFileNameChange,
	showTabBar,
	showStatusBar,
	showHashtagLines,
	background,
	radii,
	font,
	themeName,
	frameRef,
}: {
	code: string;
	onCodeChange: (value: string) => void;
	language: LanguageId;
	fileName: string;
	onFileNameChange: (value: string) => void;
	showTabBar: boolean;
	showStatusBar: boolean;
	showHashtagLines: boolean;
	background: Background;
	radii: CornerRadii;
	font?: string;
	themeName: string;
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
					showHashtagLines={showHashtagLines}
					background={background}
					radii={radii}
					font={font}
					themeName={themeName}
				/>

				<SelectionHandles />
			</div>
		</main>
	);
}
