"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-bold text-red-600">
          Foody
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-zinc-700 hover:text-red-600">
            Home
          </Link>
          <Link href="/cart" className="text-zinc-700 hover:text-red-600">
            Cart
          </Link>

          {token ? (
            <button
              type="button"
              onClick={clearToken}
              className="rounded-md bg-zinc-900 px-3 py-2 text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-red-600 px-3 py-2 text-white"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}