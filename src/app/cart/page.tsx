import { CartPageContent } from "@/features/cart/cart-page";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <section className="mx-auto w-full max-w-4xl">
        <CartPageContent />
      </section>
    </main>
  );
}