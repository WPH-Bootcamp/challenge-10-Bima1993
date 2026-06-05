"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart, useClearCartMutation } from "@/lib/query/use-cart";
import { useAuthStore } from "@/store/auth-store";

export function CartPageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, isError } = useCart(Boolean(token));
  const clearCartMutation = useClearCartMutation();

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

  const groups = data?.data ?? [];
  const isEmpty = groups.length === 0;

  if (isEmpty) {
    return <p className="text-sm text-zinc-600">Cart masih kosong.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <button
          type="button"
          disabled={clearCartMutation.isPending}
          onClick={() => clearCartMutation.mutate()}
          className="h-10 rounded-md border px-4 text-sm font-medium disabled:opacity-60"
        >
          {clearCartMutation.isPending ? "Menghapus..." : "Kosongkan Cart"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <section
            key={group.restaurantId}
            className="rounded-lg border bg-white p-4"
          >
            <h2 className="font-semibold">
              {group.restaurantName ?? `Restoran ${group.restaurantId}`}
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-t pt-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.menu?.foodName ?? `Menu ${item.menuId}`}
                    </p>
                    <p className="text-sm text-zinc-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}