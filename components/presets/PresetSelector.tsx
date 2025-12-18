'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Building2, Plus, Star, Check, Loader2 } from 'lucide-react';
import { getUserProfile, getClientPresets, updateClientLastUsed } from '@/lib/presets';
import { 
  getAutoFillFromUserProfile, 
  getAutoFillFromClientPreset 
} from '@/lib/presets';
import { ClientPresetForm } from './ClientPresetForm';
import type { 
  UserProfile, 
  ClientPreset, 
  PresetType,
  PresetSelection 
} from '@/lib/types/presets';

interface PresetSelectorProps {
  userId: string | null;
  fieldNames: string[]; // List of field names in the workflow
  onAutoFill: (values: Record<string, string>) => void;
  compact?: boolean; // Compact mode for inline display
}

export function PresetSelector({ 
  userId, 
  fieldNames, 
  onAutoFill,
  compact = false 
}: PresetSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [presetType, setPresetType] = useState<PresetType>('self');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [clientPresets, setClientPresets] = useState<ClientPreset[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Load presets data
  useEffect(() => {
    async function loadData() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const [profile, clients] = await Promise.all([
          getUserProfile(userId),
          getClientPresets(userId),
        ]);
        
        setUserProfile(profile);
        setClientPresets(clients);
      } catch (error) {
        console.error('Error loading presets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [userId]);

  const handleApplyPreset = async () => {
    let values: Record<string, string> = {};
    
    if (presetType === 'self' && userProfile) {
      values = getAutoFillFromUserProfile(userProfile, fieldNames);
    } else if (presetType === 'client' && selectedClientId) {
      const selectedClient = clientPresets.find(c => c.id === selectedClientId);
      if (selectedClient) {
        values = getAutoFillFromClientPreset(selectedClient, fieldNames);
        // Update last_used_at
        updateClientLastUsed(selectedClientId).catch(console.error);
      }
    }
    
    if (Object.keys(values).length > 0) {
      onAutoFill(values);
      setHasApplied(true);
      // Reset applied state after 2 seconds
      setTimeout(() => setHasApplied(false), 2000);
    }
  };

  const handleClientCreated = async () => {
    // Reload clients after creating new one
    if (userId) {
      const clients = await getClientPresets(userId);
      setClientPresets(clients);
    }
  };

  // Don't show for anonymous users
  if (!userId) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/30 mb-4">
        <CardContent className="py-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no profile and no clients, show setup prompt
  if (!userProfile && clientPresets.length === 0) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/30 mb-4">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Save time with Brand Presets</p>
                <p className="text-xs text-zinc-500">Set up your profile for auto-fill</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="!border-zinc-700 !text-zinc-300 hover:!bg-zinc-800"
            >
              <a href="/dashboard/brand-presets/profile">Set Up</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg border border-zinc-800 bg-zinc-900/30">
        <span className="text-sm text-zinc-400">Auto-fill:</span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPresetType('self')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              presetType === 'self'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Myself
          </button>
          
          <button
            onClick={() => setPresetType('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              presetType === 'client'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Client
          </button>
        </div>

        {presetType === 'client' && (
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-[180px] h-8 bg-zinc-800 border-zinc-700 text-white text-sm">
              <SelectValue placeholder="Select client..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {clientPresets.map((client) => (
                <SelectItem 
                  key={client.id} 
                  value={client.id}
                  className="text-white hover:bg-zinc-700"
                >
                  <div className="flex items-center gap-2">
                    {client.is_favorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                    {client.client_company}
                  </div>
                </SelectItem>
              ))}
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-purple-400 hover:bg-zinc-700"
              >
                <Plus className="w-3 h-3" />
                Add new client
              </button>
            </SelectContent>
          </Select>
        )}

        <Button
          size="sm"
          onClick={handleApplyPreset}
          disabled={presetType === 'client' && !selectedClientId}
          className={`!text-white ${
            hasApplied 
              ? '!bg-green-600' 
              : '!bg-blue-600 hover:!bg-blue-700'
          }`}
        >
          {hasApplied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1" />
              Applied
            </>
          ) : (
            'Apply'
          )}
        </Button>

        <ClientPresetForm
          userId={userId}
          presetId={null}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSaved={handleClientCreated}
        />
      </div>
    );
  }

  // Full-size version
  return (
    <Card className="border-zinc-800 bg-zinc-900/30 mb-6">
      <CardContent className="py-5">
        <div className="space-y-4">
          <div>
            <Label className="text-zinc-300 text-sm mb-3 block">
              Who is this content for?
            </Label>
            
            <div className="flex gap-3">
              <button
                onClick={() => setPresetType('self')}
                className={`flex-1 flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  presetType === 'self'
                    ? 'bg-blue-600/10 border-blue-600/50 text-blue-400'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  presetType === 'self' ? 'bg-blue-600/20' : 'bg-zinc-800'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">For myself</p>
                  <p className="text-xs text-zinc-500">Use my profile data</p>
                </div>
              </button>
              
              <button
                onClick={() => setPresetType('client')}
                className={`flex-1 flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  presetType === 'client'
                    ? 'bg-purple-600/10 border-purple-600/50 text-purple-400'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  presetType === 'client' ? 'bg-purple-600/20' : 'bg-zinc-800'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">For a client</p>
                  <p className="text-xs text-zinc-500">Use client data</p>
                </div>
              </button>
            </div>
          </div>

          {presetType === 'client' && (
            <div>
              <Label className="text-zinc-300 text-sm mb-2 block">
                Select client
              </Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {clientPresets.map((client) => (
                    <SelectItem 
                      key={client.id} 
                      value={client.id}
                      className="text-white hover:bg-zinc-700"
                    >
                      <div className="flex items-center gap-2">
                        {client.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        <span>{client.client_company}</span>
                        {client.client_industry && (
                          <span className="text-zinc-500 text-xs">· {client.client_industry}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-2 flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300"
              >
                <Plus className="w-4 h-4" />
                Add new client
              </button>
            </div>
          )}

          <Button
            onClick={handleApplyPreset}
            disabled={presetType === 'client' && !selectedClientId}
            className={`w-full !text-white ${
              hasApplied 
                ? '!bg-green-600' 
                : '!bg-blue-600 hover:!bg-blue-700'
            }`}
          >
            {hasApplied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Fields Auto-Filled!
              </>
            ) : (
              'Auto-Fill Fields'
            )}
          </Button>
        </div>

        <ClientPresetForm
          userId={userId}
          presetId={null}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSaved={handleClientCreated}
        />
      </CardContent>
    </Card>
  );
}

