import { Popover } from "@base-ui/react/popover";
import { HexColorInput, HexColorPicker } from "react-colorful";

export function ColorInput({
	label,
	value,
	onChange,
	indent,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	indent?: boolean;
}) {
	return (
		<div className={`d-f ai-c jc-sb g-2 px-2 pb-2 ${indent ? "pl-6" : ""}`}>
			<span className="d-f ai-c g-1 fs-sm ff-m c-accent-dim us-none">
				{indent && <span aria-hidden="true">&#8627;</span>}
				{label}
			</span>
			<div className="d-f g-2">
				<HexColorInput
					color={value}
					onChange={onChange}
					prefixed
					spellCheck={false}
					className="ff-m fs-xs c-accent-dim bg-page bs-i-xs bw-1 bs-s bc-border px-2 py-1 w-20"
				/>
				<Popover.Root>
					<Popover.Trigger
						className="w-5 bw-1 bs-s bc-border fs-0 c-p fv:os-s fv:oo-2 fv:oc-accent"
						style={{ backgroundColor: value }}
						aria-label={`${label} color picker`}
					/>
					<Popover.Portal>
						<Popover.Positioner sideOffset={8} align="end" className="zi-90">
							<Popover.Popup className="p-2 bw-1 bc-border bg-surface bs-o-xs">
								<HexColorPicker color={value} onChange={onChange} />
							</Popover.Popup>
						</Popover.Positioner>
					</Popover.Portal>
				</Popover.Root>
			</div>
		</div>
	);
}
