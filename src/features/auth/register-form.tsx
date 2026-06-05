"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/lib/query/use-auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        setToken(data.token);
        router.push("/");
      },
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <div className="grid grid-cols-2 rounded-md bg-zinc-100 p-1 text-sm font-medium">
        <Link
          href="/login"
          className="flex h-9 items-center justify-center rounded text-zinc-500"
        >
          Sign In
        </Link>
        <button
          type="button"
          className="h-9 rounded bg-white text-zinc-950 shadow-sm"
        >
          Sign Up
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-800">
          Nama
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nama lengkap"
          className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none transition focus:border-red-600"
          {...form.register("name")}
        />
        {form.formState.errors.name ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="email@example.com"
          className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none transition focus:border-red-600"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-zinc-800">
          Nomor Telepon
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="08123456789"
          className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none transition focus:border-red-600"
          {...form.register("phone")}
        />
        {form.formState.errors.phone ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-800"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none transition focus:border-red-600"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      {registerMutation.isError ? (
        <p className="text-xs text-red-600">
          Register gagal. Periksa kembali data kamu.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {registerMutation.isPending ? "Loading..." : "Register"}
      </button>
    </form>
  );
}