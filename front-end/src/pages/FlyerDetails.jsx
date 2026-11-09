import { Link, useParams } from "react-router-dom";
import Flyer from "../components/Flyer";

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
};

export default function FlyerDetails() {
  /* Grab the id from the URL params */
  const { flyerId } = useParams();
  /* TODO: Replace with proper backend logic. */
  const flyer = Object.values(mockData).flat().find((f) => f.id === flyerId);

  return (
    <Flyer key={flyerId} flyer={flyer} mode="full"/>
  );
}