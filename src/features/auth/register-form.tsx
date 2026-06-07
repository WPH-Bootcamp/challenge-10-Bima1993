"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { useRegisterMutation } from "@/lib/query/use-auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";

const fields = [
  { id: "name", label: "Name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "phone", label: "Number Phone", type: "tel" },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(
      {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      },
      {
        onSuccess: (data) => {
          setToken(data.token);
          toast.success("Register berhasil", "Akun kamu sudah dibuat.");
          router.push("/");
        },
        onError: () => {
          toast.error("Register gagal", "Periksa kembali data kamu.");
        },
      }
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5"
    >
      <div className="grid h-[56px] grid-cols-2 rounded-[14px] bg-zinc-100 p-2 text-base font-medium">
        <Link
          href="/login"
          className="flex h-10 items-center justify-center rounded-xl text-zinc-500"
        >
          Sign in
        </Link>
        <button
          type="button"
          className="h-10 rounded-xl bg-white text-zinc-950 shadow-sm"
        >
          Sign up
        </button>
      </div>

      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="sr-only">
            {field.label}
          </label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.label}
            className="h-14 w-full rounded-xl border border-zinc-300 px-4 text-base outline-none transition placeholder:text-zinc-500 focus:border-red-600"
            {...form.register(field.id)}
          />
          {form.formState.errors[field.id] ? (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors[field.id]?.message}
            </p>
          ) : null}
        </div>
      ))}

      <div>
        <label htmlFor="password" className="sr-only">
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
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="sr-only">
          Confirm Password
        </label>
        <div className="flex h-14 items-center rounded-xl border border-zinc-300 px-4 focus-within:border-red-600">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-500"
            {...form.register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            aria-label={
              showConfirmPassword ? "Hide confirm password" : "Show confirm password"
            }
            className="flex h-9 w-9 items-center justify-center text-zinc-900"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
        {form.formState.errors.confirmPassword ? (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.confirmPassword.message}
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
        className="mt-2 h-12 rounded-full bg-red-600 px-4 text-base font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {registerMutation.isPending ? "Loading..." : "Register"}
      </button>
    </form>
  );
}
