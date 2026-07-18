import { Button } from "@base-ui/react/button";
import { NumberField } from "@base-ui/react/number-field";
import { Slider } from "@base-ui/react/slider";
import { CaretUpIcon, CornersOutIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { CornerRadii } from "../lib/types";

export const RADIUS_MIN = 0;
export const RADIUS_MAX = 16;
const RADIUS_TICKS = [0, 25, 50, 75, 100];

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

	function setAll(value: number) {
		onRadiiChange({ tl: value, tr: value, bl: value, br: value });
	}

	function setCorner(corner: keyof CornerRadii, value: number) {
		onRadiiChange({ ...radii, [corner]: value });
	}

	return (
		<div className="d-f fd-c g-2 px-2 pt-1 pb-4">
			<span className="fs-sm ff-m c-accent-dim us-none">Border Radius</span>

			<div className="d-f ai-c g-2">
				<Slider.Root
					value={uniform ? radii.tl : Math.max(...values)}
					onValueChange={(value) => setAll(value)}
					min={RADIUS_MIN}
					max={RADIUS_MAX}
					step={1}
					className="d-f ai-c g-2 f-1"
				>
					<Slider.Control className="p-r d-f ai-c h-5 f-1 c-p">
						<Slider.Track className="p-r f-1 h-px bg-border">
							{RADIUS_TICKS.map((pct) => (
								<span
									key={pct}
									aria-hidden="true"
									className="p-a w-px h-2 bg-accent-dim"
									style={{
										left: `${pct}%`,
										top: "50%",
										transform: "translate(-50%, -50%)",
									}}
								/>
							))}
							<Slider.Indicator className="h-px bg-accent" />
							<Slider.Thumb className="w-2 h-4 bg-accent bs-o-xs fv:os-s fv:oo-2 fv:oc-accent" />
						</Slider.Track>
					</Slider.Control>

					<Slider.Value
						className={`ff-m fs-xs ta-c w-9 py-1 bw-1 bs-s bc-border us-none ${
							uniform ? "c-accent-dim" : "c-border"
						}`}
					>
						{(formatted) => (uniform ? formatted[0] : "—")}
					</Slider.Value>
				</Slider.Root>

				<Button
					onClick={() => setSplit((value) => !value)}
					aria-pressed={split}
					className={`d-f ai-c jc-c w-7 h-7 fs-0 p-0 bw-1 bs-s c-p fv:os-s fv:oo-2 fv:oc-accent ${
						split
							? "bg-accent bc-accent c-page"
							: "bg-transparent bc-border c-accent-dim h:c-accent h:bc-accent"
					}`}
				>
					<CornersOutIcon size={14} weight="bold" />
				</Button>
			</div>

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
