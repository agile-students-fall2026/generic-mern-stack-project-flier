import { useState } from "react";
import ClubCard from "../components/ClubCard";
import { useOrgs } from "../hooks/useOrgs";
import searchIcon from "../assets/search-40px-black.svg";

export default function OrganizationView() {
  const { organizations, loading, error: loadError } = useOrgs();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTerm = query.trim().toLowerCase();
  const shownOrganizations = organizations.filter((organization) => {
    return organization.name.toLowerCase().includes(searchTerm);
  });

  function toggleSearch() {
    if (searchOpen) {
      setQuery("");
    }
    setSearchOpen((open) => !open);
  }

  return (
    <section className="flex flex-1 flex-col bg-(--parchment) p-8 pb-28 text-(--soft-black) rounded-t-4xl inset-shadow-sm shadow-[0px_-3px_8px_rgba(0,0,0,0.25)] mt-3">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <div className="flex items-center justify-between">
          <h1 className="heading">Organization List</h1>
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search clubs"}
            aria-expanded={searchOpen}
            aria-controls="club-search"
            onClick={toggleSearch}
            className="flex size-10 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-(--nyu-indigo)"
          >
            <img src={searchIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        {searchOpen ? (
          <input
            id="club-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clubs"
            aria-label="Search clubs by name"
            autoComplete="off"
            autoFocus
            className="body-copy mt-4 w-full rounded-xl border border-black/10 bg-(--paper) px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-(--nyu-indigo)"
          />
        ) : null}

        {loading ? (
          <p className="body-copy mt-4">Loading organizations…</p>
        ) : loadError ? (
          <p role="alert" className="body-copy mt-4">{loadError}</p>
        ) : shownOrganizations.length === 0 ? (
          <p className="body-copy mt-4">No clubs match that name.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {shownOrganizations.map((organization) => (
              <ClubCard key={organization.id} club={organization} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
