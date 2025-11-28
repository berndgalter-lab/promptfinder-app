export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-zinc-500">404</h1>
        <h2 className="mb-4 text-2xl font-bold">Workflow Not Found</h2>
        <p className="mb-8 text-zinc-400">
          The workflow you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/workflows"
          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          Back to Workflows
        </a>
      </div>
    </div>
  );
}

