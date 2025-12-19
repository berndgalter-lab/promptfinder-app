'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Loader2, User, Building2, Mail, Globe, Briefcase, Sparkles, FileText, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getUserProfile, upsertUserProfile } from '@/lib/presets';
import { TONE_OPTIONS, type UserProfileFormData } from '@/lib/types/presets';

interface UserProfileFormProps {
  userId: string;
}

export function UserProfileForm({ userId }: UserProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfileFormData>({
    your_name: '',
    your_email: '',
    your_company: '',
    your_role: '',
    your_website: '',
    your_industry: '',
    your_services: '',
    your_tone: '',
    your_differentiator: '',
    your_brand_context: '',
  });

  // Load existing profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          setFormData({
            your_name: profile.your_name || '',
            your_email: profile.your_email || '',
            your_company: profile.your_company || '',
            your_role: profile.your_role || '',
            your_website: profile.your_website || '',
            your_industry: profile.your_industry || '',
            your_services: profile.your_services || '',
            your_tone: profile.your_tone || '',
            your_differentiator: profile.your_differentiator || '',
            your_brand_context: profile.your_brand_context || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error loading profile',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [userId, toast]);

  const handleChange = (field: keyof UserProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await upsertUserProfile(userId, formData);
      toast({
        title: '✅ Profile saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error saving profile',
        description: 'Please try again later.',
      });
    } finally {
      setIsSaving(false);
    }
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
    <form onSubmit={handleSubmit}>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            My Profile
          </CardTitle>
          <CardDescription className="text-zinc-400">
            This data will be automatically filled into workflows when you select "For myself".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-500" />
                Your Name
              </Label>
              <Input
                placeholder="Max Mustermann"
                value={formData.your_name}
                onChange={(e) => handleChange('your_name', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500" />
                Your Email
              </Label>
              <Input
                type="email"
                placeholder="max@example.com"
                value={formData.your_email}
                onChange={(e) => handleChange('your_email', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Company & Role Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Company */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-500" />
                Your Company
              </Label>
              <Input
                placeholder="Acme Digital GmbH"
                value={formData.your_company}
                onChange={(e) => handleChange('your_company', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Role / Title */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-500" />
                Your Role / Title
              </Label>
              <Input
                placeholder="Founder & CEO"
                value={formData.your_role}
                onChange={(e) => handleChange('your_role', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Website & Industry Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Website */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-500" />
                Your Website
              </Label>
              <Input
                type="url"
                placeholder="https://acme.de"
                value={formData.your_website}
                onChange={(e) => handleChange('your_website', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-500" />
                Your Industry
              </Label>
              <Input
                placeholder="Web Development"
                value={formData.your_industry}
                onChange={(e) => handleChange('your_industry', e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label className="text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-500" />
              Your Services / Offering
            </Label>
            <Input
              placeholder="Webdesign, Web-Apps, Landing Pages"
              value={formData.your_services}
              onChange={(e) => handleChange('your_services', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Your Writing Style / Tone</Label>
            <Select
              value={formData.your_tone || ''}
              onValueChange={(value) => handleChange('your_tone', value)}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select your preferred tone..." />
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

          {/* Differentiator / USP */}
          <div className="space-y-2">
            <Label className="text-zinc-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-500" />
              Your Differentiator / USP
            </Label>
            <Textarea
              placeholder="What makes you different from competitors? Your unique selling proposition..."
              value={formData.your_differentiator}
              onChange={(e) => handleChange('your_differentiator', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[80px]"
            />
            <p className="text-xs text-zinc-500">
              This will be used in proposals, pitches and sales materials.
            </p>
          </div>

          {/* Brand Context */}
          <div className="space-y-2">
            <Label className="text-zinc-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              About You / Your Brand (Free text)
            </Label>
            <Textarea
              placeholder="Describe yourself, your business, target audience, unique selling points, brand philosophy... This context will help AI understand your brand better."
              value={formData.your_brand_context}
              onChange={(e) => handleChange('your_brand_context', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[150px]"
            />
            <p className="text-xs text-zinc-500">
              Add any information that would help AI write content that sounds like you.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="!bg-blue-600 hover:!bg-blue-700 !text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

