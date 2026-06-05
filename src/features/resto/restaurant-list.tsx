"use client";

import Image from "next/image";
import Link from "next/link";
import { useRestaurants } from "@/lib/query/use-restaurants";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RestaurantList() {
  const { data, isLoading, isError } = useRestaurants();

  if (isLoading) {
    return <p className="text-sm text-zinc-600">Memuat restoran...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat restoran. Coba lagi nanti.
      </p>
    );
  }

  const restaurants = data?.data.restaurants ?? [];

  if (restaurants.length === 0) {
    return <p className="text-sm text-zinc-600">Belum ada restoran.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => {
        const coverImage = restaurant.images[0] ?? restaurant.logo;

        return (
          <Link
            key={restaurant.id}
            href={`/resto/${restaurant.id}`}
            className="overflow-hidden rounded-lg border bg-white transition hover:border-red-200 hover:shadow-sm"
          >
            <article>
              <div className="relative h-40 w-full bg-zinc-100">
                <Image
                  src={coverImage}
                  alt={restaurant.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-white">
                    <Image
                      src={restaurant.logo}
                      alt={`${restaurant.name} logo`}
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {restaurant.name}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      {restaurant.place}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
                  <span className="rounded-full bg-zinc-100 px-2 py-1">
                    {restaurant.category}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-1">
                    Rating {restaurant.star}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-1">
                    {restaurant.menuCount} menu
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-900">
                  {formatRupiah(restaurant.priceRange.min)} -{" "}
                  {formatRupiah(restaurant.priceRange.max)}
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
