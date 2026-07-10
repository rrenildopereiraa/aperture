import { Button } from "@base-ui/react/button";
import { Separator } from "@base-ui/react/separator";

export function StatusBar({
	onOpenPalette,
	width,
	height,
}: {
	onOpenPalette: () => void;
	width: number;
	height: number;
}) {
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
				onClick={onOpenPalette}
				className="d-f ai-c jc-sb g-2 w-64 my-1 px-3 py-1 bg-page c-accent-dim fs-xs ff-m us-none c-p bw-0 h:c-accent fv:os-s fv:oo--2 fv:oc-accent"
			>
				Search...
				<span className="px-1 bw-1 bs-s bc-border fs-xs c-accent-dim ws-nw">
					Ctrl K
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
