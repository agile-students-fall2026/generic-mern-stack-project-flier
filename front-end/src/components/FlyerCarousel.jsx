import Flyer from "./Flyer";
import { getFlyersBySection } from "../utils/flyerUtils";
import { EmptyState, ErrorState, LoadingState } from "./LoadingState";

/**
 * Maps a given prop passed to the component to its proper heading.
 * Format: [PropUppercase] => Usable header text
 */
const CategoryLookup = {
  today: "Today's Events",
  forYou: "For You",
  new: "Newly Added",
  calendar: "Events",
};

export default function FlyerCarousel({ category, flyers = [], loading, error }) {
  const sectionFlyers = getFlyersBySection(category, Array.isArray(flyers) ? flyers : []);

  return (
    <section className="flex justify-center items-center flex-col h-fit gap-2">
      {/* Render a heading for home page carousels and ignore for calendar view. */}
      {category !== "calendar" && (
        <h1 className="heading w-full text-start text-(--soft-black)">{CategoryLookup[category]}</h1>
      )}

      {loading ? <LoadingState label="Loading flyers…" className="w-full" /> : error ? (
        <ErrorState className="w-full">{error}</ErrorState>
      ) : sectionFlyers.length === 0 ? (
        <EmptyState className="w-full">
          <p className="body-copy">
            {category === "calendar"
              ? "No events have been registered for this day."
              : "No flyers in this section yet."}
          </p>
        </EmptyState>
      ) : <div className="flex gap-3 overflow-x-auto w-full">
        {sectionFlyers.map((flyer) => (
          <Flyer key={flyer.id} flyer={flyer} mode="carousel"/>
        ))}
      </div>}
    </section>
  );
}
