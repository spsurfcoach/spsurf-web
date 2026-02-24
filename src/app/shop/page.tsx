import { Hero } from "@/components/sections/Hero";
import { products } from "@/lib/content";

export default function ShopPage() {
  return (
    <>
      <Hero
        title="Shop"
        subtitle="Productos seleccionados para acompanar tu practica: ropa, accesorios y herramientas de entrenamiento."
      />

      <section className="section-space bg-zinc-100 text-zinc-900">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap gap-3 ds-body-s">
            <span className="ds-btn ds-btn-primary">Ropa</span>
            <span className="ds-btn ds-btn-secondary">Surfskate</span>
            <span className="ds-btn ds-btn-secondary">Accesorios</span>
            <span className="ds-btn ds-btn-secondary">Tarjetas de entrenamiento</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.name} className="ds-card p-4">
                <div className="mb-4 aspect-square rounded-lg bg-zinc-100" />
                <h2 className="ds-h3">{product.name}</h2>
                <p className="ds-body-s text-zinc-500">{product.category}</p>
                <p className="ds-body-s mt-2">{product.price}</p>
                <button className="ds-btn ds-btn-primary mt-4">Anadir al carrito</button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


