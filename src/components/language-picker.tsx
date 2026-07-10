import { Select } from "@base-ui/react/select";
import { CaretDownIcon, SquareIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useHaptics } from "../lib/haptics";
import { LANGUAGES, type LanguageId } from "../lib/highlighter";

// Compact labels for the menu-bar trigger; the popup lists full names.
const SHORT_LABELS: Record<LanguageId, string> = {
	html: "HTML",
	javascript: "JS",
	jsx: "JSX",
	typescript: "TS",
	tsx: "TSX",
	astro: "ASTRO",
	vue: "VUE",
	svelte: "SVELTE",
	markdown: "MD",
	mdx: "MDX",
	css: "CSS",
	scss: "SCSS",
	php: "PHP",
};

const options = Object.entries(LANGUAGES).map(([id, label]) => ({
	id: id as LanguageId,
	label,
}));

export function LanguagePicker({
	value,
	onValueChange,
}: {
	value: LanguageId;
	onValueChange: (value: LanguageId) => void;
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
				className={`d-f ai-c jc-sb g-1 w-20 px-2 py-1 c-accent-dim fs-sm ff-m us-none c-p bw-0 fv:os-s fv:oo-2 fv:oc-accent ${open ? "bg-page" : "bg-transparent"} h:bg-page`}
			>
				<Select.Value>
					{() => (
						<span className="min-w-0 o-h to-e ws-nw">
							{SHORT_LABELS[value]}
						</span>
					)}
				</Select.Value>
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
								className="w-48 bw-1 bc-border bg-surface py-1 bs-o-xs"
							>
								<Select.List className="p-r o-auto">
									{options.map(({ id, label }) => (
										<Select.Item
											key={id}
											value={id}
											className={(state) =>
												`d-f ai-c jc-sb g-2 mx-1 px-3 py-2 fs-sm ff-m us-none c-p ${state.highlighted ? "bg-page c-accent" : "c-accent-dim"}`
											}
										>
											<Select.ItemText>{label}</Select.ItemText>
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
