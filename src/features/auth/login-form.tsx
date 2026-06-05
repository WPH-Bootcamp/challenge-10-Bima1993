"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useLoginMutation } from "@/lib/query/use-auth";
import { useAuthStore } from "@/store/auth-store";

export function LoginForm() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
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
        <button
          type="button"
          className="h-9 rounded bg-white text-zinc-950 shadow-sm"
        >
          Sign In
        </button>
        <Link
          href="/register"
          className="flex h-9 items-center justify-center rounded text-zinc-500"
        >
          Sign Up
        </Link>
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

      <label className="flex items-center gap-2 text-xs text-zinc-600">
        <input type="checkbox" className="h-3.5 w-3.5 accent-red-600" />
        Remember Me
      </label>

      {loginMutation.isError ? (
        <p className="text-xs text-red-600">
          Login gagal. Periksa email dan password.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {loginMutation.isPending ? "Loading..." : "Login"}
      </button>
    </form>
  );
}