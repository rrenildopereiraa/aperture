import type { AspectRatio } from "../lib/types";
import { PickerField } from "./picker-field";

export const RATIO_OPTIONS: AspectRatio[] = [
	"auto",
	"16:9",
	"9:16",
	"1:1",
	"4:3",
];

export const RATIO_LABELS: Record<AspectRatio, string> = {
	auto: "Auto",
	"16:9": "16:9 Landscape",
	"9:16": "9:16 Portrait",
	"1:1": "1:1 Square",
	"4:3": "4:3 Classic",
};

export const RATIO_VALUES: Record<Exclude<AspectRatio, "auto">, number> = {
	"16:9": 16 / 9,
	"9:16": 9 / 16,
	"1:1": 1,
	"4:3": 4 / 3,
};

export function RatioControl({
	ratio,
	onRatioChange,
}: {
	ratio: AspectRatio;
	onRatioChange: (value: AspectRatio) => void;
}) {
	return (
		<PickerField
			label="Ratio"
			value={ratio}
			options={RATIO_OPTIONS.map((id) => ({ id, label: RATIO_LABELS[id] }))}
			onValueChange={onRatioChange}
		/>
	);
}
