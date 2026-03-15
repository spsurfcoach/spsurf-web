import Link from "next/link";
import { urlForImage, type SurftripListItem } from "@/lib/sanity";

type TripsSectionProps = {
  title?: string;
  description?: string;
  trips: SurftripListItem[];
};

export function TripsSection({
  title = "Conoce nuestros surftrips",
  description = "Explora destinos, mejora tu surfing y vive experiencias unicas junto a una comunidad apasionada.",
  trips,
}: TripsSectionProps) {
  return (
    <section className="section-space bg-zinc-100 text-zinc-900">
      <div className="container-site space-y-10">
        <div className="text-center">
          <h2 className="ds-h2">{title}</h2>
          <p className="ds-body-s mx-auto mt-3 max-w-2xl text-zinc-600">{description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {trips.map((trip) => {
            const imageSrc = trip.cardImage
              ? urlForImage(trip.cardImage).width(1200).height(900).fit("crop").url()
              : "/photos/chicama.jpg";

            return (
              <article
                key={trip._id}
                className="rounded-2xl p-5 text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(1,26,31,0.55), rgba(1,26,31,0.75)), url("${imageSrc}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <p className="mb-4 inline-block rounded-full bg-white px-4 py-1 ds-body-s text-zinc-900">{trip.level}</p>
                <h3 className="ds-h2">{trip.title}</h3>
                <p className="ds-body-s mt-3 text-zinc-100">{trip.shortDescription}</p>
                <Link href={`/surftrips/${trip.slug}`} className="ds-btn ds-btn-secondary mt-6 inline-flex">
                  Ver detalle
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


