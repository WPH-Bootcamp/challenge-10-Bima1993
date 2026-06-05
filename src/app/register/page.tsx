import { AuthShell } from "@/features/auth/auth-shell";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create Account"
      description="Register your account"
    >
      <RegisterForm />
    </AuthShell>
  );
}