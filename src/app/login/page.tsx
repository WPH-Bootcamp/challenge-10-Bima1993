import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      description="Login to your account"
    >
      <LoginForm />
    </AuthShell>
  );
}