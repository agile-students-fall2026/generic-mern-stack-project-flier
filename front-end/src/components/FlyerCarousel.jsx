import Flyer from "./Flyer";
import { getFlyersBySection } from "../utils/flyerUtils";

/**
 * Maps a given prop passed to the component to its proper heading.
 * Format: [PropUppercase] => Usable header text
 */
const CategoryLookup = {
  today: "Today's Events",
  forYou: "For You",
  new: "Newly Added",
};

export default function FlyerCarousel({ category, flyers = [], loading, error }) {
  const sectionFlyers = getFlyersBySection(category, flyers);

  return (
    <section className="flex justify-center items-center flex-col h-fit gap-2">
      <h1 className="heading w-full text-start text-(--soft-black)">{CategoryLookup[category]}</h1>

      <div className="flex w-full gap-2">
        {loading && <p className="body-copy">Loading flyers...</p>}

        {!loading && error && (
          <p className="body-copy">{error}</p>
        )}
        
        {!loading && !error && sectionFlyers.length === 0 && (
          <p className="body-copy">No flyers in this section yet.</p>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto w-full">
        {sectionFlyers.map((flyer) => (
          <Flyer key={flyer.id} flyer={flyer} mode="carousel"/>
        ))}
      </div>
    </section>
  );
}