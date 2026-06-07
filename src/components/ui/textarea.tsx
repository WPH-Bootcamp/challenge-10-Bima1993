"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-zinc-500 focus:border-red-600 disabled:bg-white disabled:opacity-100",
        className
      )}
      {...props}
    />
  );
}
