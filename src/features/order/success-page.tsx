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

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <Image
            src="/images/Foody Logo.png"
            alt="Foody"
            width={136}
            height={42}
            priority
          />
        </div>

        <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
            <Check className="h-9 w-9" />
          </div>

          <h1 className="mt-4 text-xl font-semibold">Payment Success</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your payment has been successfully processed.
          </p>

          {transaction ? (
            <div className="mt-6 border-y border-dashed py-5 text-left">
              <div className="flex justify-between gap-4 text-sm">
                <span>Date</span>
                <span className="font-semibold">
                  {formatDate(transaction.createdAt)}
                </span>
              </div>
              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span>Payment Method</span>
                <span className="font-semibold">
                  {transaction.paymentMethod}
                </span>
              </div>
              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span>Price</span>
                <span className="font-semibold">
                  {formatRupiah(transaction.pricing.subtotal)}
                </span>
              </div>
              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span>Delivery Fee</span>
                <span className="font-semibold">
                  {formatRupiah(transaction.pricing.deliveryFee)}
                </span>
              </div>
              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span>Service Fee</span>
                <span className="font-semibold">
                  {formatRupiah(transaction.pricing.serviceFee)}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-6 border-y border-dashed py-5 text-sm text-zinc-600">
              Detail transaksi akan muncul setelah checkout berhasil.
            </p>
          )}

          <div className="mt-5 flex justify-between text-left text-base">
            <span>Total</span>
            <span className="font-semibold">
              {transaction
                ? formatRupiah(transaction.pricing.totalPrice)
                : "-"}
            </span>
          </div>

          <Link
            href="/orders"
            className="mt-6 flex h-11 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white"
          >
            See My Orders
          </Link>
        </section>
      </div>
    </main>
  );
}
