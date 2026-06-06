"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);

  if (["/login", "/register", "/success"].includes(pathname)) {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Foody Logo.png"
            alt="Foody"
            width={116}
            height={36}
            priority
          />
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-zinc-700 hover:text-red-600">
            Home
          </Link>
          <Link
            href="/cart"
            className="relative text-zinc-700 hover:text-red-600"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Link>
          <Link href="/orders" className="text-zinc-700 hover:text-red-600">
            Orders
          </Link>
          {token ? (
            <Link
              href="/profile"
              className="text-zinc-700 hover:text-red-600"
              aria-label="Profile"
            >
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          ) : null}

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
