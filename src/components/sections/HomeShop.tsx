import Image from "next/image";

export function HomeShop() {
  const products = [
    { name: "Poncho", src: "/photos/home1.jpg", featured: true },
    { name: "Surfskate", src: "/photos/home2.jpg", featured: false },
    { name: "Polo", src: "/photos/hero.jpg", featured: false },
  ];

  return (
    <section className="relative overflow-hidden py-14 text-white">
      {/* Photo background with overlay */}
      <Image src="/photos/hero.jpg" alt="" fill className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-[rgba(1,42,58,0.7)]" />

      <div className="relative grid gap-8 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-end md:px-10 lg:px-16">
        <div>
          <p className="ds-label text-[var(--color-label-muted)]">SHOP</p>
          <h2 className="ds-display-title mt-3 leading-[50px] text-white">Descubre nuestros productos</h2>
          <button className="ds-btn ds-btn-lg mt-8 border border-white bg-transparent text-white hover:bg-white/15">
            Ver más productos
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.name}>
              <div className="relative h-52 overflow-hidden rounded-[30px] bg-white sm:h-[210px]">
                <Image src={product.src} alt={product.name} fill className="object-cover" />
                {product.featured && (
                  <button className="ds-btn ds-btn-secondary ds-btn-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                    Añadir al carrito
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between ds-body-s">
                <p>{product.name}</p>
                <p>S/100.00</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
