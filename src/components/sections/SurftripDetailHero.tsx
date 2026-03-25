import Image from "next/image";

type SurftripDetailHeroProps = {
  imageSrc: string;
  title: string;
  titleSuffix?: string;
  kicker?: string;
};

export function SurftripDetailHero({
  imageSrc,
  title,
  titleSuffix,
  kicker,
}: SurftripDetailHeroProps) {
  return (
    <section className="px-4 pb-8 pt-0 sm:px-6 md:px-10 lg:px-16">
      <div className="relative min-h-[72svh] overflow-hidden rounded-[26px] lg:min-h-[84svh] lg:rounded-[40px]">
        <Image src={imageSrc} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-14">
          {kicker ? <p className="ds-label text-white/72">{kicker}</p> : null}
          <h1 className="mt-4 max-w-[15ch] text-[42px] font-medium leading-[0.98] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]">
            {title}
            {titleSuffix ? <span className="font-normal text-white/82"> {titleSuffix}</span> : null}
          </h1>
        </div>
      </div>
    </section>
  );
}
