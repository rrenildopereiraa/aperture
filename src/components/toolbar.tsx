import { Button } from "@base-ui/react/button";
import { ClipboardIcon, ClipboardTextIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";
import type { LanguageId } from "../lib/highlighter";
import { ExportButton } from "./export-button";
import { type ExportFormat, FormatPicker } from "./format-picker";
import { LanguagePicker } from "./language-picker";

export type Background = "stripes" | "solid";

export function Toolbar({
	language,
	onLanguageChange,
	format,
	onFormatChange,
	exporting,
	onCopy,
	onExport,
}: {
	language: LanguageId;
	onLanguageChange: (value: LanguageId) => void;
	format: ExportFormat;
	onFormatChange: (value: ExportFormat) => void;
	exporting: boolean;
	onCopy: () => void;
	onExport: () => void;
}) {
	const { trigger } = useHaptics();
	const [copied, setCopied] = useState(false);

	return (
		<header className="p-f b-4 l-50% ttx--half zi-50 d-f ai-c g-1 @sm:g-2 px-3 @sm:px-4 py-2 bg-surface bw-1 bs-s bc-border bs-o-xs">
			<LanguagePicker value={language} onValueChange={onLanguageChange} />

			<FormatPicker value={format} onValueChange={onFormatChange} />

			<Button
				onClick={() => {
					onCopy();
					trigger("success");
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				}}
				className="d-f ai-c jc-c g-2 w-8 @sm:w-24 px-2 py-1 c-accent-dim fs-sm ff-m us-none c-p bw-0 tp-c tdu-150 ttf-io h:bg-page fv:os-s fv:oo-2 fv:oc-accent"
			>
				{copied ? (
					<ClipboardTextIcon size={14} className="c-diff-add" weight="fill" />
				) : (
					<ClipboardIcon size={14} weight="fill" />
				)}
				<span className="d-none @sm:d-if">{copied ? "Done" : "Copy"}</span>
			</Button>

			<ExportButton exporting={exporting} onExport={onExport} />
		</header>
	);
}
