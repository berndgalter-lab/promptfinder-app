'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Plus, Loader2, Building2, Star, Pencil, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getClientPresets, deleteClientPreset, toggleClientFavorite } from '@/lib/presets';
import { ClientPresetForm } from './ClientPresetForm';
import type { ClientPreset } from '@/lib/types/presets';

interface ClientPresetsListProps {
  userId: string;
}

export function ClientPresetsList({ userId }: ClientPresetsListProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [presets, setPresets] = useState<ClientPreset[]>([]);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  
  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load presets
  const loadPresets = async () => {
    try {
      const data = await getClientPresets(userId);
      setPresets(data);
    } catch (error) {
      console.error('Error loading presets:', error);
      toast({
        title: 'Error loading clients',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, [userId]);

  const handleCreateNew = () => {
    setEditingPresetId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (presetId: string) => {
    setEditingPresetId(presetId);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    setIsDeleting(true);
    try {
      await deleteClientPreset(deleteConfirmId);
      toast({
        title: '✅ Client deleted',
        description: 'The client has been removed.',
      });
      loadPresets();
    } catch (error) {
      console.error('Error deleting preset:', error);
      toast({
        title: 'Error deleting client',
        description: 'Please try again later.',
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleFavorite = async (preset: ClientPreset) => {
    try {
      await toggleClientFavorite(preset.id, !preset.is_favorite);
      loadPresets();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatLastUsed = (dateString: string | null) => {
    if (!dateString) return 'Never used';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Used today';
    if (diffDays === 1) return 'Used yesterday';
    if (diffDays < 7) return `Used ${diffDays} days ago`;
    if (diffDays < 30) return `Used ${Math.floor(diffDays / 7)} weeks ago`;
    return `Used ${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Clients
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Save client data for recurring workflows
            </CardDescription>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="!bg-purple-600 hover:!bg-purple-700 !text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </CardHeader>
        <CardContent>
          {presets.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No clients yet</p>
              <p className="text-sm">Create your first client preset to auto-fill workflows.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Favorite Star */}
                    <button
                      onClick={() => handleToggleFavorite(preset)}
                      className="mt-0.5 text-zinc-600 hover:text-yellow-500 transition-colors"
                    >
                      <Star 
                        className={`w-5 h-5 ${preset.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                      />
                    </button>
                    
                    {/* Info */}
                    <div>
                      <h3 className="font-medium text-white">
                        {preset.client_company}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                        {preset.client_industry && (
                          <span>{preset.client_industry}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatLastUsed(preset.last_used_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(preset.id)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(preset.id)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Form Modal */}
      <ClientPresetForm
        userId={userId}
        presetId={editingPresetId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={loadPresets}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Client?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete this client preset. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="!border-zinc-700 !text-zinc-300 hover:!bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="!bg-red-600 hover:!bg-red-700 !text-white"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

