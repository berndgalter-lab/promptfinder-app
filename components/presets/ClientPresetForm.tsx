'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save, Loader2, Building2, User, Mail, Globe, Briefcase, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createClientPreset, updateClientPreset, getClientPreset } from '@/lib/presets';
import { TONE_OPTIONS, type ClientPresetFormData, type ClientPreset } from '@/lib/types/presets';

interface ClientPresetFormProps {
  userId: string;
  presetId?: string | null; // null = create new, string = edit existing
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function ClientPresetForm({ 
  userId, 
  presetId, 
  isOpen, 
  onClose, 
  onSaved 
}: ClientPresetFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ClientPresetFormData>({
    client_company: '',
    client_contact_name: '',
    client_contact_email: '',
    client_website: '',
    client_industry: '',
    client_tone: '',
    client_brand_context: '',
    is_favorite: false,
  });

  const isEditing = !!presetId;

  // Load existing preset if editing
  useEffect(() => {
    async function loadPreset() {
      if (!presetId || !isOpen) return;
      
      setIsLoading(true);
      try {
        const preset = await getClientPreset(presetId);
        if (preset) {
          setFormData({
            client_company: preset.client_company,
            client_contact_name: preset.client_contact_name || '',
            client_contact_email: preset.client_contact_email || '',
            client_website: preset.client_website || '',
            client_industry: preset.client_industry || '',
            client_tone: preset.client_tone || '',
            client_brand_context: preset.client_brand_context || '',
            is_favorite: preset.is_favorite,
          });
        }
      } catch (error) {
        console.error('Error loading preset:', error);
        toast({
          title: 'Error loading client',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      if (presetId) {
        loadPreset();
      } else {
        // Reset form for new client
        setFormData({
          client_company: '',
          client_contact_name: '',
          client_contact_email: '',
          client_website: '',
          client_industry: '',
          client_tone: '',
          client_brand_context: '',
          is_favorite: false,
        });
      }
    }
  }, [presetId, isOpen, toast]);

  const handleChange = (field: keyof ClientPresetFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_company.trim()) {
      toast({
        title: 'Company name required',
        description: 'Please enter a company name.',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && presetId) {
        await updateClientPreset(presetId, formData);
        toast({
          title: '✅ Client updated',
          description: `${formData.client_company} has been updated.`,
        });
      } else {
        await createClientPreset(userId, formData);
        toast({
          title: '✅ Client created',
          description: `${formData.client_company} has been added.`,
        });
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving preset:', error);
      toast({
        title: 'Error saving client',
        description: 'Please try again later.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            {isEditing ? 'Edit Client' : 'New Client'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Save client information for quick auto-fill in workflows.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name (Required) */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-500" />
                Company Name <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="TechFlow GmbH"
                value={formData.client_company}
                onChange={(e) => handleChange('client_company', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Contact Name & Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" />
                  Contact Name
                </Label>
                <Input
                  placeholder="Anna Schmidt"
                  value={formData.client_contact_name}
                  onChange={(e) => handleChange('client_contact_name', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="anna@techflow.de"
                  value={formData.client_contact_email}
                  onChange={(e) => handleChange('client_contact_email', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Website & Industry */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  Website
                </Label>
                <Input
                  type="url"
                  placeholder="https://techflow.de"
                  value={formData.client_website}
                  onChange={(e) => handleChange('client_website', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                  Industry
                </Label>
                <Input
                  placeholder="E-Commerce"
                  value={formData.client_industry}
                  onChange={(e) => handleChange('client_industry', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Brand Voice / Tone</Label>
              <Select
                value={formData.client_tone || ''}
                onValueChange={(value) => handleChange('client_tone', value)}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select tone..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-zinc-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Context */}
            <div className="space-y-2">
              <Label className="text-zinc-300">About the Client (Free text)</Label>
              <Textarea
                placeholder="Describe the client's business, target audience, brand style, products/services..."
                value={formData.client_brand_context}
                onChange={(e) => handleChange('client_brand_context', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px]"
              />
            </div>

            {/* Favorite Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_favorite"
                checked={formData.is_favorite}
                onCheckedChange={(checked) => handleChange('is_favorite', checked === true)}
                className="border-zinc-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
              />
              <Label 
                htmlFor="is_favorite" 
                className="text-zinc-300 cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-yellow-500" />
                Mark as favorite
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="!border-zinc-700 !text-zinc-300 hover:!bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="!bg-purple-600 hover:!bg-purple-700 !text-white"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditing ? 'Save Changes' : 'Create Client'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

