import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Workflow {
  id: string;
  title: string;
  description: string;
  slug: string;
  category?: {
    id: number;
    slug: string;
    name: string;
    icon: string;
  } | null;
}

export default async function WorkflowsPage() {
  let workflows: Workflow[] | null = null;
  let error: any = null;

  console.log('🚀 Starting to fetch workflows...');
  console.log('🔧 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set (starts with: ' + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...)' : 'NOT SET');
  console.log('🔧 Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (length: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ')' : 'NOT SET');

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from('workflows')
      .select(`
        *,
        category:categories(id, slug, name, icon)
      `);
    
    console.log('📦 Supabase response:', { data, fetchError });
    
    if (fetchError) {
      console.error('❌ Supabase error details:');
      console.error('  - Message:', fetchError.message);
      console.error('  - Code:', fetchError.code);
      console.error('  - Details:', fetchError.details);
      console.error('  - Hint:', fetchError.hint);
      console.error('  - Full error:', JSON.stringify(fetchError, null, 2));
    }
    
    workflows = data;
    error = fetchError;

    if (data === null) {
      console.log('⚠️ Data is null');
    } else if (data.length === 0) {
      console.log('⚠️ Data is empty array');
    } else {
      console.log(`✅ Received ${data.length} workflows`);
    }
  } catch (fetchError) {
    console.error('❌ Catch block error:', fetchError);
    console.error('Error details:', {
      message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
      stack: fetchError instanceof Error ? fetchError.stack : undefined,
      type: typeof fetchError,
      fetchError
    });
    error = fetchError;
  }

  if (error) {
    console.log('🔴 Rendering error state');
    const errorMessage = error.message || error.msg || 'Failed to fetch workflows';
    const errorHint = error.hint || 'Make sure your Supabase environment variables are set correctly and the workflows table exists.';
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Error Loading Workflows</h1>
          <p className="text-zinc-400 mb-2">{errorMessage}</p>
          <p className="text-sm text-zinc-500 mb-4">{errorHint}</p>
          {error.code && (
            <p className="text-xs text-zinc-600">Error code: {error.code}</p>
          )}
        </div>
      </div>
    );
  }

  if (!workflows || workflows.length === 0) {
    console.log('🟡 Rendering empty state');
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold">No Workflows Found</h1>
          <p className="text-zinc-400">There are no workflows available at the moment.</p>
        </div>
      </div>
    );
  }

  console.log('🟢 Rendering workflows grid');

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">AI Workflows</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow: Workflow) => (
            <Card key={workflow.id} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <CardTitle className="text-xl">{workflow.title}</CardTitle>
                  {workflow.category && (
                    <CategoryBadge 
                      slug={workflow.category.slug}
                      name={workflow.category.name}
                      icon={workflow.category.icon}
                      clickable={false}
                    />
                  )}
                </div>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href={`/workflows/${workflow.slug}`} className="w-full">
                  <Button className="w-full">View Workflow</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

