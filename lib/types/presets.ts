// Brand Presets Type Definitions

export interface UserProfile {
  id: string;
  user_id: string;
  your_name: string | null;
  your_email: string | null;
  your_company: string | null;
  your_role: string | null;           // Founder & CEO, Marketing Manager, etc.
  your_website: string | null;
  your_industry: string | null;
  your_services: string | null;
  your_tone: string | null;
  your_target_audience: string | null;
  your_differentiator: string | null;
  your_brand_context: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientPreset {
  id: string;
  user_id: string;
  
  // Company
  client_company: string;
  client_industry: string | null;
  client_website: string | null;
  
  // Person (for content creation - e.g. LinkedIn ghostwriting)
  client_name: string | null;
  client_role: string | null;
  
  // Billing Contact (for proposals & invoices)
  client_contact_name: string | null;
  client_contact_email: string | null;
  
  // Brand & Content
  client_tone: string | null;
  client_target_audience: string | null;
  client_brand_context: string | null;
  
  // Meta
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
  your_role?: string;                  // Founder & CEO, Marketing Manager, etc.
  your_website?: string;
  your_industry?: string;
  your_services?: string;
  your_tone?: string;
  your_target_audience?: string;
  your_differentiator?: string;
  your_brand_context?: string;
}

export interface ClientPresetFormData {
  // Company
  client_company: string;
  client_industry?: string;
  client_website?: string;
  
  // Person (for content creation)
  client_name?: string;
  client_role?: string;
  
  // Billing Contact
  client_contact_name?: string;
  client_contact_email?: string;
  
  // Brand & Content
  client_tone?: string;
  client_target_audience?: string;
  client_brand_context?: string;
  
  is_favorite?: boolean;
}

// Tone options for dropdowns
export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional & Formal' },
  { value: 'friendly', label: 'Friendly & Conversational' },
  { value: 'casual', label: 'Casual & Relaxed' },
  { value: 'bold', label: 'Bold & Provocative' },
  { value: 'playful', label: 'Witty & Playful' },
  { value: 'inspirational', label: 'Inspirational & Motivating' },
  { value: 'educational', label: 'Educational & Informative' },
  { value: 'empathetic', label: 'Empathetic & Caring' },
  { value: 'direct', label: 'Direct & No-Nonsense' },
] as const;

// Auto-fill field mappings for User Profile ("For myself")
export const USER_PROFILE_FIELD_MAPPINGS: Record<string, keyof UserProfileFormData> = {
  // === user_* Felder (Playbook Standard) ===
  'user_name': 'your_name',
  'user_email': 'your_email',
  'user_company': 'your_company',
  'user_role': 'your_role',
  'user_website': 'your_website',
  'user_industry': 'your_industry',
  'user_services': 'your_services',
  'user_tone': 'your_tone',
  'user_differentiator': 'your_differentiator',
  
  // === Legacy your_* Felder (für bestehende Workflows) ===
  'your_name': 'your_name',
  'your_email': 'your_email',
  'your_company': 'your_company',
  'your_role': 'your_role',
  'your_website': 'your_website',
  'your_industry': 'your_industry',
  'your_services': 'your_services',
  'your_tone': 'your_tone',
  'your_differentiator': 'your_differentiator',
  
  // === Name Varianten ===
  'sender_name': 'your_name',
  'host_name': 'your_name',
  'author_name': 'your_name',
  
  // === Email Varianten ===
  'email': 'your_email',
  'contact_email': 'your_email',
  
  // === Company Varianten ===
  'company_mention': 'your_company',
  'my_company': 'your_company',
  'business_name': 'your_company',    // Nur wenn kein client_* Kontext
  
  // === Role Varianten ===
  'role': 'your_role',
  'job_title': 'your_role',
  'title': 'your_role',
  
  // === Website Varianten ===
  'website': 'your_website',
  'website_url': 'your_website',
  
  // === Services Varianten ===
  'your_specialty': 'your_services',
  'my_offering': 'your_services',
  'services': 'your_services',
  'what_you_sell': 'your_services',
  'product_service': 'your_services',
  'offerings': 'your_services',
  'products': 'your_services',
  
  // === Tone Varianten ===
  'tone': 'your_tone',
  'brand_voice': 'your_tone',
  'proposal_tone': 'your_tone',
  'personality_style': 'your_tone',
  'voice': 'your_tone',
  'writing_style': 'your_tone',
  'style': 'your_tone',
  
  // === Target Audience Varianten ===
  'your_target_audience': 'your_target_audience',
  'user_target_audience': 'your_target_audience',
  'my_audience': 'your_target_audience',
  
  // === Differentiator Varianten ===
  'differentiator': 'your_differentiator',
  'unique_value': 'your_differentiator',
  'usps': 'your_differentiator',
};

// Auto-fill field mappings for Client Presets ("For a client")
// IMPORTANT: When "For a client" is selected, ALL fields come from the client preset
// (no mixing with user profile)
export const CLIENT_PRESET_FIELD_MAPPINGS: Record<string, keyof ClientPresetFormData> = {
  // === user_* Felder bei "Für Kunde" → Client Preset ===
  // (Wenn User Content FÜR Kunden erstellt)
  'user_name': 'client_name',
  'user_role': 'client_role',
  'user_company': 'client_company',
  'user_website': 'client_website',
  'user_industry': 'client_industry',
  'user_tone': 'client_tone',
  
  // === Legacy your_* → client_* (für bestehende Workflows) ===
  'your_name': 'client_name',
  'your_role': 'client_role',
  'your_company': 'client_company',
  'your_website': 'client_website',
  'your_industry': 'client_industry',
  'your_tone': 'client_tone',
  
  // === Name Varianten ===
  'name': 'client_name',
  'author_name': 'client_name',
  'host_name': 'client_name',
  'sender_name': 'client_name',
  
  // === Role Varianten ===
  'role': 'client_role',
  'job_title': 'client_role',
  'title': 'client_role',
  
  // === Company Varianten ===
  'client_company': 'client_company',
  'company_name': 'client_company',
  'business_name': 'client_company',
  'company_mention': 'client_company',
  'prospect_company': 'client_company',
  'customer_name': 'client_company',
  'company': 'client_company',
  'brand_name': 'client_company',
  'my_company': 'client_company',
  
  // === Billing Contact (for proposals & invoices) ===
  'client_contact_name': 'client_contact_name',
  'contact_name': 'client_contact_name',
  'main_contact': 'client_contact_name',
  'prospect_name': 'client_contact_name',
  'recipient_name': 'client_contact_name',
  
  'client_contact_email': 'client_contact_email',
  'contact_email': 'client_contact_email',
  'client_email': 'client_contact_email',
  'email': 'client_contact_email',
  
  // === Website Varianten ===
  'client_website': 'client_website',
  'website': 'client_website',
  'website_url': 'client_website',
  
  // === Industry Varianten ===
  'client_industry': 'client_industry',
  'industry': 'client_industry',
  'niche': 'client_industry',
  'sector': 'client_industry',
  
  // === Tone / Voice Varianten ===
  'client_tone': 'client_tone',
  'tone': 'client_tone',
  'brand_voice': 'client_tone',
  'personality_style': 'client_tone',
  'voice': 'client_tone',
  'writing_style': 'client_tone',
  'proposal_tone': 'client_tone',
  'style': 'client_tone',
  
  // === Target Audience ===
  'client_target_audience': 'client_target_audience',
  'target_audience': 'client_target_audience',
  'target_reader': 'client_target_audience',
  'audience': 'client_target_audience',
  'ideal_customer': 'client_target_audience',
  
  // === Services/Offering (maps to brand_context as fallback) ===
  'your_services': 'client_brand_context',
  'user_services': 'client_brand_context',
  'my_offering': 'client_brand_context',
  'your_specialty': 'client_brand_context',
  'services': 'client_brand_context',
  'what_you_sell': 'client_brand_context',
  'product_service': 'client_brand_context',
};

// Auto-fill tracking for UI indicators
export interface AutoFilledField {
  fieldName: string;
  source: 'profile' | 'client';
  sourceName: string; // "your profile" or "TechFlow GmbH preset"
}

