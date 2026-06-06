"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useCart,
  useClearCartMutation,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/lib/query/use-cart";
import { useAuthStore } from "@/store/auth-store";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CartPageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, isError } = useCart(Boolean(token));
  const clearCartMutation = useClearCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const deleteCartItemMutation = useDeleteCartItemMutation();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  if (!token) {
    return <p className="text-sm text-zinc-600">Mengalihkan ke login...</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-600">Memuat cart...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat cart. Pastikan kamu sudah login.
      </p>
    );
  }

  const groups = data?.data.cart ?? [];
  const summary = data?.data.summary;
  const isEmpty = groups.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-semibold">My Cart</h1>
        <p className="mt-4 text-sm text-zinc-600">Cart masih kosong.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-red-600 px-4 text-sm font-semibold text-white"
        >
          Lihat Restoran
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">My Cart</h1>
        <button
          type="button"
          disabled={clearCartMutation.isPending}
          onClick={() => clearCartMutation.mutate()}
          className="h-10 rounded-md border px-4 text-sm font-medium disabled:opacity-60"
        >
          {clearCartMutation.isPending ? "Menghapus..." : "Kosongkan Cart"}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <section
            key={group.restaurant.id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-md bg-zinc-100">
                <Image
                  src={group.restaurant.logo}
                  alt={`${group.restaurant.name} logo`}
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <h2 className="font-semibold">{group.restaurant.name}</h2>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[72px_1fr_auto] items-center gap-4"
                >
                  <div className="relative h-[72px] w-[72px] overflow-hidden rounded-lg bg-zinc-100">
                    <Image
                      src={item.menu.image}
                      alt={item.menu.foodName}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm">{item.menu.foodName}</p>
                    <p className="mt-1 font-semibold">
                      {formatRupiah(item.menu.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={
                        updateCartItemMutation.isPending ||
                        deleteCartItemMutation.isPending
                      }
                      onClick={() => {
                        if (item.quantity <= 1) {
                          deleteCartItemMutation.mutate(item.id);
                          return;
                        }

                        updateCartItemMutation.mutate({
                          id: item.id,
                          quantity: item.quantity - 1,
                        });
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border text-lg disabled:opacity-60"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={updateCartItemMutation.isPending}
                      onClick={() =>
                        updateCartItemMutation.mutate({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-lg text-white disabled:opacity-60"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-dashed pt-4">
              <p className="text-sm text-zinc-600">Total</p>
              <p className="mt-1 text-lg font-semibold">
                {formatRupiah(group.subtotal)}
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-4 flex h-11 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white"
            >
              Checkout
            </Link>
          </section>
        ))}
      </div>

      {summary ? (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between text-sm">
            <span>Total item</span>
            <span className="font-semibold">{summary.totalItems}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Total harga</span>
            <span className="font-semibold">
              {formatRupiah(summary.totalPrice)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
