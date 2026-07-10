import { Select } from "@base-ui/react/select";
import { CaretDownIcon, SquareIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";

export type ExportFormat = "png" | "jpg" | "webp" | "svg";

const FORMAT_LABELS: Record<ExportFormat, string> = {
	png: "PNG",
	jpg: "JPG",
	webp: "WEBP",
	svg: "SVG",
};

export function FormatPicker({
	value,
	onValueChange,
}: {
	value: ExportFormat;
	onValueChange: (value: ExportFormat) => void;
}) {
	const [open, setOpen] = useState(false);
	const { trigger: haptic } = useHaptics();

	return (
		<Select.Root
			value={value}
			onValueChange={(next) => {
				if (next) {
					onValueChange(next);
					haptic("success");
				}
			}}
			open={open}
			onOpenChange={setOpen}
		>
			<Select.Trigger
				className={`d-f ai-c jc-sb g-1 w-16 px-2 py-1 c-accent-dim fs-sm ff-m us-none c-p bw-0 fv:os-s fv:oo-2 fv:oc-accent ${open ? "bg-page" : "bg-transparent"} h:bg-page`}
			>
				<Select.Value>{() => FORMAT_LABELS[value]}</Select.Value>
				<Select.Icon className="d-f c-accent-dim">
					<CaretDownIcon size={12} weight="fill" />
				</Select.Icon>
			</Select.Trigger>
			<AnimatePresence>
				{open && (
					<Select.Portal>
						<Select.Positioner
							sideOffset={8}
							alignItemWithTrigger={false}
							className="zi-90 p-0 ow-0 us-none"
						>
							<Select.Popup
								render={
									<motion.div
										initial={{ opacity: 0, scale: 0.97 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.97 }}
										transition={{ duration: 0.12, ease: "easeOut" }}
									/>
								}
								className="w-28 bw-1 bc-border bg-surface py-1 bs-o-xs"
							>
								<Select.List>
									{(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((key) => (
										<Select.Item
											key={key}
											value={key}
											className={(state) =>
												`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-page c-accent" : "c-accent-dim"}`
											}
										>
											<Select.ItemText>{FORMAT_LABELS[key]}</Select.ItemText>
											<Select.ItemIndicator className="d-f ai-c c-accent">
												<SquareIcon size={14} weight="fill" />
											</Select.ItemIndicator>
										</Select.Item>
									))}
								</Select.List>
							</Select.Popup>
						</Select.Positioner>
					</Select.Portal>
				)}
			</AnimatePresence>
		</Select.Root>
	);
}
