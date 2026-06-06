"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Package, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useProfile,
  useUpdateProfileMutation,
} from "@/lib/query/use-auth";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

export function ProfilePageContent() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { data: profile, isLoading, isError } = useProfile(Boolean(token));
  const updateProfileMutation = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden h-max rounded-2xl bg-white p-5 shadow-sm lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-semibold text-red-600">
            {getInitial(profile?.name)}
          </div>
          <p className="font-semibold">{profile?.name ?? "Profile"}</p>
        </div>

        <div className="mt-5 flex flex-col gap-5 border-t pt-5 text-sm">
          <span className="flex items-center gap-3 text-zinc-700">
            <MapPin className="h-5 w-5" />
            Delivery Address
          </span>
          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="flex items-center gap-3 text-left text-zinc-700"
          >
            <Package className="h-5 w-5" />
            My Orders
          </button>
          <button
            type="button"
            onClick={() => {
              clearToken();
              router.push("/login");
            }}
            className="flex items-center gap-3 text-left text-zinc-700"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <main>
        <h1 className="text-3xl font-semibold">Profile</h1>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-semibold text-red-600">
                {getInitial(profile?.name)}
              </div>

              {(["name", "email", "phone"] as const).map((field) => (
                <div key={field} className="grid gap-2 sm:grid-cols-[180px_1fr]">
                  <label
                    htmlFor={field}
                    className="text-sm capitalize text-zinc-700"
                  >
                    {field === "phone" ? "Nomor Handphone" : field}
                  </label>
                  <div>
                    <input
                      id={field}
                      disabled={!isEditing}
                      className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm font-semibold outline-none disabled:border-transparent disabled:bg-white sm:text-right"
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
                    className="h-11 rounded-full border border-zinc-200 px-4 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="h-11 rounded-full bg-red-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="h-11 rounded-full bg-red-600 px-4 text-sm font-semibold text-white"
                >
                  Update Profile
                </button>
              )}
            </form>
          ) : null}
        </section>
      </main>
    </div>
  );
}
