"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, MapPin, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/lib/query/use-cart";
import {
  useProfile,
  useUpdateProfileMutation,
} from "@/lib/query/use-auth";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";

const pageContainer =
  "mx-auto w-[calc(100%-32px)] max-w-[1200px] sm:w-[calc(100%-48px)]";

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

function getProfileLabel(field: keyof ProfileFormValues) {
  if (field === "phone") {
    return "Nomor Handphone";
  }

  if (field === "email") {
    return "Email";
  }

  return "Name";
}

export function ProfilePageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { data: profile, isLoading, isError } = useProfile(Boolean(token));
  const { data: cartData } = useCart(Boolean(token));
  const updateProfileMutation = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const totalItems = cartData?.data.summary.totalItems ?? 0;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [form, profile]);

  if (!token) {
    return <p className="text-sm text-zinc-600">Mengalihkan ke login...</p>;
  }

  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(values, {
      onSuccess: () => setIsEditing(false),
    });
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
        <div
          className={`${pageContainer} flex h-[72px] items-center justify-between`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/Foody-Logo.png"
              alt=""
              width={38}
              height={38}
              className="h-[38px] w-[38px] object-contain"
            />
            <span className="text-2xl font-extrabold text-zinc-950">Foody</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5 text-zinc-950" />
              {totalItems > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              ) : null}
            </Link>
            <Link href="/profile" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {getInitial(profile?.name)}
              </span>
              <span className="hidden text-sm font-semibold text-zinc-950 sm:inline">
                {profile?.name ?? "John Doe"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <section className={`${pageContainer} min-h-[460px] py-10`}>
        <div className="grid gap-8 lg:grid-cols-[210px_1fr]">
          <aside className="hidden h-max rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
                {getInitial(profile?.name)}
              </div>
              <p className="font-extrabold text-zinc-950">
                {profile?.name ?? "John Doe"}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-5 border-t border-zinc-200 pt-5 text-sm">
              <span className="flex items-center gap-3 text-zinc-950">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </span>
              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="flex items-center gap-3 text-left text-zinc-950"
              >
                <Package className="h-5 w-5" />
                My Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  clearToken();
                  window.location.replace("/");
                }}
                className="flex items-center gap-3 text-left text-zinc-950"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>

          <main className="max-w-[520px]">
            <h1 className="text-3xl font-extrabold text-zinc-950">Profile</h1>

            <section className="mt-6 rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              {isLoading ? (
                <p className="text-sm text-zinc-600">Memuat profile...</p>
              ) : null}

              {isError ? (
                <p className="text-sm text-red-600">Gagal memuat profile.</p>
              ) : null}

              {!isLoading && !isError ? (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
                    {getInitial(profile?.name)}
                  </div>

                  {(["name", "email", "phone"] as const).map((field) => (
                    <div
                      key={field}
                      className="grid items-center gap-3 sm:grid-cols-[170px_1fr]"
                    >
                      <label htmlFor={field} className="text-sm text-zinc-950">
                        {getProfileLabel(field)}
                      </label>
                      <div>
                        <input
                          id={field}
                          disabled={!isEditing}
                          className="h-9 w-full rounded-lg border border-zinc-200 px-3 text-right text-sm font-extrabold text-zinc-950 outline-none disabled:border-transparent disabled:bg-white disabled:text-zinc-950 disabled:opacity-100"
                          {...form.register(field)}
                        />
                        {form.formState.errors[field] ? (
                          <p className="mt-1 text-xs text-red-600">
                            {form.formState.errors[field]?.message}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {isEditing ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (profile) {
                            form.reset({
                              name: profile.name,
                              email: profile.email,
                              phone: profile.phone,
                            });
                          }
                          setIsEditing(false);
                        }}
                        className="h-11 rounded-full border border-zinc-200 px-4 text-sm font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="h-11 rounded-full bg-red-600 px-4 text-sm font-bold text-white disabled:opacity-60"
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="h-11 rounded-full bg-red-600 px-4 text-sm font-bold text-white"
                    >
                      Update Profile
                    </button>
                  )}
                </form>
              ) : null}
            </section>
          </main>
        </div>
      </section>
    </main>
  );
}
