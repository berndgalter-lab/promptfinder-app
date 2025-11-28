'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Download, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface AccountSettingsProps {
  userId: string;
  userEmail: string;
}

export function AccountSettings({ userId, userEmail }: AccountSettingsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Fetch all user data
      const [
        { data: profile },
        { data: usage },
        { data: favorites },
        { data: stats },
        { data: achievements },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_usage').select('*, workflows(title, slug)').eq('user_id', userId),
        supabase.from('user_favorites').select('*, workflows(title, slug, description)').eq('user_id', userId),
        supabase.from('user_stats').select('*').eq('user_id', userId).single(),
        supabase.from('user_achievements').select('*').eq('user_id', userId),
      ]);

      // Create export object
      const exportData = {
        exported_at: new Date().toISOString(),
        user: {
          id: userId,
          email: userEmail,
          profile,
        },
        statistics: stats,
        usage_history: usage,
        favorites: favorites,
        achievements: achievements,
      };

      // Create blob and download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const date = new Date().toISOString().split('T')[0];
      link.download = `promptfinder-data-${date}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data exported successfully',
        description: 'Your data has been downloaded',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      return;
    }

    setIsDeleting(true);

    try {
      // Delete user account (CASCADE will delete all related data)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw error;
      }

      // Sign out
      await supabase.auth.signOut();

      // Redirect to homepage
      router.push('/?message=account-deleted');
      
      toast({
        title: 'Account deleted',
        description: 'Your account and all data have been permanently deleted.',
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Deletion failed',
        description: 'There was an error deleting your account. Please contact support.',
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      {/* Export Data Card */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-600/50 flex items-center justify-center">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <CardTitle>Export Your Data</CardTitle>
          </div>
          <CardDescription>
            Download all your data as JSON file. Includes your workflows, favorites, and usage history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant="outline"
            className="w-full !text-white !border-zinc-700 hover:!bg-zinc-800"
          >
            {isExporting ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-bounce" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download My Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Card - Danger Zone */}
      <Card className="border-red-800/50 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-600/50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <CardTitle className="text-red-400">Delete Account</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            variant="destructive"
            className="w-full !bg-red-600 hover:!bg-red-700 !text-white"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Delete My Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 space-y-4">
              <p>This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your account</li>
                <li>All your usage history</li>
                <li>Your favorites and templates</li>
                <li>Your achievements</li>
              </ul>
              <p className="font-semibold text-red-400">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <label htmlFor="delete-confirm" className="text-sm text-zinc-400 block mb-2">
              Type <span className="font-mono font-bold text-white">DELETE</span> to confirm
            </label>
            <Input
              id="delete-confirm"
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              className="!bg-zinc-800 !text-white hover:!bg-zinc-700 !border-zinc-700"
              onClick={() => {
                setDeleteConfirmation('');
                setShowDeleteDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'DELETE' || isDeleting}
              className="!bg-red-600 hover:!bg-red-700 !text-white disabled:!opacity-50 disabled:!cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete Forever'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

