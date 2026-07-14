import { Toast } from "@base-ui/react/toast";
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

function ToastInner({ children }: { children: ReactNode }) {
	const { add, toasts } = Toast.useToastManager();

	return (
		<ToastContext.Provider value={{ add }}>
			{children}
			<Toast.Viewport className="p-f b-4 r-4 zi-60 d-f fd-c g-2">
				{toasts.map((toast) => (
					<Toast.Root
						key={toast.id}
						toast={toast}
						className="d-f fd-c g-1 w-72 px-4 py-3 bg-surface bw-1 bs-s bc-border bs-o-xs"
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
				))}
			</Toast.Viewport>
		</ToastContext.Provider>
	);
}
