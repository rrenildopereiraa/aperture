import { Button } from "@base-ui/react/button";
import {
	ClipboardIcon,
	ClipboardTextIcon,
	FileCodeIcon,
	MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";
import { modKey } from "../lib/platform";
import { ExportButton } from "./export-button";
import type { ExportFormat } from "./format-picker";

export function EditorTabBar({
	fileName,
	onOpenPalette,
	onCopy,
	onExport,
	exporting,
	format,
	onFormatChange,
}: {
	fileName: string;
	onOpenPalette: () => void;
	onCopy: () => void;
	onExport: () => void;
	exporting: boolean;
	format: ExportFormat;
	onFormatChange: (value: ExportFormat) => void;
}) {
	const { trigger: haptic } = useHaptics();
	const [copied, setCopied] = useState(false);

	return (
		<header className="d-f ai-c bbw-1 bs-s bc-border bg-surface">
			<div className="d-f ai-c px-2 py-2 brw-1 bs-s bc-border">
				<img src="/favicon.svg" className="w-4 h-4" alt="" />
			</div>

			<div className="d-f ai-c g-2 px-3 py-2 bg-page brw-1 bs-s bc-border">
				<FileCodeIcon size={14} weight="fill" className="c-accent" />
				<span className="fs-sm ff-m c-accent-dim us-none ws-nw">
					{fileName || "Untitled-1"}
				</span>
			</div>

			<div className="f-1" />

			<div className="d-f ai-c g-1 px-2">
				<Button
					onClick={() => {
						haptic("success");
						onOpenPalette();
					}}
					className="d-f ai-c g-2 h-7 px-3 bg-page bw-1 bc-border c-accent-dim fs-xs ff-m us-none c-p bs-i-xs h:c-accent fv:os-s fv:oo-2 fv:oc-accent"
				>
					<MagnifyingGlassIcon size={12} weight="bold" />
					Search
					<span className="px-1 bw-1 bs-s bc-border fs-xs c-accent-dim ws-nw">
						{modKey}K
					</span>
				</Button>

				<Button
					onClick={() => {
						onCopy();
						haptic("success");
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					}}
					className="d-f ai-c jc-c w-8 h-7 c-accent-dim bg-transparent bw-1 bc-border bs-i-xs us-none c-p h:bg-page h:c-accent fv:os-s fv:oo-2 fv:oc-accent"
				>
					{copied ? (
						<ClipboardTextIcon size={14} className="c-diff-add" weight="fill" />
					) : (
						<ClipboardIcon size={14} weight="fill" />
					)}
				</Button>

				<ExportButton
					exporting={exporting}
					onExport={onExport}
					format={format}
					onFormatChange={onFormatChange}
				/>
			</div>
		</header>
	);
}
