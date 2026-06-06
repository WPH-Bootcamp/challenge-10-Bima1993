"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/query/use-cart";
import { useProfile } from "@/lib/query/use-auth";
import { useAuthStore } from "@/store/auth-store";

const pageContainer =
  "mx-auto w-[calc(100%-32px)] max-w-[1200px] sm:w-[calc(100%-48px)]";

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

export function FoodyHeader() {
  const token = useAuthStore((state) => state.token);
  const { data: cartData } = useCart(Boolean(token));
  const { data: profile } = useProfile(Boolean(token));
  const totalItems = cartData?.data.summary.totalItems ?? 0;

  return (
    <header className="border-b border-zinc-100 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
      <div className={`${pageContainer} flex h-[72px] items-center justify-between`}>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Foody-Logo.png"
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] object-contain"
          />
          <span className="text-2xl font-extrabold text-zinc-950">Foody</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingBag className="h-5 w-5 text-zinc-950" />
            {totalItems > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {token ? (
            <Link href="/profile" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {getInitial(profile?.name)}
              </span>
              <span className="hidden text-sm font-semibold text-zinc-950 sm:inline">
                {profile?.name ?? "John Doe"}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-zinc-950">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
