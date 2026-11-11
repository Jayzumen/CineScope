export default function Loading() {
  return (
    <div className="shell section" role="status" aria-label="Loading content">
      <div className="skeleton mb-10 h-10 w-64" />
      <div className="poster-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="skeleton poster-skeleton" />
            <div className="skeleton mt-4 h-4 w-3/4" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading stories…</span>
    </div>
  );
}
