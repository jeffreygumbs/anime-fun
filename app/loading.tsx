export default function Loading() {
  return (
    <div className="flex flex-col gap-10 px-6 py-16 sm:px-10">
      <div className="flex flex-col gap-3">
        <div className="h-3 w-24 animate-pulse rounded bg-elevated" />
        <div className="h-10 w-64 animate-pulse rounded bg-elevated" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-full animate-pulse">
            <div className="aspect-3/4 w-full rounded-2xl bg-elevated" />
            <div className="mt-3 h-4 w-3/4 rounded bg-elevated" />
            <div className="mt-2 h-3 w-1/2 rounded bg-elevated" />
          </div>
        ))}
      </div>
    </div>
  );
}
