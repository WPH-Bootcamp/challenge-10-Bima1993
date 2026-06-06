"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, UserCircle } from "lucide-react";
import { useCart } from "@/lib/query/use-cart";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { data: cartData } = useCart(Boolean(token));
  const totalItems = cartData?.data.summary.totalItems ?? 0;

  if (
    [
      "/",
      "/cart",
      "/category",
      "/checkout",
      "/login",
      "/orders",
      "/register",
      "/success",
      "/profile",
    ].includes(pathname) ||
    pathname.startsWith("/resto/")
  ) {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Foody-Logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-extrabold text-zinc-950">Foody</span>
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
            {totalItems > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            ) : null}
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
              onClick={() => {
                clearToken();
                window.location.replace("/");
              }}
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
