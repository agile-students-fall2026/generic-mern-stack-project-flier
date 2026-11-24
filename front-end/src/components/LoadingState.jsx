export function LoadingState({ label = "Loading…", className = "" }) {
  return (
    <div role="status" aria-live="polite" className={`rounded-2xl bg-(--paper) px-5 py-6 text-center shadow-sm ring-1 ring-black/5 ${className}`}>
      <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-(--nyu-indigo)/20 border-t-(--nyu-indigo)" aria-hidden="true" />
      <span className="body-copy text-(--soft-black)">{label}</span>
    </div>
  );
}

export function EmptyState({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white px-5 py-8 text-center shadow-sm ring-1 ring-black/5 ${className}`}>{children}</div>;
}

export function ErrorState({ children, className = "" }) {
  return <div role="alert" className={`rounded-2xl bg-(--paper) px-5 py-6 text-center shadow-sm ring-1 ring-black/5 ${className}`}><p className="body-copy text-(--soft-black)">{children}</p></div>;
}
