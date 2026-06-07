"use client";

import { X } from "lucide-react";
import { create } from "zustand";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastStore = {
  toasts: ToastMessage[];
  addToast: (toast: ToastMessage) => void;
  removeToast: (id: string) => void;
};

const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [toast, ...state.toasts].slice(0, 4),
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

function createToast(type: ToastType, title: string, description?: string) {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  useToastStore.getState().addToast({
    id,
    title,
    description,
    type,
  });

  window.setTimeout(() => {
    useToastStore.getState().removeToast(id);
  }, 3600);
}

export const toast = {
  success: (title: string, description?: string) =>
    createToast("success", title, description),
  error: (title: string, description?: string) =>
    createToast("error", title, description),
  info: (title: string, description?: string) =>
    createToast("info", title, description),
};

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-red-200 bg-red-50 text-red-950",
  info: "border-zinc-200 bg-white text-zinc-950",
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-32px)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((item) => (
        <section
          key={item.id}
          className={cn(
            "rounded-xl border px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.12)]",
            toastStyles[item.type]
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-extrabold">{item.title}</h2>
              {item.description ? (
                <p className="mt-1 text-sm leading-5 opacity-80">
                  {item.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              aria-label="Close notification"
              className="mt-0.5 shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
