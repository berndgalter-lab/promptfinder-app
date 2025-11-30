import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FavoriteToggle } from '@/components/workflow/FavoriteToggle';
import Link from 'next/link';

interface Workflow {
  id: string;
  title: string;
  description: string;
  slug: string;
}

interface Favorite {
  id: string;
  workflow_id: string;
  created_at: string;
  workflows: Workflow;
}

export default async function FavoritesPage() {
  // Check if user is logged in
  const user = await getUser();

  if (!user) {
    redirect('/workflows');
  }

  const supabase = await createClient();

  // Fetch user's favorites with workflow data
  const { data: favorites, error } = await supabase
    .from('user_favorites')
    .select(`
      id,
      workflow_id,
      created_at,
      workflows:workflow_id (
        id,
        title,
        description,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Error Loading Favorites</h1>
          <p className="text-zinc-400">{error.message}</p>
        </div>
      </div>
    );
  }

  // Extract workflows from favorites
  const workflows = favorites?.map((fav: any) => fav.workflows).filter(Boolean) || [];
  const favoritesCount = workflows.length;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">My Favorites</h1>
          <p className="text-lg text-zinc-400">
            {favoritesCount === 0
              ? 'No workflows saved yet'
              : `${favoritesCount} workflow${favoritesCount === 1 ? '' : 's'} saved`}
          </p>
        </div>

        {/* Empty State */}
        {favoritesCount === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
            <div className="mb-6 text-6xl">⭐</div>
            <h2 className="mb-2 text-2xl font-bold">No favorites yet!</h2>
            <p className="mb-6 text-zinc-400">
              Browse workflows and click the star icon to save your favorites.
            </p>
            <Link href="/workflows">
              <Button size="lg" className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                Browse Workflows
              </Button>
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow: Workflow) => (
              <Card key={workflow.id} className="flex flex-col border-zinc-800 bg-zinc-900">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{workflow.title}</CardTitle>
                    <FavoriteToggle
                      workflowId={workflow.id}
                      initialIsFavorited={true}
                      userId={user.id}
                    />
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Link href={`/workflows/${workflow.slug}`} className="w-full">
                    <Button className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white">
                      View Workflow
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

