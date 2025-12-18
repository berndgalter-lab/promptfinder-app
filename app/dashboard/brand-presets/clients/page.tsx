import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClientPresetsList } from '@/components/presets/ClientPresetsList';
import Link from 'next/link';
import { ChevronLeft, User, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Clients | Brand Presets | PromptFinder',
  description: 'Manage client presets for auto-fill in workflows',
};

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/brand-presets/clients');
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Brand Presets</h1>
              <p className="text-zinc-400 mt-1">
                Save your data for automatic workflow fill-in
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6">
            <Link
              href="/dashboard/brand-presets/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
            <Link
              href="/dashboard/brand-presets/clients"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-600/30"
            >
              <Building2 className="w-4 h-4" />
              Clients
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ClientPresetsList userId={user.id} />
      </div>
    </div>
  );
}

