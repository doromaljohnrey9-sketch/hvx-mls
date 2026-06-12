export default function Loading() {
  return (
    <div className="flex-1 min-w-0 space-y-6 p-8">
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <div className="h-12 w-full bg-muted animate-pulse rounded" />
      <div className="space-y-2">
        <div className="h-12 w-full bg-muted animate-pulse rounded" />
        <div className="h-12 w-full bg-muted animate-pulse rounded" />
        <div className="h-12 w-full bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
