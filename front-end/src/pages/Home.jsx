import { useState } from "react";
import FlyerCarousel from "../components/FlyerCarousel";
import { useFlyers } from "../hooks/useFlyers";
import { FLYER_CATEGORIES } from "../constants/flyerCategories";
import searchIcon from "../assets/search-40px-black.svg";

export default function Home() {
  const {
    flyers,
    loading,
    error,
    currFilter,
    setFilter,
    search,
    setSearch,
  } = useFlyers();
  const [searchOpen, setSearchOpen] = useState(false);

  function toggleSearch() {
    if (searchOpen) {
      setSearch("");
    }
    setSearchOpen((open) => !open);
  }

  function selectCategory(category) {
    setFilter((current) => (current === category ? "" : category));
  }

  return (
    <div className="flex flex-col bg-(--parchment) h-full w-full pb-28 rounded-4xl p-8 gap-6 inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search flyers"}
            aria-expanded={searchOpen}
            aria-controls="flyer-search"
            onClick={toggleSearch}
            className="flex size-10 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
          >
            <img src={searchIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        {searchOpen ? (
          <input
            id="flyer-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search flyers"
            aria-label="Search flyers by title, club, location, or description"
            autoComplete="off"
            autoFocus
            className="body-copy w-full rounded-xl border border-black/10 bg-(--paper) px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-(--nyu-indigo)"
          />
        ) : null}

        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter flyers by category"
        >
          <button
            type="button"
            aria-pressed={!currFilter}
            onClick={() => setFilter("")}
            className={`body-copy shrink-0 rounded-xl px-4 py-2 ${
              !currFilter
                ? "bg-(--nyu-indigo) text-white"
                : "bg-(--paper) text-(--soft-black) shadow-sm"
            }`}
          >
            All
          </button>
          {FLYER_CATEGORIES.map((category) => {
            const selected = currFilter === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => selectCategory(category)}
                className={`body-copy shrink-0 rounded-xl px-4 py-2 ${
                  selected
                    ? "bg-(--nyu-indigo) text-white"
                    : "bg-(--paper) text-(--soft-black) shadow-sm"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <FlyerCarousel category="today" flyers={flyers} loading={loading} error={error} />
      <FlyerCarousel category="forYou" flyers={flyers} loading={loading} error={error} />
      <FlyerCarousel category="new" flyers={flyers} loading={loading} error={error} />
    </div>
  );
}
