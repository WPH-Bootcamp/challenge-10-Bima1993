"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, Package, Search, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FoodyHeader } from "@/components/shared/foody-header";
import { useProfile } from "@/lib/query/use-auth";
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

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

export function OrdersPageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const [status, setStatus] = useState("done");
  const [reviewOrder, setReviewOrder] = useState<OrderTransaction | null>(null);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const { data: profile } = useProfile(Boolean(token));
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
    <main className="min-h-screen bg-white">
      <FoodyHeader />

      <section className="mx-auto w-[calc(100%-32px)] max-w-[1200px] py-10 sm:w-[calc(100%-48px)]">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden h-max rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:block">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
                {getInitial(profile?.name)}
              </span>
              <p className="font-extrabold text-zinc-950">
                {profile?.name ?? "John Doe"}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-5 border-t border-zinc-200 pt-5 text-sm">
              <span className="flex items-center gap-3 text-zinc-950">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </span>
              <span className="flex items-center gap-3 font-semibold text-red-600">
                <Package className="h-5 w-5" />
                My Orders
              </span>
              <button
                type="button"
                className="flex items-center gap-3 text-left text-zinc-950"
                onClick={() => {
                  clearToken();
                  window.location.replace("/");
                }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>

          <section>
            <h1 className="text-3xl font-extrabold text-zinc-950">My Orders</h1>

            <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="flex h-11 items-center gap-2 rounded-full border border-zinc-300 px-4 text-sm text-zinc-500">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm font-extrabold">Status</span>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={`h-10 rounded-full border px-4 text-sm font-semibold ${
                      status === option.value
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-5">
                {isLoading ? (
                  <p className="text-sm text-zinc-600">Memuat order...</p>
                ) : null}

                {isError ? (
                  <p className="text-sm text-red-600">Gagal memuat order.</p>
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
                      className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
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
                        <h2 className="font-extrabold text-zinc-950">
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
                            <p className="mt-1 font-extrabold text-zinc-950">
                              {firstItem.quantity} x{" "}
                              {formatRupiah(firstItem.price)}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-5 border-t border-zinc-200 pt-4">
                        <p className="text-sm text-zinc-600">Total</p>
                        <p className="mt-1 text-xl font-extrabold text-zinc-950">
                          {formatRupiah(order.pricing.totalPrice)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setReviewOrder(order)}
                        className="mt-4 h-12 w-full rounded-full bg-red-600 px-4 text-sm font-extrabold text-white lg:ml-auto lg:flex lg:w-[240px] lg:items-center lg:justify-center"
                      >
                        Give Review
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>
        </div>
      </section>

      {reviewOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 px-6 backdrop-blur-[1px]">
          <section className="w-full max-w-[440px] rounded-[16px] bg-white px-6 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[26px] font-extrabold leading-none text-zinc-950">
                Give Review
              </h2>
              <button
                type="button"
                onClick={() => setReviewOrder(null)}
                aria-label="Close review"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-950"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <div className="mt-9 text-center">
              <p className="text-base font-extrabold text-zinc-950">
                Give Rating
              </p>
              <div className="mt-4 flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rating ${star}`}
                  >
                    <Star
                      className={`h-11 w-11 ${
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
              rows={8}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Please share your thoughts about our service!"
              className="mt-8 h-[235px] w-full resize-none rounded-[12px] border border-zinc-300 p-4 text-base leading-6 outline-none placeholder:text-zinc-500 focus:border-red-600"
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
              className="mt-5 h-12 w-full rounded-full bg-red-600 px-4 text-base font-extrabold text-white disabled:opacity-60"
            >
              {createReviewMutation.isPending ? "Sending..." : "Send"}
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
