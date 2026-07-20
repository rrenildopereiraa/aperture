import { Button } from "@base-ui/react/button";
import { Menu } from "@base-ui/react/menu";
import { Separator } from "@base-ui/react/separator";
import {
	CaretDownIcon,
	DownloadSimpleIcon,
	SpinnerIcon,
} from "@phosphor-icons/react";
import {
	type ExportFormat,
	FORMAT_LABELS,
	IMAGE_FORMATS,
	isVideoFormat,
	VIDEO_FORMATS,
} from "./format-picker";

function FormatMenuItem({
	format,
	selected,
	onSelect,
}: {
	format: ExportFormat;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<Menu.Item
			onClick={onSelect}
			className={(state) =>
				`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-accent c-page" : selected ? "c-accent h:c-white fw-700 tdl-u" : "c-accent-dim"}`
			}
		>
			{FORMAT_LABELS[format]}
		</Menu.Item>
	);
}

export function ExportButton({
	exporting,
	exportProgress,
	onExport,
	format,
	onFormatChange,
}: {
	exporting: boolean;
	exportProgress: number | null;
	onExport: () => void;
	format: ExportFormat;
	onFormatChange: (value: ExportFormat) => void;
}) {
	const recording = exporting && isVideoFormat(format);

	if (exporting) {
		const percent =
			recording && exportProgress != null
				? ` ${Math.round(exportProgress * 100)}%`
				: "";
		return (
			<Button
				disabled
				focusableWhenDisabled
				className={`export-pulse d-f ai-c jc-c g-2 min-w-24 h-7 px-2 fw-600 fs-sm ff-m us-none c-p bs-i-xs fv:os-s fv:oo-2 fv:oc-accent ${
					recording
						? "bg-transparent c-diff-remove bw-1 bc-diff-remove"
						: "bg-accent c-page bw-0"
				}`}
			>
				<span className="d-f">
					<SpinnerIcon size={14} />
				</span>
				<span>{recording ? `Recording${percent}` : "Exporting"}</span>
			</Button>
		);
	}

	return (
		<div className="d-f">
			<Button
				onClick={onExport}
				className="d-f ai-c jc-c g-2 w-24 h-7 px-2 bg-accent c-page fw-600 fs-sm ff-m us-none c-p bw-0 bs-i-xs h:bg-accent-8 fv:os-s fv:oo-2 fv:oc-accent"
			>
				<DownloadSimpleIcon size={14} weight="fill" />
				<span>Export</span>
			</Button>

			<div className="w-px bg-page/40" aria-hidden="true" />

			<Menu.Root>
				<Menu.Trigger className="d-f ai-c jc-c w-6 h-7 px-1 bg-accent c-page fw-600 fs-sm ff-m us-none c-p bw-0 bs-i-xs h:bg-accent-8 fv:os-s fv:oo-2 fv:oc-accent">
					<CaretDownIcon size={12} weight="fill" />
				</Menu.Trigger>
				<Menu.Portal keepMounted>
					<Menu.Positioner sideOffset={8} align="end" className="zi-90 ow-0">
						<Menu.Popup className="menu-popup py-1 w-28 bw-1 bc-border bg-surface bs-o-xs">
							{IMAGE_FORMATS.map((key) => (
								<FormatMenuItem
									key={key}
									format={key}
									selected={format === key}
									onSelect={() => onFormatChange(key)}
								/>
							))}
							<Separator
								orientation="horizontal"
								className="my-1 mx-1 h-px bg-border"
							/>
							{VIDEO_FORMATS.map((key) => (
								<FormatMenuItem
									key={key}
									format={key}
									selected={format === key}
									onSelect={() => onFormatChange(key)}
								/>
							))}
						</Menu.Popup>
					</Menu.Positioner>
				</Menu.Portal>
			</Menu.Root>
		</div>
	);
}
