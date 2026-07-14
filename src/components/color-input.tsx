import { Input } from "@base-ui/react/input";
import { useHaptics } from "../lib/haptics";

function isValidHex(value: string) {
	return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function ColorInput({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const { trigger: haptic } = useHaptics();

	return (
		<div className="d-f ai-c jc-sb g-2 px-2 pb-2">
			<span className="fs-sm ff-m c-accent-dim us-none">{label}</span>
			<div className="d-f g-2">
				<Input
					value={value}
					onChange={(event) => {
						const next = event.target.value;
						if (isValidHex(next)) {
							onChange(next);
							haptic("success");
						}
					}}
					spellCheck={false}
					className="ff-m fs-xs c-accent-dim bg-transparent bw-1 bs-s bc-border px-2 py-1 w-20"
				/>
				<div
					className="w-5 bw-1 bs-s bc-border fs-0"
					style={{ backgroundColor: value }}
				/>
			</div>
		</div>
	);
}
