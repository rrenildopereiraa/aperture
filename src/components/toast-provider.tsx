import { Toast } from "@base-ui/react/toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createContext, type ReactNode, useContext, useRef } from "react";

interface ToastOptions {
	title: string;
	description?: string;
	type?: "success" | "error" | "warning" | "info";
}

const ToastContext = createContext<{
	add: (options: ToastOptions) => void;
} | null>(null);

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within ToastProvider");
	return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
	return (
		<Toast.Provider>
			<ToastInner>{children}</ToastInner>
		</Toast.Provider>
	);
}

function ToastItem({
	toast,
}: {
	toast: React.ComponentProps<typeof Toast.Root>["toast"];
}) {
	const ref = useRef<HTMLDivElement>(null);

	// GSAP drives the entrance; the exit is a CSS transition (see index.css)
	// so Base UI's toast manager can await it before unmounting.
	useGSAP(
		() => {
			const el = ref.current;
			// Skip the entrance when the tab isn't visible: rAF (and GSAP's
			// ticker) is paused while hidden, which would otherwise leave the
			// toast stuck at its initial opacity: 0 until the tab is focused.
			if (!el || document.hidden) return;
			gsap.set(el, { opacity: 0, x: 24, scale: 0.96 });
			gsap.to(el, {
				opacity: 1,
				x: 0,
				scale: 1,
				duration: 0.35,
				ease: "power3.out",
				clearProps: "opacity,transform,translate,scale",
				onComplete: () => {
					el.style.transition = "opacity 200ms ease, transform 200ms ease";
				},
			});
		},
		{ scope: ref },
	);

	return (
		<Toast.Root
			ref={ref}
			toast={toast}
			className="toast-item d-f fd-c g-1 w-72 px-4 py-3 bg-surface bw-1 bs-s bc-border bs-o-xs"
		>
			<Toast.Title className="ff-m fs-sm c-accent fw-700">
				{toast.title}
			</Toast.Title>
			{toast.description && (
				<Toast.Description className="ff-m fs-xs c-accent-dim">
					{toast.description}
				</Toast.Description>
			)}
		</Toast.Root>
	);
}

function ToastInner({ children }: { children: ReactNode }) {
	const { add, toasts } = Toast.useToastManager();

	return (
		<ToastContext.Provider value={{ add }}>
			{children}
			<Toast.Viewport className="p-f b-4 r-4 zi-60 d-f fd-c g-2">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} />
				))}
			</Toast.Viewport>
		</ToastContext.Provider>
	);
}
