"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/lib/query/use-cart";
import { useCheckoutMutation } from "@/lib/query/use-order";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout";
import { useAuthStore } from "@/store/auth-store";

const paymentMethods = [
  "Bank Negara Indonesia",
  "Bank Rakyat Indonesia",
  "Bank Central Asia",
  "Mandiri",
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CheckoutPageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, isError } = useCart(Boolean(token));
  const checkoutMutation = useCheckoutMutation();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "",
      phone: "",
      paymentMethod: paymentMethods[1],
      notes: "",
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

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
          router.push("/success");
        },
      }
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-2xl flex-col gap-5"
    >
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Delivery Address</h2>
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            rows={3}
            placeholder="Jl. Sudirman No. 25, Jakarta Pusat"
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-red-600"
            {...form.register("deliveryAddress")}
          />
          {form.formState.errors.deliveryAddress ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.deliveryAddress.message}
            </p>
          ) : null}

          <input
            type="tel"
            placeholder="08123456789"
            className="h-10 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-600"
            {...form.register("phone")}
          />
          {form.formState.errors.phone ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.phone.message}
            </p>
          ) : null}
        </div>
      </section>

      {groups.map((group) => (
        <section
          key={group.restaurant.id}
          className="rounded-2xl bg-white p-5 shadow-sm"
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
              <h2 className="font-semibold">{group.restaurant.name}</h2>
            </div>
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
                  <p className="text-sm">{item.menu.foodName}</p>
                  <p className="mt-1 font-semibold">
                    {formatRupiah(item.menu.price)}
                  </p>
                </div>

                <p className="text-sm font-semibold">x {item.quantity}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Payment Method</h2>
        <div className="mt-4 flex flex-col divide-y">
          {paymentMethods.map((method) => (
            <label
              key={method}
              className="flex cursor-pointer items-center justify-between py-3 text-sm"
            >
              <span>{method}</span>
              <input
                type="radio"
                value={method}
                className="h-5 w-5 accent-red-600"
                {...form.register("paymentMethod")}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Payment Summary</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span>Price ({summary.totalItems} items)</span>
            <span className="font-semibold">
              {formatRupiah(summary.totalPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold">{formatRupiah(deliveryFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span className="font-semibold">{formatRupiah(serviceFee)}</span>
          </div>
          <div className="border-t border-dashed pt-3">
            <div className="flex justify-between text-base">
              <span>Total</span>
              <span className="font-semibold">{formatRupiah(totalPrice)}</span>
            </div>
          </div>
        </div>

        {checkoutMutation.isError ? (
          <p className="mt-4 text-xs text-red-600">
            Checkout gagal. Pastikan data sudah benar.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={checkoutMutation.isPending}
          className="mt-5 h-11 w-full rounded-full bg-red-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {checkoutMutation.isPending ? "Memproses..." : "Buy"}
        </button>
      </section>
    </form>
  );
}
