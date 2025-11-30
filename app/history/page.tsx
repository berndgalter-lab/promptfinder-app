import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/components/history/HistoryItem';
import Link from 'next/link';

interface Workflow {
  id: string;
  title: string;
  slug: string;
}

interface UsageRecord {
  id: string;
  workflow_id: string;
  input_values: Record<string, any>;
  used_at: string;
  workflows: Workflow;
}

export default async function HistoryPage() {
  // Check if user is logged in
  const user = await getUser();

  if (!user) {
    redirect('/workflows');
  }

  const supabase = await createClient();

  // Fetch user's usage history with workflow data
  const { data: history, error } = await supabase
    .from('user_usage')
    .select(`
      id,
      workflow_id,
      input_values,
      used_at,
      workflows:workflow_id (
        id,
        title,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('used_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching history:', error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Error Loading History</h1>
          <p className="text-zinc-400">{error.message}</p>
        </div>
      </div>
    );
  }

  const records = (history || []).filter((record: any) => record.workflows);
  const historyCount = records.length;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">Workflow History</h1>
          <p className="text-lg text-zinc-400">
            Your recent workflow usage
          </p>
        </div>

        {/* Empty State */}
        {historyCount === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
            <div className="mb-6 text-6xl">📜</div>
            <h2 className="mb-2 text-2xl font-bold">No workflows used yet!</h2>
            <p className="mb-6 text-zinc-400">
              Start using workflows to see your history here.
            </p>
            <Link href="/workflows">
              <Button size="lg" className="!bg-blue-600 hover:!bg-blue-700 !text-white">
                Browse Workflows
              </Button>
            </Link>
          </div>
        ) : (
          /* History List */
          <div className="space-y-4">
            {records.map((record: any) => (
              <HistoryItem
                key={record.id}
                historyId={record.id}
                workflow={record.workflows}
                inputValues={record.input_values}
                usedAt={record.used_at}
                userId={user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

