// used for home page rendering: splits flyers into "Newly Added", "For You", and "Today's Events"
export function getFlyersBySection(category, flyers) {
  const today = new Date();

  switch (category) {
    case "today":
      // use toDateString to ignore hours & minutes
      return flyers.filter((flyer) => new Date(flyer.starts_at).toDateString() === today.toDateString());
    case "forYou":
      // TODO: Replace with personalized logic. For now display all flyers that aren't set for today.
      return flyers.filter((flyer) => new Date(flyer.starts_at) >= today);
    case "new":
      // displays up to 10 new flyers, sorted by newest (largest) ids
      return [...flyers].sort((a,b) => Number(b.id) - Number(a.id)).slice(0,10);
    case "calendar":
      return flyers;
    default:
      return [];
  }
}
