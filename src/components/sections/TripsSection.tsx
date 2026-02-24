import { surfTrips } from "@/lib/content";

type TripsSectionProps = {
  title?: string;
  description?: string;
};

export function TripsSection({
  title = "Conoce nuestros surftrips",
  description = "Explora destinos, mejora tu surfing y vive experiencias unicas junto a una comunidad apasionada.",
}: TripsSectionProps) {
  return (
    <section className="section-space bg-zinc-100 text-zinc-900">
      <div className="container-site space-y-10">
        <div className="text-center">
          <h2 className="ds-h2">{title}</h2>
          <p className="ds-body-s mx-auto mt-3 max-w-2xl text-zinc-600">{description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {surfTrips.map((trip) => (
            <article key={trip.name} className="photo-block rounded-2xl p-5 text-white">
              <p className="mb-4 inline-block rounded-full bg-white px-4 py-1 ds-body-s text-zinc-900">{trip.level}</p>
              <h3 className="ds-h2">{trip.name}</h3>
              <p className="ds-body-s mt-1 text-zinc-200">{trip.date}</p>
              <p className="ds-body-s mt-3 text-zinc-100">{trip.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


