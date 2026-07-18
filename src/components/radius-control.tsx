import { Button } from "@base-ui/react/button";
import { NumberField } from "@base-ui/react/number-field";
import { CaretUpIcon, CornersOutIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { CornerRadii } from "../lib/types";

export const RADIUS_MIN = 0;
export const RADIUS_MAX = 16;

const RADIUS_PRESETS: { label: string; value: number }[] = [
	{ label: "None", value: 0 },
	{ label: "Small", value: 4 },
	{ label: "Medium", value: 8 },
	{ label: "Large", value: 12 },
	{ label: "Full", value: 16 },
];

const CORNERS: {
	id: keyof CornerRadii;
	label: string;
	Icon: typeof CaretUpIcon;
	rotate: string;
}[] = [
	{ id: "tl", label: "Top left", Icon: CaretUpIcon, rotate: "ro-63" },
	{ id: "tr", label: "Top right", Icon: CaretUpIcon, rotate: "ro--63" },
	{ id: "bl", label: "Bottom left", Icon: CaretUpIcon, rotate: "ro--27" },
	{ id: "br", label: "Bottom right", Icon: CaretUpIcon, rotate: "ro-27" },
];

export function RadiusControl({
	radii,
	onRadiiChange,
}: {
	radii: CornerRadii;
	onRadiiChange: (value: CornerRadii) => void;
}) {
	const [split, setSplit] = useState(false);

	const values = [radii.tl, radii.tr, radii.bl, radii.br];
	const uniform = values.every((value) => value === values[0]);
	const activeValue = uniform ? radii.tl : null;

	function setAll(value: number) {
		onRadiiChange({ tl: value, tr: value, bl: value, br: value });
	}

	function setCorner(corner: keyof CornerRadii, value: number) {
		onRadiiChange({ ...radii, [corner]: value });
	}

	return (
		<div className="d-f fd-c g-2 px-2 pt-1 pb-4">
			<span className="fs-sm ff-m c-accent-dim us-none">Border Radius</span>

			<div className="d-f w-100% bw-1 bs-s bc-border">
				{RADIUS_PRESETS.map(({ label, value }, index) => (
					<button
						key={label}
						type="button"
						onClick={() => setAll(value)}
						aria-pressed={activeValue === value}
						className={`f-1 min-w-0 px-1 py-1 fs-xs ff-m ws-nw us-none c-p fv:os-s fv:oo--2 fv:oc-accent ${index > 0 ? "blw-1 bs-s bc-border" : ""} ${
							activeValue === value
								? "bg-accent c-page"
								: "bg-transparent c-accent-dim h:c-accent"
						}`}
					>
						{label}
					</button>
				))}
			</div>

			<Button
				onClick={() => setSplit((value) => !value)}
				aria-pressed={split}
				className={`d-f ai-c jc-c as-s g-1 px-2 py-1 fs-xs ff-m us-none c-p bw-1 bs-s fv:os-s fv:oo-2 fv:oc-accent ${
					split
						? "bg-accent bc-accent c-page"
						: "bg-transparent bc-border c-accent-dim h:c-accent h:bc-accent"
				}`}
			>
				<CornersOutIcon size={12} weight="bold" />
				Per-corner
			</Button>

			{split && (
				<div
					className="g-1"
					style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
				>
					{CORNERS.map(({ id, label, Icon, rotate }) => (
						<div key={id} className="d-f bw-1 bs-s bc-border">
							<span className="d-f ai-c jc-c w-6 fs-0 c-accent-dim brw-1 bs-s bc-border">
								<Icon size={12} weight="bold" aria-hidden className={rotate} />
							</span>
							<NumberField.Root
								value={radii[id]}
								onValueChange={(value) => {
									if (value != null) setCorner(id, value);
								}}
								min={RADIUS_MIN}
								max={RADIUS_MAX}
								step={1}
								aria-label={`${label} radius`}
								className="f-1"
							>
								<NumberField.Input className="ff-m fs-xs c-accent-dim bg-page bs-i-xs bw-0 px-1 py-1 w-100% ta-c" />
							</NumberField.Root>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
