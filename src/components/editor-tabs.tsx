import { Button } from "@base-ui/react/button";
import {
	CheckIcon,
	ClipboardIcon,
	ClipboardTextIcon,
	FileCodeIcon,
	LinkSimpleIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { modKey } from "../lib/platform";
import { type EditorDocument, MAX_DOCUMENTS } from "../lib/types";
import { ExportButton } from "./export-button";
import type { ExportFormat } from "./format-picker";
import { Tooltip } from "./tooltip";

function TabItem({
	doc,
	isActive,
	canClose,
	onSelect,
	onClose,
}: {
	doc: EditorDocument;
	isActive: boolean;
	canClose: boolean;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
}) {
	return (
		<div
			className={`d-f ai-c g-2 pl-3 pr-2 py-2 brw-1 bs-s bc-border c-p ${
				isActive ? "bg-page" : "bg-transparent h:bg-page"
			}`}
		>
			<button
				type="button"
				onClick={() => onSelect(doc.id)}
				className="d-f ai-c g-2 p-0 bg-transparent bw-0 us-none c-p fv:os-s fv:oo-2 fv:oc-accent f-1"
			>
				<FileCodeIcon
					size={14}
					weight="fill"
					className={isActive ? "c-accent" : "c-accent-dim"}
				/>
				<span className="fs-sm ff-m c-accent-dim ws-nw">
					{doc.fileName || "Untitled"}
				</span>
			</button>
			{canClose && (
				<Tooltip content="Close snippet">
					<button
						type="button"
						onClick={() => onClose(doc.id)}
						aria-label="Close snippet"
						className="d-f ai-c jc-c p-0 c-accent-dim bg-transparent bw-0 c-p h:c-accent fv:os-s fv:oo-2 fv:oc-accent"
					>
						<XIcon size={12} weight="bold" />
					</button>
				</Tooltip>
			)}
		</div>
	);
}

export function EditorTabBar({
	documents,
	activeId,
	onSelect,
	onClose,
	onAdd,
	onOpenPalette,
	onCopy,
	onExport,
	onShare,
	exporting,
	format,
	onFormatChange,
}: {
	documents: EditorDocument[];
	activeId: string;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onAdd: () => void;
	onOpenPalette: () => void;
	onCopy: () => void;
	onExport: () => void;
	onShare: () => void;
	exporting: boolean;
	format: ExportFormat;
	onFormatChange: (value: ExportFormat) => void;
}) {
	const [copied, setCopied] = useState(false);
	const [shared, setShared] = useState(false);
	const canClose = documents.length > 1;
	const atLimit = documents.length >= MAX_DOCUMENTS;

	return (
		<header className="d-f ai-c bbw-1 bs-s bc-border bg-surface">
			<div className="d-f ai-c px-2 py-2 brw-1 bs-s bc-border">
				<img src="/favicon.svg" className="w-4 h-4" alt="" />
			</div>

			<div className="d-f ai-c min-w-0 o-x-auto">
				{documents.map((doc) => (
					<TabItem
						key={doc.id}
						doc={doc}
						isActive={doc.id === activeId}
						canClose={canClose}
						onSelect={onSelect}
						onClose={onClose}
					/>
				))}

				<Tooltip
					content={
						atLimit ? `Snippet limit reached (${MAX_DOCUMENTS})` : "New snippet"
					}
				>
					<button
						type="button"
						onClick={onAdd}
						aria-label={
							atLimit
								? `Snippet limit reached (${MAX_DOCUMENTS})`
								: "New snippet"
						}
						style={atLimit ? { opacity: 0.4 } : undefined}
						className="d-f ai-c jc-c as-s w-8 brw-1 bs-s bc-border c-accent-dim bg-transparent c-p h:c-accent h:bg-page fv:os-s fv:oo--2 fv:oc-accent"
					>
						<PlusIcon size={14} weight="bold" />
					</button>
				</Tooltip>
			</div>

			<div className="f-1" />

			<div className="d-f ai-c g-1 px-2">
				<Button
					onClick={onOpenPalette}
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
						onShare();
						setShared(true);
						setTimeout(() => setShared(false), 1500);
					}}
					className="d-f ai-c jc-c g-2 w-8 @sm:w-24 h-7 px-2 c-accent-dim bg-transparent bw-1 bc-border bs-i-xs us-none c-p h:bg-page h:c-accent fv:os-s fv:oo-2 fv:oc-accent"
				>
					{shared ? (
						<CheckIcon size={14} className="c-diff-add" weight="bold" />
					) : (
						<LinkSimpleIcon size={14} />
					)}
					<span className="d-none @sm:d-if">{shared ? "Copied" : "Share"}</span>
				</Button>

				<Button
					onClick={() => {
						onCopy();
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					}}
					className="d-f ai-c jc-c g-2 w-8 @sm:w-24 h-7 px-2 c-accent-dim bg-transparent bw-1 bc-border bs-i-xs us-none c-p h:bg-page h:c-accent fv:os-s fv:oo-2 fv:oc-accent"
				>
					{copied ? (
						<ClipboardTextIcon size={14} className="c-diff-add" weight="fill" />
					) : (
						<ClipboardIcon size={14} weight="fill" />
					)}
					<span className="d-none @sm:d-if">{copied ? "Copied" : "Copy"}</span>
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
