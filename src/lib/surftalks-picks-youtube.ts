/** Picks bajo el bloque Surf Talks: ids y `start` en segundos para el embed. */
export const surftalksPicksYouTube: { id: string; start?: number }[] = [
  { id: "UFerYEwiRB0" },
  { id: "jBV2XwTlH2E", start: 3421 },
  { id: "p8V7nqJYdOg", start: 26 },
];

export function surftalksPickEmbedSrc(video: { id: string; start?: number }) {
  const q = new URLSearchParams();
  q.set("rel", "0");
  if (video.start != null) q.set("start", String(Math.floor(video.start)));
  return `https://www.youtube.com/embed/${video.id}?${q.toString()}`;
}
