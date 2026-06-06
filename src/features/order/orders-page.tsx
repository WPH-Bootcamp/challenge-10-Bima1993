"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMyOrders } from "@/lib/query/use-order";
import { useCreateReviewMutation } from "@/lib/query/use-review";
import { useAuthStore } from "@/store/auth-store";
import type { OrderTransaction } from "@/types/order";

const statusOptions = [
  { label: "Preparing", value: "preparing" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Done", value: "done" },
  { label: "Canceled", value: "canceled" },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function OrdersPageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const [status, setStatus] = useState("done");
  const [reviewOrder, setReviewOrder] = useState<OrderTransaction | null>(null);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const { data, isLoading, isError } = useMyOrders(status, Boolean(token));
  const createReviewMutation = useCreateReviewMutation();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  if (!token) {
    return <p className="text-sm text-zinc-600">Mengalihkan ke login...</p>;
  }

  const orders = data?.data.orders ?? [];

  function submitReview() {
    const firstGroup = reviewOrder?.restaurants[0];

    if (!reviewOrder || !firstGroup) {
      return;
    }

    createReviewMutation.mutate(
      {
        transactionId: reviewOrder.transactionId,
        restaurantId: firstGroup.restaurant.id,
        star: rating,
        comment,
        menuIds: firstGroup.items.map((item) => item.menuId),
      },
      {
        onSuccess: () => {
          setComment("");
          setRating(4);
          setReviewOrder(null);
        },
      }
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden h-max rounded-2xl bg-white p-5 shadow-sm lg:block">
          <p className="font-semibold">John Doe</p>
          <div className="mt-5 border-t pt-5 text-sm">
            <p className="text-zinc-600">Delivery Address</p>
            <p className="mt-4 font-semibold text-red-600">My Orders</p>
            <button
              type="button"
              className="mt-4 text-zinc-600"
              onClick={() => {
                clearToken();
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <main>
          <h1 className="text-2xl font-semibold">My Orders</h1>

          <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex h-11 items-center gap-2 rounded-full border px-4 text-sm text-zinc-500">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold">Status</span>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`h-10 rounded-full border px-4 text-sm ${
                    status === option.value
                      ? "border-red-600 bg-red-50 text-red-600"
                      : "border-zinc-200 text-zinc-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {isLoading ? (
                <p className="text-sm text-zinc-600">Memuat order...</p>
              ) : null}

              {isError ? (
                <p className="text-sm text-red-600">
                  Gagal memuat order.
                </p>
              ) : null}

              {!isLoading && !isError && orders.length === 0 ? (
                <p className="text-sm text-zinc-600">Belum ada order.</p>
              ) : null}

              {orders.map((order) => {
                const firstGroup = order.restaurants[0];
                const firstItem = firstGroup?.items[0];

                return (
                  <article
                    key={order.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {firstGroup ? (
                        <div className="relative h-8 w-8 overflow-hidden rounded-md bg-zinc-100">
                          <Image
                            src={firstGroup.restaurant.logo}
                            alt={`${firstGroup.restaurant.name} logo`}
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        </div>
                      ) : null}
                      <h2 className="font-semibold">
                        {firstGroup?.restaurant.name ?? order.transactionId}
                      </h2>
                    </div>

                    {firstItem ? (
                      <div className="mt-5 grid grid-cols-[72px_1fr] gap-4">
                        {firstItem.image ? (
                          <div className="relative h-[72px] w-[72px] overflow-hidden rounded-lg bg-zinc-100">
                            <Image
                              src={firstItem.image}
                              alt={firstItem.menuName}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div>
                          <p className="text-sm">{firstItem.menuName}</p>
                          <p className="mt-1 font-semibold">
                            {firstItem.quantity} x{" "}
                            {formatRupiah(firstItem.price)}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-5 border-t pt-4">
                      <p className="text-sm text-zinc-600">Total</p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatRupiah(order.pricing.totalPrice)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReviewOrder(order)}
                      className="mt-4 h-11 w-full rounded-full bg-red-600 px-4 text-sm font-semibold text-white"
                    >
                      Give Review
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {reviewOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Give Review</h2>
              <button
                type="button"
                onClick={() => setReviewOrder(null)}
                aria-label="Close review"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="font-semibold">Give Rating</p>
              <div className="mt-3 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rating ${star}`}
                  >
                    <Star
                      className={`h-9 w-9 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-zinc-300 text-zinc-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={7}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Please share your thoughts about our service!"
              className="mt-6 w-full rounded-xl border border-zinc-200 p-3 text-sm outline-none focus:border-red-600"
            />

            {createReviewMutation.isError ? (
              <p className="mt-2 text-sm text-red-600">
                Review gagal dikirim. Coba lagi nanti.
              </p>
            ) : null}

            <button
              type="button"
              onClick={submitReview}
              disabled={!comment.trim() || createReviewMutation.isPending}
              className="mt-4 h-11 w-full rounded-full bg-red-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {createReviewMutation.isPending ? "Sending..." : "Send"}
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
