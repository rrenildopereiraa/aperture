import { Button } from "@base-ui/react/button";
import { Separator } from "@base-ui/react/separator";
import { useHaptics } from "../lib/haptics";
import { modKey } from "../lib/platform";

export function StatusBar({
	onOpenPalette,
	width,
	height,
}: {
	onOpenPalette: () => void;
	width: number;
	height: number;
}) {
	const { trigger: haptic } = useHaptics();

	return (
		<footer className="d-f ai-c btw-1 bs-s bc-border bg-surface">
			<div className="f-1 d-f ai-c">
				<img src="/favicon.svg" className="w-4 h-4 mx-2" alt="" />

				<Separator
					orientation="vertical"
					className="h-4 brw-1 bs-s bc-border"
				/>
			</div>

			<Button
				onClick={() => {
					haptic("success");
					onOpenPalette();
				}}
				style={{ marginRight: "var(--content-inset)" }}
				className="d-f ai-c jc-sb g-2 w-64 my-1 px-3 py-1 bg-page bw-1 bc-border c-accent-dim fs-xs ff-m us-none c-p bw-0 bs-i-xs h:c-accent fv:os-s fv:oo--2 fv:oc-accent"
			>
				Search commands...
				<span className=" px-1 bw-1 bs-s bc-border fs-xs c-accent-dim ws-nw">
					{modKey}K
				</span>
			</Button>

			<div className="f-1 d-f ai-c jc-fe">
				<span className="px-3 py-1 ff-m fs-xs c-accent-dim">
					{width} × {height}
				</span>
				<Separator orientation="vertical" className="h-4 w-px bg-border" />
				<span className="py-1 pr-3 pl-3 ff-m fs-xs c-accent-dim">2x</span>
			</div>
		</footer>
	);
}
