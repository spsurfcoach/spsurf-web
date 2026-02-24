import { products } from "@/lib/content";

export function ShopPreviewSection() {
  return (
    <section className="section-space bg-zinc-200 text-zinc-900">
      <div className="container-site space-y-10">
        <div className="text-center">
          <h2 className="ds-h2">Shop</h2>
          <p className="ds-body-s mx-auto mt-3 max-w-2xl text-zinc-700">
            Ropa y accesorios inspirados en el mar para acompanarte dentro y fuera del agua.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="ds-card p-4">
              <div className="mb-4 aspect-square rounded-lg bg-zinc-100" />
              <h3 className="ds-h3">{product.name}</h3>
              <p className="ds-body-s text-zinc-500">{product.category}</p>
              <p className="ds-body-s mt-1">{product.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


