"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useLoginMutation } from "@/lib/query/use-auth";
import { useAuthStore } from "@/store/auth-store";

export function LoginForm() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

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
      className="flex w-full flex-col gap-5"
    >
      <div className="grid h-[56px] grid-cols-2 rounded-[14px] bg-zinc-100 p-2 text-base font-medium">
        <button
          type="button"
          className="h-10 rounded-xl bg-white text-zinc-950 shadow-sm"
        >
          Sign in
        </button>
        <Link
          href="/register"
          className="flex h-10 items-center justify-center rounded-xl text-zinc-500"
        >
          Sign up
        </Link>
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="h-14 w-full rounded-xl border border-zinc-300 px-4 text-base outline-none transition placeholder:text-zinc-500 focus:border-red-600"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="mt-1.5 text-xs text-red-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="sr-only"
        >
          Password
        </label>
        <div className="flex h-14 items-center rounded-xl border border-zinc-300 px-4 focus-within:border-red-600">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-500"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="flex h-9 w-9 items-center justify-center text-zinc-900"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
        {form.formState.errors.password ? (
          <p className="mt-1.5 text-xs text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-base text-zinc-950">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-zinc-300 accent-red-600"
        />
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
        className="mt-1 h-12 rounded-full bg-red-600 px-4 text-base font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {loginMutation.isPending ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
