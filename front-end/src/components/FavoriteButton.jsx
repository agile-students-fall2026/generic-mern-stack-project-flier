function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
      <path strokeLinejoin="round" d="M12 2.6l2.05 6.32h6.64l-5.37 3.9 2.05 6.32L12 15.24l-5.37 3.9 2.05-6.32-5.37-3.9h6.64L12 2.6z" />
    </svg>
  );
}

export default function FavoriteButton({ isFavorite, onToggle, orgName, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={`${isFavorite ? "Remove" : "Add"} ${orgName} ${isFavorite ? "from" : "to"} favorites`}
      onClick={onToggle}
      className={`flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-(--nyu-indigo) ${className}`}
    >
      <span className="size-6">
        <StarIcon filled={isFavorite} />
      </span>
    </button>
  );
}
