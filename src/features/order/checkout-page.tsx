"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MapPin, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useRequireAuth } from "@/lib/auth/use-require-auth";
import {
  useCart,
  useUpdateCartItemMutation,
} from "@/lib/query/use-cart";
import { useProfile } from "@/lib/query/use-auth";
import { useCheckoutMutation } from "@/lib/query/use-order";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout";

const paymentMethods = [
  {
    label: "Bank Negara Indonesia",
    value: "Bank Negara Indonesia",
    image: "/images/Bank-BNI.png",
  },
  {
    label: "Bank Rakyat Indonesia",
    value: "Bank Rakyat Indonesia",
    image: "/images/Bank-BRI.png",
  },
  {
    label: "Bank Central Asia",
    value: "Bank Central Asia",
    image: "/images/Bank-BCA.png",
  },
  {
    label: "Mandiri",
    value: "Mandiri",
    image: "/images/Bank-Mandiri.png",
  },
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

export function CheckoutPageContent() {
  const router = useRouter();
  const token = useRequireAuth();
  const { data, isLoading, isError } = useCart(Boolean(token));
  const { data: profile } = useProfile(Boolean(token));
  const checkoutMutation = useCheckoutMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "Jl. Sudirman No. 25, Jakarta Pusat, 10220",
      phone: "0812-3456-7890",
      paymentMethod: paymentMethods[0].value,
      notes: "",
    },
  });

  if (!token) {
    return <p className="text-sm text-zinc-600">Mengalihkan ke login...</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-600">Memuat checkout...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat cart untuk checkout.
      </p>
    );
  }

  const groups = data?.data.cart ?? [];
  const summary = data?.data.summary;
  const totalItems = summary?.totalItems ?? 0;

  if (groups.length === 0 || !summary) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-zinc-600">
          Cart masih kosong. Tambahkan menu terlebih dahulu.
        </p>
      </div>
    );
  }

  const serviceFee = 1000;
  const deliveryFee = 10000;
  const totalPrice = summary.totalPrice + serviceFee + deliveryFee;

  function onSubmit(values: CheckoutFormValues) {
    checkoutMutation.mutate(
      {
        restaurants: groups.map((group) => ({
          restaurantId: group.restaurant.id,
          items: group.items.map((item) => ({
            menuId: item.menu.id,
            quantity: item.quantity,
          })),
        })),
        deliveryAddress: values.deliveryAddress,
        phone: values.phone,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      },
      {
        onSuccess: (response) => {
          sessionStorage.setItem(
            "foody-last-transaction",
            JSON.stringify(response.data.transaction)
          );
          toast.success("Checkout berhasil", "Pesanan kamu sudah dibuat.");
          router.push("/success");
        },
        onError: () => {
          toast.error("Checkout gagal", "Pastikan data checkout sudah benar.");
        },
      }
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto flex h-[72px] w-[calc(100%-32px)] max-w-[1200px] items-center justify-between sm:w-[calc(100%-48px)]">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/Foody-Logo.png"
              alt=""
              width={30}
              height={30}
              className="h-[30px] w-[30px] object-contain"
            />
            <span className="hidden text-lg font-extrabold text-zinc-950 sm:inline">
              Foody
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative" aria-label="Cart">
              <Image
                src="/images/Cart.png"
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] object-contain brightness-0"
              />
              {totalItems > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              ) : null}
            </Link>
            <Link href="/profile" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {getInitial(profile?.name)}
              </span>
              <span className="hidden text-sm font-semibold text-zinc-950 sm:inline">
                {profile?.name ?? "John Doe"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid w-[calc(100%-32px)] max-w-[980px] gap-6 py-10 lg:grid-cols-[1fr_360px]"
      >
        <section>
          <h1 className="text-2xl font-extrabold text-zinc-950">Checkout</h1>

          <section className="mt-5 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <h2 className="flex items-center gap-2 font-extrabold text-zinc-950">
              <MapPin className="h-5 w-5 fill-red-600 text-red-600" />
              Delivery Address
            </h2>
            <Textarea
              rows={2}
              className="mt-3 min-h-0 border-transparent bg-transparent px-0 py-0 focus:border-zinc-200"
              {...form.register("deliveryAddress")}
            />
            {form.formState.errors.deliveryAddress ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.deliveryAddress.message}
              </p>
            ) : null}
            <input
              type="tel"
              className="mt-1 h-8 w-full rounded-lg border border-transparent bg-transparent text-sm outline-none focus:border-zinc-200"
              {...form.register("phone")}
            />
            {form.formState.errors.phone ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.phone.message}
              </p>
            ) : null}

            <label
              htmlFor="notes"
              className="mt-4 block text-sm font-bold text-zinc-950"
            >
              Notes
            </label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Catatan tambahan untuk restoran atau kurir"
              className="mt-2"
              {...form.register("notes")}
            />

            <Button
              variant="outline"
              size="sm"
              className="mt-4 min-w-[140px]"
            >
              Change
            </Button>
          </section>

          {groups.map((group) => (
            <section
              key={group.restaurant.id}
              className="mt-5 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center justify-between gap-4">
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
                  <h2 className="font-extrabold text-zinc-950">
                    {group.restaurant.name}
                  </h2>
                </div>

                <Link
                  href={`/resto/${group.restaurant.id}`}
                  className="flex h-9 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-bold"
                >
                  Add item
                </Link>
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

                    <div>
                      <p className="text-sm text-zinc-700">
                        {item.menu.foodName}
                      </p>
                      <p className="mt-1 font-extrabold text-zinc-950">
                        {formatRupiah(item.menu.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={
                          item.quantity <= 1 ||
                          updateCartItemMutation.isPending
                        }
                        onClick={() =>
                          updateCartItemMutation.mutate(
                            {
                              id: item.id,
                              quantity: item.quantity - 1,
                            },
                            {
                              onSuccess: () => toast.success("Cart diperbarui"),
                              onError: () =>
                                toast.error(
                                  "Cart gagal diperbarui",
                                  "Coba ulangi lagi."
                                ),
                            }
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={updateCartItemMutation.isPending}
                        onClick={() =>
                          updateCartItemMutation.mutate(
                            {
                              id: item.id,
                              quantity: item.quantity + 1,
                            },
                            {
                              onSuccess: () => toast.success("Cart diperbarui"),
                              onError: () =>
                                toast.error(
                                  "Cart gagal diperbarui",
                                  "Coba ulangi lagi."
                                ),
                            }
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white disabled:opacity-60"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </section>

        <aside className="h-max rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <section>
            <h2 className="font-extrabold text-zinc-950">Payment Method</h2>
            <div className="mt-4 flex flex-col divide-y divide-zinc-100">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className="flex cursor-pointer items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="relative h-7 w-12 shrink-0 overflow-hidden rounded border border-zinc-100">
                      <Image
                        src={method.image}
                        alt={method.label}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </span>
                    {method.label}
                  </span>
                  <input
                    type="radio"
                    value={method.value}
                    className="h-5 w-5 accent-red-600"
                    {...form.register("paymentMethod")}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="mt-5 border-t border-zinc-100 pt-5">
            <h2 className="font-extrabold text-zinc-950">Payment Summary</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span>Price ({summary.totalItems} items)</span>
                <span className="font-bold">
                  {formatRupiah(summary.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold">{formatRupiah(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="font-bold">{formatRupiah(serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed pt-3 text-base">
                <span>Total</span>
                <span className="font-extrabold">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {checkoutMutation.isError ? (
              <p className="mt-4 text-xs text-red-600">
                Checkout gagal. Pastikan data sudah benar.
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={checkoutMutation.isPending}
              className="mt-5 w-full"
            >
              {checkoutMutation.isPending ? "Memproses..." : "Buy"}
            </Button>
          </section>
        </aside>
      </form>
    </main>
  );
}
