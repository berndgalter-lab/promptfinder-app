// Brand Presets Type Definitions

export interface UserProfile {
  id: string;
  user_id: string;
  your_name: string | null;
  your_email: string | null;
  your_company: string | null;
  your_website: string | null;
  your_industry: string | null;
  your_services: string | null;
  your_tone: string | null;
  your_brand_context: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientPreset {
  id: string;
  user_id: string;
  client_company: string;
  client_contact_name: string | null;
  client_contact_email: string | null;
  client_website: string | null;
  client_industry: string | null;
  client_tone: string | null;
  client_brand_context: string | null;
  is_favorite: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PresetType = 'self' | 'client';

export interface PresetSelection {
  type: PresetType;
  clientId?: string; // only when type === 'client'
}

// Form data types (for creating/updating)
export interface UserProfileFormData {
  your_name?: string;
  your_email?: string;
  your_company?: string;
  your_website?: string;
  your_industry?: string;
  your_services?: string;
  your_tone?: string;
  your_brand_context?: string;
}

export interface ClientPresetFormData {
  client_company: string;
  client_contact_name?: string;
  client_contact_email?: string;
  client_website?: string;
  client_industry?: string;
  client_tone?: string;
  client_brand_context?: string;
  is_favorite?: boolean;
}

// Tone options for dropdowns
export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'playful', label: 'Playful' },
  { value: 'bold', label: 'Bold' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'direct', label: 'Direct' },
] as const;

// Auto-fill field mappings
export const USER_PROFILE_FIELD_MAPPINGS: Record<string, keyof UserProfileFormData> = {
  // Name variations
  'your_name': 'your_name',
  'sender_name': 'your_name',
  'host_name': 'your_name',
  'name': 'your_name',
  'author_name': 'your_name',
  
  // Email variations
  'your_email': 'your_email',
  'email': 'your_email',
  'contact_email': 'your_email',
  
  // Company variations
  'your_company': 'your_company',
  'company_name': 'your_company',
  'business_name': 'your_company',
  'brand_name': 'your_company',
  'company': 'your_company',
  
  // Website variations
  'website': 'your_website',
  'website_url': 'your_website',
  'your_website': 'your_website',
  'url': 'your_website',
  
  // Industry variations
  'industry': 'your_industry',
  'niche': 'your_industry',
  'your_industry': 'your_industry',
  'sector': 'your_industry',
  
  // Services variations
  'services': 'your_services',
  'what_you_sell': 'your_services',
  'product_service': 'your_services',
  'your_services': 'your_services',
  'offerings': 'your_services',
  'products': 'your_services',
  
  // Tone variations
  'tone': 'your_tone',
  'brand_voice': 'your_tone',
  'voice': 'your_tone',
  'writing_style': 'your_tone',
  'style': 'your_tone',
};

export const CLIENT_PRESET_FIELD_MAPPINGS: Record<string, keyof ClientPresetFormData> = {
  // Company variations
  'client_name': 'client_company',
  'client_company': 'client_company',
  'customer_name': 'client_company',
  'company_name': 'client_company',
  'company': 'client_company',
  'brand_name': 'client_company',
  
  // Contact name variations
  'contact_name': 'client_contact_name',
  'main_contact': 'client_contact_name',
  'client_contact_name': 'client_contact_name',
  'recipient_name': 'client_contact_name',
  
  // Email variations
  'contact_email': 'client_contact_email',
  'client_email': 'client_contact_email',
  'email': 'client_contact_email',
  
  // Website variations
  'client_website': 'client_website',
  'website': 'client_website',
  'website_url': 'client_website',
  
  // Industry variations
  'client_industry': 'client_industry',
  'industry': 'client_industry',
  'niche': 'client_industry',
  
  // Tone variations
  'tone': 'client_tone',
  'brand_voice': 'client_tone',
  'client_tone': 'client_tone',
  'voice': 'client_tone',
};

