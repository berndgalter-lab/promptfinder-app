export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              {/* Title skeleton */}
              <div className="h-12 w-96 animate-pulse rounded-lg bg-zinc-800" />
              {/* Badge skeleton */}
              <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
            </div>
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-6 w-full animate-pulse rounded bg-zinc-800" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
          
          {/* Favorite button skeleton */}
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-zinc-800" />
        </div>

        {/* Steps placeholder skeleton */}
        <div className="mt-12 h-48 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900" />
      </div>
    </div>
  );
}

