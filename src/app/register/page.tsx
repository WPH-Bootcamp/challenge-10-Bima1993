import { AuthShell } from "@/features/auth/auth-shell";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Welcome Back"
      description="Good to see you again! Let's eat"
    >
      <RegisterForm />
    </AuthShell>
  );
}
