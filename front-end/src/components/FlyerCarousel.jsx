import Flyer from "./Flyer";

/**
 * Maps a given prop passed to the component to its proper heading.
 * Format: [PropUppercase] => Usable header text
 */
const CategoryLookup = {
  today: "Today's Events",
  forYou: "For You",
  new: "Newly Added",
}

const mockData = {
  today: [
    { id:"1", title:"Event 1", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"2", title:"Event 2", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"3", title:"Event 3", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"4", title:"Event 4", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
  ],
  forYou: [
    { id:"5", title:"Event 5", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"6", title:"Event 6", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"7", title:"Event 7", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"8", title:"Event 8", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
  ],
  new: [
    { id:"9", title:"Event 9", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"10", title:"Event 10", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"11", title:"Event 11", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
    { id:"12", title:"Event 12", starts_at:"2026-11-04T12:00:00Z", location:"Kimmel Center", image:"https://picsum.photos/200/300", owner:"Club 1", description: "Join us for an event at Kimmel! Free food and merch provided."},
  ],
}

export default function FlyerCarousel({ category }) {
  /* TODO: Replace with fetched flyers from backend. */
  const flyers = mockData[category];

  return (
    <section className="flex justify-center items-center flex-col h-fit gap-2">
      <h1 className="heading w-full text-start text-(--soft-black)">{CategoryLookup[category]}</h1>
      <div className="flex gap-3 overflow-x-auto w-full">
        {flyers.map((flyer) => (
          <Flyer key={flyer.id} flyer={flyer} mode="carousel"/>
        ))}
      </div>
    </section>
  );
}