import Image from "next/image";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden bg-zinc-950 lg:block">
          <Image
            src="/images/auth-burger.png"
            alt="Burger meal"
            fill
            priority
            className="object-cover"
          />
        </div>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-sm font-semibold text-red-600">Foody</p>
              <h1 className="text-2xl font-semibold text-zinc-950">
                {title}
              </h1>
              <p className="text-sm text-zinc-500">{description}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}