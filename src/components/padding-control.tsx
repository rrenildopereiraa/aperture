import { Button } from "@base-ui/react/button";

export const PADDING_OPTIONS = [16, 32, 64, 128] as const;

export function PaddingControl({
	padding,
	onPaddingChange,
}: {
	padding: number;
	onPaddingChange: (value: number) => void;
}) {
	return (
		<div className="d-f fd-c g-2 px-2 pt-1 pb-4">
			<div className="d-f jc-sb ai-c">
				<span className="fs-sm ff-m c-accent-dim us-none">Padding</span>
				<span className="fs-sm ff-m c-accent-dim us-none">{padding}px</span>
			</div>
			<div className="d-g gtc-4 g-1">
				{PADDING_OPTIONS.map((option) => (
					<Button
						key={option}
						onClick={() => onPaddingChange(option)}
						aria-pressed={padding === option}
						className={`py-2 fs-xs ff-m us-none c-p bw-1 bs-s fv:os-s fv:oo-2 fv:oc-accent ${
							padding === option
								? "bg-accent bc-accent c-page"
								: "bg-transparent bc-border c-accent-dim h:c-accent h:bc-accent"
						}`}
					>
						{option}
					</Button>
				))}
			</div>
		</div>
	);
}
