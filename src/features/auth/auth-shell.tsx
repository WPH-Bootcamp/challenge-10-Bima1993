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
            sizes="50vw"
            className="object-cover"
          />
        </div>

        <section className="flex items-center justify-center px-6 py-12 lg:justify-start lg:px-[173px]">
          <div className="w-full max-w-[373px]">
            <div className="mb-7 flex flex-col">
              <div className="mb-7 flex items-center gap-3">
                <Image
                  src="/images/Foody-Logo.png"
                  alt=""
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-10 object-contain"
                />
                <span className="text-[32px] font-bold leading-none text-zinc-950">
                  Foody
                </span>
              </div>
              <h1 className="text-[30px] font-bold leading-none text-zinc-950">
                {title}
              </h1>
              <p className="mt-4 text-base leading-none text-zinc-950">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
