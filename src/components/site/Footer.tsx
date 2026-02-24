import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[var(--color-background-default)] pb-6">
      <div className="mx-auto w-full max-w-[1512px] px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="rounded-tl-[40px] rounded-tr-[40px] bg-[var(--color-primary-900)] px-8 py-14 text-white lg:rounded-tl-[60px] lg:rounded-tr-[60px]">
          <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <Image
                src="/photos/logosp.png"
                alt="SP Surf Coach"
                width={132}
                height={57}
                className="h-[57px] w-[132px] object-contain"
              />
            </div>
            <div>
              <p className="ds-h3 font-semibold text-white">Servicios</p>
              <div className="mt-4 h-2 w-[110px] rounded-full bg-white/30" />
              <div className="mt-3 h-2 w-[59px] rounded-full bg-white/30" />
              <div className="mt-3 h-2 w-[90px] rounded-full bg-white/30" />
            </div>
            <div>
              <p className="ds-h3 font-semibold text-white">Surftrips</p>
              <div className="mt-4 h-2 w-[110px] rounded-full bg-white/30" />
              <div className="mt-3 h-2 w-[59px] rounded-full bg-white/30" />
              <div className="mt-3 h-2 w-[90px] rounded-full bg-white/30" />
            </div>
            <div>
              <p className="ds-h3 font-semibold text-white">Shop</p>
              <div className="mt-4 h-2 w-[110px] rounded-full bg-white/30" />
              <div className="mt-3 h-2 w-[59px] rounded-full bg-white/30" />
            </div>
            <div>
              <p className="ds-h3 font-semibold text-white">Nosotros</p>
              <div className="mt-4 h-2 w-[59px] rounded-full bg-white/30" />
            </div>
            <div>
              <p className="ds-h3 font-semibold text-white">Blog</p>
              <div className="mt-4 h-2 w-[110px] rounded-full bg-white/30" />
            </div>
          </div>
          <div className="mt-10 text-sm text-white/80">&copy; 2026 SP Surf Coach</div>
        </div>
      </div>
    </footer>
  );
}
