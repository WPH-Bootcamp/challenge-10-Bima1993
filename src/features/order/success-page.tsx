"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import type { OrderTransaction } from "@/types/order";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTotalItems(transaction: OrderTransaction) {
  return transaction.restaurants.reduce(
    (groupTotal, group) =>
      groupTotal +
      group.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
    0
  );
}

function ReceiptRow({
  label,
  value,
  strong = true,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 text-base">
      <span className="text-zinc-950">{label}</span>
      <span
        className={`text-right text-zinc-950 ${
          strong ? "font-extrabold" : "font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function DashedDivider() {
  return (
    <div className="relative my-6 border-t border-dashed border-zinc-300">
      <span className="absolute -left-9 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-50" />
      <span className="absolute -right-9 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-50" />
    </div>
  );
}

export function SuccessPageContent() {
  const [transaction] = useState<OrderTransaction | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const rawTransaction = sessionStorage.getItem("foody-last-transaction");
      return rawTransaction
        ? (JSON.parse(rawTransaction) as OrderTransaction)
        : null;
    } catch {
      return null;
    }
  });

  const totalItems = transaction ? getTotalItems(transaction) : 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-10">
      <div className="w-full max-w-[520px]">
        <div className="mb-5 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/Foody-Logo.png"
              alt=""
              width={54}
              height={54}
              priority
              className="h-[54px] w-[54px] object-contain"
            />
            <span className="text-[34px] font-extrabold leading-none text-zinc-950">
              Foody
            </span>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[22px] bg-white px-7 py-8 text-center shadow-[0_12px_45px_rgba(15,23,42,0.18)]">
          <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#35b20f] text-white">
            <Check className="h-11 w-11 stroke-[4]" />
          </div>

          <h1 className="mt-5 text-[22px] font-extrabold leading-tight text-zinc-950">
            Payment Success
          </h1>
          <p className="mt-4 text-base leading-6 text-zinc-950">
            Your payment has been successfully processed.
          </p>

          <DashedDivider />

          {transaction ? (
            <div className="flex flex-col gap-6 text-left">
              <ReceiptRow
                label="Date"
                value={formatDate(transaction.createdAt)}
              />
              <ReceiptRow
                label="Payment Method"
                value={transaction.paymentMethod}
              />
              <ReceiptRow
                label={`Price (${totalItems} items)`}
                value={formatRupiah(transaction.pricing.subtotal)}
              />
              <ReceiptRow
                label="Delivery Fee"
                value={formatRupiah(transaction.pricing.deliveryFee)}
              />
              <ReceiptRow
                label="Service Fee"
                value={formatRupiah(transaction.pricing.serviceFee)}
              />
            </div>
          ) : (
            <p className="py-5 text-sm text-zinc-600">
              Detail transaksi akan muncul setelah checkout berhasil.
            </p>
          )}

          <DashedDivider />

          <div className="flex items-center justify-between text-left text-xl">
            <span className="text-zinc-950">Total</span>
            <span className="font-extrabold text-zinc-950">
              {transaction
                ? formatRupiah(transaction.pricing.totalPrice)
                : "-"}
            </span>
          </div>

          <Link
            href="/orders"
            className="mt-7 flex h-14 items-center justify-center rounded-full bg-red-600 px-4 text-base font-extrabold text-white transition hover:bg-red-700"
          >
            See My Orders
          </Link>
        </section>
      </div>
    </main>
  );
}
