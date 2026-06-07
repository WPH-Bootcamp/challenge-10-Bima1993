"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FoodyHeader } from "@/components/shared/foody-header";
import { toast } from "@/components/ui/toast";
import { useRequireAuth } from "@/lib/auth/use-require-auth";
import {
  useCart,
  useClearCartMutation,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/lib/query/use-cart";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CartPageContent() {
  const token = useRequireAuth();
  const { data, isLoading, isError } = useCart(Boolean(token));
  const clearCartMutation = useClearCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const deleteCartItemMutation = useDeleteCartItemMutation();

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

  function showCartError() {
    toast.error("Cart gagal diperbarui", "Coba ulangi beberapa saat lagi.");
  }

  function handleClearCart() {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => toast.success("Cart dikosongkan"),
      onError: showCartError,
    });
  }

  function handleUpdateQuantity(id: number, quantity: number) {
    updateCartItemMutation.mutate(
      { id, quantity },
      {
        onSuccess: () => toast.success("Cart diperbarui"),
        onError: showCartError,
      }
    );
  }

  function handleDeleteItem(id: number) {
    deleteCartItemMutation.mutate(id, {
      onSuccess: () => toast.success("Item dihapus dari cart"),
      onError: showCartError,
    });
  }

  if (isEmpty) {
    return (
      <main className="min-h-screen bg-white">
        <FoodyHeader />
        <section className="mx-auto w-[calc(100%-32px)] max-w-[1200px] py-10 sm:w-[calc(100%-48px)]">
          <div className="rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <h1 className="text-2xl font-extrabold text-zinc-950">My Cart</h1>
            <p className="mt-4 text-sm text-zinc-600">Cart masih kosong.</p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-red-600 px-6 text-sm font-bold text-white"
            >
              Lihat Restoran
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <FoodyHeader />
      <section className="mx-auto w-[calc(100%-32px)] max-w-[1200px] py-10 sm:w-[calc(100%-48px)]">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-zinc-950">My Cart</h1>
          <button
            type="button"
            disabled={clearCartMutation.isPending}
            onClick={handleClearCart}
            className="hidden h-10 rounded-full border border-zinc-300 px-4 text-sm font-bold disabled:opacity-60 sm:block"
          >
            {clearCartMutation.isPending ? "Menghapus..." : "Kosongkan Cart"}
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:max-w-[560px]">
          {groups.map((group) => (
            <section
              key={group.restaurant.id}
              className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <Link
                href={`/resto/${group.restaurant.id}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={group.restaurant.logo}
                    alt={`${group.restaurant.name} logo`}
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <h2 className="font-extrabold text-zinc-950">
                  {group.restaurant.name}
                </h2>
                <ChevronRight className="h-5 w-5" />
              </Link>

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
                      <p className="mt-1 font-extrabold text-zinc-950">
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
                            handleDeleteItem(item.id);
                            return;
                          }

                          handleUpdateQuantity(item.id, item.quantity - 1);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-lg disabled:opacity-60"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={updateCartItemMutation.isPending}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-lg text-white disabled:opacity-60"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-dashed border-zinc-200 pt-4">
                <p className="text-sm text-zinc-600">Total</p>
                <p className="mt-1 text-xl font-extrabold text-zinc-950">
                  {formatRupiah(group.subtotal)}
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-4 flex h-12 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-extrabold text-white"
              >
                Checkout
              </Link>
            </section>
          ))}
        </div>

        {summary ? (
          <div className="mt-5 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] lg:max-w-[560px]">
            <div className="flex items-center justify-between text-sm">
              <span>Total item</span>
              <span className="font-extrabold">{summary.totalItems}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>Total harga</span>
              <span className="font-extrabold">
                {formatRupiah(summary.totalPrice)}
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
