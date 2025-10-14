"use client";

import * as React from "react";

import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
          {toast.action}
        </Toast>
      ))}
    </div>
  );
}
