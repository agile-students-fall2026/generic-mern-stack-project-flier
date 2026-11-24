import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

export default function ClubCard({ club, isFavorite, onToggleFavorite }) {
  const detailsPath = `/organizations/${club.id}`;

  return (
    <li className="flex items-center gap-4 bg-(--paper) p-6 shadow-md inset-shadow-sm rounded-2xl">
      <Link to={detailsPath} className="shrink-0">
        <img
          src={club.logo}
          alt=""
          className="size-16 rounded-full bg-(--paper) object-cover"
        />
      </Link>
      <div className="min-w-0 flex flex-col gap-1">
        <Link to={detailsPath} className="feature-copy">
          {club.name}
        </Link>
        <Link to={detailsPath} className="body-copy text-(--soft-black)/60">
          {club.description}
        </Link>
      </div>
      {onToggleFavorite ? (
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          orgName={club.name}
          className="ml-auto"
        />
      ) : null}
    </li>
  );
}
