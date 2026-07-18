import { Toast } from "@base-ui/react/toast";
import { XIcon } from "@phosphor-icons/react";
import { createContext, type ReactNode, useContext } from "react";

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

const TOAST_ACCENT: Record<string, string> = {
	success: "#86efac",
	error: "#fca5a5",
	warning: "#fcd34d",
	info: "#2563eb",
};

function toastAccent(type: string | undefined) {
	return TOAST_ACCENT[type ?? "info"] ?? TOAST_ACCENT.info;
}

function ToastInner({ children }: { children: ReactNode }) {
	const { add, toasts } = Toast.useToastManager();

	return (
		<ToastContext.Provider value={{ add }}>
			{children}
			<Toast.Viewport className="p-f t-12 l-50% ttx--half @lg:ml--36 zi-60 d-f fd-c g-2">
				{toasts.map((toast) => {
					const accent = toastAccent(toast.type);
					return (
						<Toast.Root
							key={toast.id}
							toast={toast}
							style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
							className="toast-root p-r d-f fd-c g-1 w-72 pl-4 pr-8 py-3 bg-surface bw-1 bs-s bc-border bs-o-xs"
						>
							<Toast.Title
								className="ff-m fs-sm fw-700"
								style={{ color: accent }}
							>
								{toast.title}
							</Toast.Title>
							{toast.description && (
								<Toast.Description className="ff-m fs-xs c-accent-dim">
									{toast.description}
								</Toast.Description>
							)}
							<Toast.Close
								aria-label="Dismiss"
								className="p-a t-2 r-2 d-f ai-c jc-c w-5 h-5 bg-transparent bw-0 p-0 c-accent-dim c-p h:c-accent fv:os-s fv:oo-2 fv:oc-accent"
							>
								<XIcon size={12} weight="bold" />
							</Toast.Close>
						</Toast.Root>
					);
				})}
			</Toast.Viewport>
		</ToastContext.Provider>
	);
}
