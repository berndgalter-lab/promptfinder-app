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
  your_website?: string;
  your_industry?: string;
  your_services?: string;
  your_tone?: string;
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
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'playful', label: 'Playful' },
  { value: 'bold', label: 'Bold' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'direct', label: 'Direct' },
] as const;

// Auto-fill field mappings for User Profile ("For myself")
export const USER_PROFILE_FIELD_MAPPINGS: Record<string, keyof UserProfileFormData> = {
  // your_name variations
  'your_name': 'your_name',
  'sender_name': 'your_name',
  'host_name': 'your_name',
  'author_name': 'your_name',
  
  // your_email variations
  'your_email': 'your_email',
  'email': 'your_email',
  'contact_email': 'your_email',
  
  // your_company variations
  'your_company': 'your_company',
  'company_mention': 'your_company',  // Blog Post Creator SOP
  'my_company': 'your_company',
  'business_name': 'your_company',
  
  // your_website variations
  'your_website': 'your_website',
  'website': 'your_website',
  'website_url': 'your_website',
  
  // your_industry variations
  'your_industry': 'your_industry',
  
  // your_services variations
  'your_services': 'your_services',
  'your_specialty': 'your_services',  // Client Proposal Generator SOP
  'my_offering': 'your_services',     // Sales Call Preparation SOP
  'services': 'your_services',
  'what_you_sell': 'your_services',
  'product_service': 'your_services',
  'offerings': 'your_services',
  'products': 'your_services',
  
  // your_tone variations
  'your_tone': 'your_tone',
  'tone': 'your_tone',
  'brand_voice': 'your_tone',         // Blog Post Creator SOP
  'proposal_tone': 'your_tone',       // Client Proposal Generator SOP
  'personality_style': 'your_tone',   // LinkedIn Content Strategy SOP
  'voice': 'your_tone',
  'writing_style': 'your_tone',
  'style': 'your_tone',
  
  // your_differentiator variations
  'your_differentiator': 'your_differentiator',
  'differentiator': 'your_differentiator',  // Sales Call Preparation SOP
  'unique_value': 'your_differentiator',
  'usps': 'your_differentiator',
};

// Auto-fill field mappings for Client Presets ("For a client")
// IMPORTANT: When "For a client" is selected, ALL fields come from the client preset
// (no mixing with user profile)
export const CLIENT_PRESET_FIELD_MAPPINGS: Record<string, keyof ClientPresetFormData> = {
  // === Person (for content creation - e.g. LinkedIn ghostwriting) ===
  'your_name': 'client_name',           // Person you're creating content FOR
  'name': 'client_name',
  'author_name': 'client_name',
  'host_name': 'client_name',
  'sender_name': 'client_name',
  
  'your_role': 'client_role',
  'role': 'client_role',
  
  // === Company ===
  'your_company': 'client_company',     // Client's company when working for them
  'company_name': 'client_company',
  'client_company': 'client_company',
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
  
  // === Website ===
  'client_website': 'client_website',
  'website': 'client_website',
  'your_website': 'client_website',
  'website_url': 'client_website',
  
  // === Industry ===
  'client_industry': 'client_industry',
  'industry': 'client_industry',
  'your_industry': 'client_industry',
  'niche': 'client_industry',
  'sector': 'client_industry',
  
  // === Tone / Voice ===
  'client_tone': 'client_tone',
  'tone': 'client_tone',
  'brand_voice': 'client_tone',
  'your_tone': 'client_tone',
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

