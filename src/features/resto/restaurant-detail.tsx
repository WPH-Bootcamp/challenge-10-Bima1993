"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAddToCartMutation } from "@/lib/query/use-cart";
import { useRestaurantDetail } from "@/lib/query/use-restaurants";
import { useAuthStore } from "@/store/auth-store";

type RestaurantDetailProps = {
  id: string;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RestaurantDetail({ id }: RestaurantDetailProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, isError } = useRestaurantDetail(id);
  const addToCartMutation = useAddToCartMutation();

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

  const coverImage = restaurant.images[0] ?? restaurant.logo;

  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-lg border bg-white">
        <div className="relative h-64 w-full bg-zinc-100">
          <Image
            src={coverImage}
            alt={restaurant.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white">
              <Image
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-red-600">
                {restaurant.category}
              </p>
              <h1 className="mt-1 text-2xl font-semibold">
                {restaurant.name}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">{restaurant.place}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-zinc-700">
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              Rating {restaurant.averageRating}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              {restaurant.totalMenus} menu
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">
              {restaurant.totalReviews} review
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold">Menu</h2>
          <p className="text-sm text-zinc-600">
            Pilih menu favorit dari restoran ini.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurant.menus.map((menu) => (
            <article
              key={menu.id}
              className="overflow-hidden rounded-lg border bg-white"
            >
              <div className="relative h-40 w-full bg-zinc-100">
                <Image
                  src={menu.image}
                  alt={menu.foodName}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div>
                  <p className="text-xs uppercase text-zinc-500">
                    {menu.type}
                  </p>
                  <h3 className="mt-1 font-semibold">{menu.foodName}</h3>
                  <p className="mt-1 text-sm font-medium text-zinc-900">
                    {formatRupiah(menu.price)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={addToCartMutation.isPending}
                  onClick={() => {
                    if (!token) {
                      router.push("/login");
                      return;
                    }

                    addToCartMutation.mutate({
                      restaurantId: restaurant.id,
                      menuId: menu.id,
                      quantity: 1,
                    });
                  }}
                  className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {addToCartMutation.isPending
                    ? "Menambahkan..."
                    : "Tambah ke Cart"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}