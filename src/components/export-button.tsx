import { Button } from "@base-ui/react/button";
import { Menu } from "@base-ui/react/menu";
import {
	CaretDownIcon,
	DownloadSimpleIcon,
	SpinnerIcon,
	SquareIcon,
} from "@phosphor-icons/react";
import { useHaptics } from "../lib/haptics";
import { type ExportFormat, FORMAT_LABELS } from "./format-picker";

export function ExportButton({
	exporting,
	onExport,
	format,
	onFormatChange,
}: {
	exporting: boolean;
	onExport: () => void;
	format: ExportFormat;
	onFormatChange: (value: ExportFormat) => void;
}) {
	const { trigger } = useHaptics();

	return (
		<div className="d-f">
			<Button
				onClick={() => {
					onExport();
					trigger("success");
				}}
				disabled={exporting}
				focusableWhenDisabled
				className="d-f ai-c jc-c g-2 w-8 @sm:w-24 h-7 px-2 bg-accent c-page fw-600 fs-sm ff-m us-none c-p bw-0 bs-i-xs h:bg-accent-8 fv:os-s fv:oo-2 fv:oc-accent"
			>
				{exporting ? (
					<span className="d-f">
						<SpinnerIcon size={14} />
					</span>
				) : (
					<DownloadSimpleIcon size={14} weight="fill" />
				)}
				<span className="d-none @sm:d-if">
					{exporting ? "Exporting" : "Export"}
				</span>
			</Button>

			<div className="w-px bg-page/40" aria-hidden="true" />

			<Menu.Root>
				<Menu.Trigger className="d-f ai-c jc-c w-6 h-7 px-1 bg-accent c-page fw-600 fs-sm ff-m us-none c-p bw-0 bs-i-xs h:bg-accent-8 fv:os-s fv:oo-2 fv:oc-accent">
					<CaretDownIcon size={12} weight="fill" />
				</Menu.Trigger>
				<Menu.Portal keepMounted>
					<Menu.Positioner sideOffset={8} align="end" className="zi-90 ow-0">
						<Menu.Popup className="py-1 w-28 bw-1 bc-border bg-surface bs-o-xs">
							{(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((key) => (
								<Menu.Item
									key={key}
									onClick={() => {
										onFormatChange(key);
										trigger("success");
									}}
									className={`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${format === key ? "bg-accent c-page" : "c-accent-dim"}`}
								>
									{FORMAT_LABELS[key]}
									{format === key && (
										<SquareIcon size={14} weight="fill" className="c-page" />
									)}
								</Menu.Item>
							))}
						</Menu.Popup>
					</Menu.Positioner>
				</Menu.Portal>
			</Menu.Root>
		</div>
	);
}
