import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      description="Good to see you again! Let's eat"
    >
      <LoginForm />
    </AuthShell>
  );
}
