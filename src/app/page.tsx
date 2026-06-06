import { Suspense } from "react";
import { HomePageContent } from "@/features/resto/home-page";

export default function HomePage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-zinc-600">Memuat restoran...</p>}>
      <HomePageContent />
    </Suspense>
  );
}
