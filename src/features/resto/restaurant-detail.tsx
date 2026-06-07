"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react";
import { FoodyHeader } from "@/components/shared/foody-header";
import { toast } from "@/components/ui/toast";
import {
  useAddToCartMutation,
  useCart,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/lib/query/use-cart";
import { useRestaurantDetail } from "@/lib/query/use-restaurants";
import { useAuthStore } from "@/store/auth-store";
import type { CartItem } from "@/types/cart";
import type { RestaurantMenu, RestaurantReview } from "@/types/resto";

type RestaurantDetailProps = {
  id: string;
};

const fallbackReviews: Required<
  Pick<RestaurantReview, "name" | "star" | "comment" | "createdAt">
>[] = [
  {
    name: "Michael Brown",
    star: 5,
    createdAt: "25 August 2025, 13:38",
    comment:
      "What a fantastic place! The food was delicious, and the ambiance was delightful. A must-visit for anyone looking for a great time!",
  },
  {
    name: "Sarah Davis",
    star: 5,
    createdAt: "25 August 2025, 13:38",
    comment:
      "I can't say enough good things! The service was exceptional, and the menu had so many great options. Definitely a five-star experience!",
  },
  {
    name: "David Wilson",
    star: 5,
    createdAt: "25 August 2025, 13:38",
    comment:
      "This place exceeded my expectations! The staff were welcoming, and the vibe was just right. I'll be returning soon!",
  },
  {
    name: "Emily Johnson",
    star: 5,
    createdAt: "25 August 2025, 13:38",
    comment:
      "Absolutely loved my visit! The staff were friendly and attentive, making sure everything was just right. Can't wait to come back!",
  },
  {
    name: "Jessica Taylor",
    star: 5,
    createdAt: "25 August 2025, 13:38",
    comment:
      "A wonderful experience overall! The food was exquisite, and the service was impeccable. Highly recommend for a special night out!",
  },
  {
    name: "Alex Smith",
    star: 5,
    createdAt: "25 August 2025, 13:38",
    comment:
      "I had an amazing experience! The service was top-notch, and the atmosphere was perfect for a relaxing evening. Highly recommend!",
  },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function uniqueImages(images: string[]) {
  return Array.from(new Set(images.filter(Boolean)));
}

function ReviewStars({ value = 5 }: { value?: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }`}
        />
      ))}
    </div>
  );
}

export function RestaurantDetail({ id }: RestaurantDetailProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, isError } = useRestaurantDetail(id);
  const { data: cartData } = useCart(Boolean(token));
  const addToCartMutation = useAddToCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const deleteCartItemMutation = useDeleteCartItemMutation();
  const isCartActionPending =
    addToCartMutation.isPending ||
    updateCartItemMutation.isPending ||
    deleteCartItemMutation.isPending;

  if (isLoading) {
    return <p className="text-sm text-zinc-600">Memuat detail restoran...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat detail restoran. Coba lagi nanti.
      </p>
    );
  }

  const restaurant = data?.data;

  if (!restaurant) {
    return <p className="text-sm text-zinc-600">Restoran tidak ditemukan.</p>;
  }

  const restaurantId = restaurant.id;
  const cartItems =
    cartData?.data.cart.flatMap((group) => group.items) ?? [];
  const selectedCartGroup = cartData?.data.cart.find(
    (group) => group.restaurant.id === restaurantId
  );
  const selectedCartItems = selectedCartGroup?.items ?? [];
  const selectedItemCount = selectedCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const selectedSubtotal = selectedCartGroup?.subtotal ?? 0;
  const galleryImages = uniqueImages([
    ...restaurant.images,
    ...restaurant.menus.map((menu) => menu.image),
    restaurant.logo,
  ]);
  const coverImage = galleryImages[0] ?? restaurant.logo;
  const menuTypes = Array.from(
    new Set(restaurant.menus.map((menu) => menu.type))
  ).slice(0, 2);
  const reviews =
    restaurant.reviews.length > 0 ? restaurant.reviews : fallbackReviews;
  const reviewCount = restaurant.totalReviews || reviews.length;

  function getCartItem(menu: RestaurantMenu): CartItem | undefined {
    return cartItems.find((item) => item.menu.id === menu.id);
  }

  function requireLogin() {
    if (!token) {
      router.push("/login");
      return false;
    }

    return true;
  }

  function addMenu(menu: RestaurantMenu, cartItem?: CartItem) {
    if (!requireLogin()) {
      return;
    }

    if (cartItem) {
      updateCartItemMutation.mutate(
        {
          id: cartItem.id,
          quantity: cartItem.quantity + 1,
        },
        {
          onSuccess: () => toast.success("Cart diperbarui"),
          onError: () =>
            toast.error("Cart gagal diperbarui", "Coba ulangi lagi."),
        }
      );
      return;
    }

    addToCartMutation.mutate(
      {
        restaurantId,
        menuId: menu.id,
        quantity: 1,
      },
      {
        onSuccess: () => toast.success("Menu ditambahkan ke cart"),
        onError: () =>
          toast.error("Menu gagal ditambahkan", "Coba ulangi lagi."),
      }
    );
  }

  function reduceMenu(cartItem: CartItem) {
    if (!requireLogin()) {
      return;
    }

    if (cartItem.quantity <= 1) {
      deleteCartItemMutation.mutate(cartItem.id, {
        onSuccess: () => toast.success("Item dihapus dari cart"),
        onError: () =>
          toast.error("Cart gagal diperbarui", "Coba ulangi lagi."),
      });
      return;
    }

    updateCartItemMutation.mutate(
      {
        id: cartItem.id,
        quantity: cartItem.quantity - 1,
      },
      {
        onSuccess: () => toast.success("Cart diperbarui"),
        onError: () =>
          toast.error("Cart gagal diperbarui", "Coba ulangi lagi."),
      }
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <FoodyHeader />

      <div className="mx-auto flex w-[calc(100%-32px)] max-w-[1040px] flex-col gap-8 py-4 pb-24 sm:w-[calc(100%-48px)] sm:gap-10 sm:py-10">
      <section className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
        <div className="relative h-[262px] overflow-hidden rounded-xl bg-zinc-100 sm:h-[320px] lg:h-auto lg:min-h-[360px]">
          <Image
            src={coverImage}
            alt={restaurant.name}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="hidden grid-cols-2 gap-4 lg:grid">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`relative min-h-[132px] overflow-hidden rounded-xl bg-zinc-100 ${
                index === 1 ? "col-span-2" : ""
              }`}
            >
              <Image
                src={galleryImages[index] ?? coverImage}
                alt={`${restaurant.name} gallery ${index}`}
                fill
                sizes="(min-width: 1024px) 400px, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 lg:hidden">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-2 w-2 rounded-full ${
                dot === 0 ? "bg-red-600" : "bg-zinc-300"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="border-b border-zinc-200 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full bg-orange-50 sm:h-20 sm:w-20 sm:rounded-xl">
              <Image
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold text-zinc-950 sm:text-2xl">
                {restaurant.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400 sm:h-4 sm:w-4" />
                {restaurant.averageRating || restaurant.star}
              </p>
              <p className="mt-2 whitespace-nowrap text-sm text-zinc-700">
                {restaurant.place} - 2.4 km
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-sm font-semibold sm:h-10 sm:w-auto sm:gap-2 sm:px-5"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-zinc-950">Menu</h2>
        <div className="mt-5 flex gap-3">
          {["All Menu", ...menuTypes].map((type, index) => (
            <button
              key={type}
              type="button"
              className={`h-9 rounded-full border px-4 text-sm font-semibold capitalize ${
                index === 0
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-zinc-200 bg-white text-zinc-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {restaurant.menus.map((menu) => {
            const cartItem = getCartItem(menu);

            return (
              <article
                key={menu.id}
                className="overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="relative aspect-square bg-zinc-100">
                  <Image
                    src={menu.image}
                    alt={menu.foodName}
                    fill
                    sizes="(min-width: 1024px) 240px, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-xs font-semibold text-zinc-700 sm:text-sm">
                    {menu.foodName}
                  </h3>
                  <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-extrabold text-zinc-950">
                      {formatRupiah(menu.price)}
                    </p>

                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isCartActionPending}
                          onClick={() => reduceMenu(cartItem)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 disabled:opacity-60"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={isCartActionPending}
                          onClick={() => addMenu(menu, cartItem)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white disabled:opacity-60"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isCartActionPending}
                        onClick={() => addMenu(menu)}
                        className="h-8 w-full rounded-full bg-red-600 px-5 text-sm font-bold text-white disabled:opacity-60 sm:w-auto"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="h-10 min-w-[140px] rounded-full border border-zinc-300 bg-white px-6 text-sm font-semibold"
          >
            Show More
          </button>
        </div>
      </section>

      <section className="border-t border-zinc-200 pt-8">
        <h2 className="text-2xl font-extrabold text-zinc-950">Review</h2>
        <p className="mt-3 flex items-center gap-2 text-sm font-bold">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {restaurant.averageRating || restaurant.star} ({reviewCount} Ulasan)
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {reviews.slice(0, 6).map((review, index) => (
            <article
              key={`${review.name ?? "review"}-${index}`}
              className="rounded-xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                  {(review.name ?? "U").charAt(0)}
                </span>
                <div>
                  <h3 className="font-bold text-zinc-950">
                    {review.name ?? "Customer"}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {review.createdAt ?? "25 August 2025, 13:38"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <ReviewStars value={review.star ?? 5} />
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-700">
                {review.comment ?? "Great food and wonderful service."}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="h-10 min-w-[140px] rounded-full border border-zinc-300 bg-white px-6 text-sm font-semibold"
          >
            Show More
          </button>
        </div>
      </section>

      {selectedItemCount > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-6 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1040px] items-center justify-between gap-5">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                <ShoppingBag className="h-4 w-4" />
                {selectedItemCount} Items
              </p>
              <p className="mt-1 text-base font-extrabold text-zinc-950">
                {formatRupiah(selectedSubtotal)}
              </p>
            </div>

            <Link
              href="/checkout"
              className="flex h-11 min-w-[180px] items-center justify-center rounded-full bg-red-600 px-8 text-sm font-bold text-white"
            >
              Checkout
            </Link>
          </div>
        </div>
      ) : null}
      </div>
    </main>
  );
}
