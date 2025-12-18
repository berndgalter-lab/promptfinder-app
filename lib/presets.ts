// Brand Presets API Functions

import { createClient } from '@/lib/supabase/client';
import type { 
  UserProfile, 
  ClientPreset, 
  UserProfileFormData, 
  ClientPresetFormData,
  USER_PROFILE_FIELD_MAPPINGS,
  CLIENT_PRESET_FIELD_MAPPINGS,
} from '@/lib/types/presets';

// ===========================================
// USER PROFILE FUNCTIONS
// ===========================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data;
}

export async function upsertUserProfile(
  userId: string, 
  formData: UserProfileFormData
): Promise<UserProfile> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      your_name: formData.your_name || null,
      your_email: formData.your_email || null,
      your_company: formData.your_company || null,
      your_website: formData.your_website || null,
      your_industry: formData.your_industry || null,
      your_services: formData.your_services || null,
      your_tone: formData.your_tone || null,
      your_brand_context: formData.your_brand_context || null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
  
  return data;
}

// ===========================================
// CLIENT PRESETS FUNCTIONS
// ===========================================

export async function getClientPresets(userId: string): Promise<ClientPreset[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('client_presets')
    .select('*')
    .eq('user_id', userId)
    .order('is_favorite', { ascending: false })
    .order('last_used_at', { ascending: false, nullsFirst: false })
    .order('client_company', { ascending: true });
  
  if (error) {
    console.error('Error fetching client presets:', error);
    throw error;
  }
  
  return data || [];
}

export async function getClientPreset(presetId: string): Promise<ClientPreset | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('client_presets')
    .select('*')
    .eq('id', presetId)
    .single();
  
  if (error) {
    console.error('Error fetching client preset:', error);
    throw error;
  }
  
  return data;
}

export async function createClientPreset(
  userId: string, 
  formData: ClientPresetFormData
): Promise<ClientPreset> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('client_presets')
    .insert({
      user_id: userId,
      client_company: formData.client_company,
      client_contact_name: formData.client_contact_name || null,
      client_contact_email: formData.client_contact_email || null,
      client_website: formData.client_website || null,
      client_industry: formData.client_industry || null,
      client_tone: formData.client_tone || null,
      client_brand_context: formData.client_brand_context || null,
      is_favorite: formData.is_favorite || false,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client preset:', error);
    throw error;
  }
  
  return data;
}

export async function updateClientPreset(
  presetId: string, 
  formData: Partial<ClientPresetFormData>
): Promise<ClientPreset> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('client_presets')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', presetId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating client preset:', error);
    throw error;
  }
  
  return data;
}

export async function deleteClientPreset(presetId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('client_presets')
    .delete()
    .eq('id', presetId);
  
  if (error) {
    console.error('Error deleting client preset:', error);
    throw error;
  }
}

export async function toggleClientFavorite(presetId: string, isFavorite: boolean): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('client_presets')
    .update({ is_favorite: isFavorite })
    .eq('id', presetId);
  
  if (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

export async function updateClientLastUsed(presetId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('client_presets')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', presetId);
  
  if (error) {
    console.error('Error updating last used:', error);
    throw error;
  }
}

// ===========================================
// AUTO-FILL HELPER FUNCTIONS
// ===========================================

import { 
  USER_PROFILE_FIELD_MAPPINGS as userMappings, 
  CLIENT_PRESET_FIELD_MAPPINGS as clientMappings 
} from '@/lib/types/presets';

/**
 * Get auto-fill values from user profile for workflow fields
 */
export function getAutoFillFromUserProfile(
  profile: UserProfile | null,
  fieldNames: string[]
): Record<string, string> {
  if (!profile) return {};
  
  const result: Record<string, string> = {};
  
  for (const fieldName of fieldNames) {
    const normalizedName = fieldName.toLowerCase().replace(/[^a-z_]/g, '');
    const mappedKey = userMappings[normalizedName];
    
    if (mappedKey && profile[mappedKey]) {
      result[fieldName] = profile[mappedKey] as string;
    }
  }
  
  return result;
}

/**
 * Get auto-fill values from client preset for workflow fields
 */
export function getAutoFillFromClientPreset(
  preset: ClientPreset | null,
  fieldNames: string[]
): Record<string, string> {
  if (!preset) return {};
  
  const result: Record<string, string> = {};
  
  for (const fieldName of fieldNames) {
    const normalizedName = fieldName.toLowerCase().replace(/[^a-z_]/g, '');
    const mappedKey = clientMappings[normalizedName];
    
    if (mappedKey) {
      const value = preset[mappedKey as keyof ClientPreset];
      if (value && typeof value === 'string') {
        result[fieldName] = value;
      }
    }
  }
  
  return result;
}

