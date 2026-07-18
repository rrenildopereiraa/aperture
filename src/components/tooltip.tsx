import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement } from "react";

export function Tooltip({
	content,
	children,
}: {
	content: string;
	children: ReactElement;
}) {
	return (
		<BaseTooltip.Root>
			<BaseTooltip.Trigger render={children} />
			<BaseTooltip.Portal>
				<BaseTooltip.Positioner sideOffset={6} className="zi-90">
					<BaseTooltip.Popup className="px-2 py-1 bw-1 bs-s bc-border bg-surface fs-xs ff-m c-accent-dim us-none bs-o-xs">
						{content}
					</BaseTooltip.Popup>
				</BaseTooltip.Positioner>
			</BaseTooltip.Portal>
		</BaseTooltip.Root>
	);
}
