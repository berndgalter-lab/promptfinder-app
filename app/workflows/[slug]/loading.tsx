export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        
        {/* Breadcrumbs skeleton - matches actual breadcrumbs height */}
        <div className="mb-4 h-5 w-48 animate-pulse rounded bg-zinc-800/50" />

        {/* Header section - matches actual hero section */}
        <div className="mb-6">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {/* Title skeleton - matches h1 size */}
                <div className="h-10 md:h-12 lg:h-14 w-full max-w-lg animate-pulse rounded-lg bg-zinc-800" />
                {/* Category badge skeleton */}
                <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-800" />
              </div>
              {/* Description skeleton - matches p size */}
              <div className="space-y-2">
                <div className="h-6 w-full animate-pulse rounded bg-zinc-800/70" />
                <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-800/70" />
              </div>
            </div>
            
            {/* Favorite button skeleton */}
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-zinc-800" />
          </div>

          {/* Meta Badges Row - matches actual badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-7 w-28 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-7 w-36 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-5 w-32 animate-pulse rounded bg-zinc-800/50" />
          </div>

          {/* Works with skeleton */}
          <div className="mt-3 h-5 w-64 animate-pulse rounded bg-zinc-800/50" />
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-zinc-800" />

        {/* Workflow Runner skeleton - matches actual height */}
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 animate-pulse rounded bg-zinc-800" />
            <div className="h-2 flex-1 mx-4 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-6 w-16 animate-pulse rounded bg-zinc-800" />
          </div>
          
          {/* Form card skeleton */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800/50" />
            
            {/* Form fields */}
            <div className="space-y-4 pt-4">
              <div>
                <div className="h-4 w-24 mb-2 animate-pulse rounded bg-zinc-800" />
                <div className="h-10 w-full animate-pulse rounded bg-zinc-800" />
              </div>
              <div>
                <div className="h-4 w-32 mb-2 animate-pulse rounded bg-zinc-800" />
                <div className="h-24 w-full animate-pulse rounded bg-zinc-800" />
              </div>
              <div>
                <div className="h-4 w-28 mb-2 animate-pulse rounded bg-zinc-800" />
                <div className="h-10 w-full animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          </div>
          
          {/* Prompt preview skeleton */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-zinc-800" />
            <div className="h-32 w-full animate-pulse rounded bg-zinc-950" />
            <div className="flex gap-3">
              <div className="h-10 flex-1 animate-pulse rounded bg-zinc-800" />
              <div className="h-10 flex-1 animate-pulse rounded bg-blue-600/30" />
            </div>
          </div>
        </div>

        {/* Related Workflows skeleton - prevents CLS */}
        <section className="mt-16 pt-10 border-t border-zinc-800 min-h-[200px]">
          <div className="h-8 w-64 mb-6 animate-pulse rounded bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <div className="h-8 w-8 animate-pulse rounded bg-zinc-800" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-zinc-800" />
                </div>
                <div className="h-3 w-full mb-1 animate-pulse rounded bg-zinc-800/50" />
                <div className="h-3 w-2/3 mb-3 animate-pulse rounded bg-zinc-800/50" />
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-800/50" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
