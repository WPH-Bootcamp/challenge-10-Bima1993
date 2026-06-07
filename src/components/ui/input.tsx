"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition placeholder:text-zinc-500 focus:border-red-600 disabled:bg-white disabled:opacity-100",
        className
      )}
      {...props}
    />
  );
}
