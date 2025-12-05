"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
};

function toast({ title, description, variant }: ToastProps) {
  if (variant === "destructive") {
    sonnerToast.error(title as string, {
      description: description as string,
    });
  } else {
    sonnerToast.success(title as string, {
      description: description as string,
    });
  }
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
