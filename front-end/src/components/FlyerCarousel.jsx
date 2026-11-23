import Flyer from "./Flyer";
import { useFlyers } from "../context/FlyersContext";
import { eventDateKey } from "../data/flyers";

/**
 * Maps a given prop passed to the component to its proper heading.
 * Format: [PropUppercase] => Usable header text
 */
const CategoryLookup = {
  today: "Today's Events",
  forYou: "For You",
  new: "Newly Added",
};

function flyersForSection(flyers, section) {
  const todayKey = eventDateKey(new Date());

  if (section === "today") {
    return flyers.filter((flyer) => eventDateKey(flyer.starts_at) === todayKey);
  }

  if (section === "forYou") {
    return flyers.filter((flyer) => eventDateKey(flyer.starts_at) > todayKey);
  }

  // Newly added: newest ids first (mock data uses ascending string ids).
  return [...flyers].sort((a, b) => Number(b.id) - Number(a.id));
}

export default function FlyerCarousel({ category }) {
  const { flyers } = useFlyers();
  const sectionFlyers = flyersForSection(flyers, category);

  return (
    <section className="flex justify-center items-center flex-col h-fit gap-2">
      <h1 className="heading w-full text-start text-(--soft-black)">{CategoryLookup[category]}</h1>
      <div className="flex gap-3 overflow-x-auto w-full">
        {sectionFlyers.map((flyer) => (
          <Flyer key={flyer.id} flyer={flyer} mode="carousel"/>
        ))}
      </div>
    </section>
  );
}
