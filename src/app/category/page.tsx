import { Suspense } from "react";
import { CategoryPageContent } from "@/features/resto/category-page";

export default function CategoryPage() {
  return (
    <Suspense
      fallback={<p className="p-6 text-sm text-zinc-600">Memuat restoran...</p>}
    >
      <CategoryPageContent />
    </Suspense>
  );
}
