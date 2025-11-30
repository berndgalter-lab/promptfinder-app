// Category Constants for PromptFinder
// These match the seeded categories in the database

import { Category } from '@/lib/types/workflow';

export const CATEGORY_SLUGS = {
  WRITING: 'writing',
  MARKETING: 'marketing',
  BUSINESS: 'business',
  PRODUCTIVITY: 'productivity',
  CAREER: 'career',
  DEVELOPMENT: 'development',
} as const;

export const CATEGORIES: Omit<Category, 'id' | 'created_at' | 'workflow_count'>[] = [
  {
    slug: 'writing',
    name: 'Writing',
    description: 'Create compelling content for blogs, social media, and more',
    icon: '✍️',
    sort_order: 1,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    description: 'Generate ad copy, campaigns, and marketing strategies',
    icon: '📣',
    sort_order: 2,
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Build reports, proposals, and business documents',
    icon: '💼',
    sort_order: 3,
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Summarize, research, and organize information faster',
    icon: '⚡',
    sort_order: 4,
  },
  {
    slug: 'career',
    name: 'Career',
    description: 'Craft resumes, cover letters, and prepare for interviews',
    icon: '🎯',
    sort_order: 5,
  },
  {
    slug: 'development',
    name: 'Development',
    description: 'Write code, documentation, and debug faster',
    icon: '💻',
    sort_order: 6,
  },
];

// Tool options for workflows
export const TOOL_OPTIONS = ['chatgpt', 'claude', 'cursor', 'any'] as const;

// Difficulty options
export const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced'] as const;

// Status options
export const STATUS_OPTIONS = ['draft', 'published'] as const;

// Tool display names
export const TOOL_LABELS: Record<typeof TOOL_OPTIONS[number], string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  cursor: 'Cursor',
  any: 'Any Tool',
};

// Difficulty display names
export const DIFFICULTY_LABELS: Record<typeof DIFFICULTY_OPTIONS[number], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// Difficulty colors for badges
export const DIFFICULTY_COLORS: Record<typeof DIFFICULTY_OPTIONS[number], string> = {
  beginner: 'bg-green-600/20 text-green-400 border-green-600/50',
  intermediate: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50',
  advanced: 'bg-red-600/20 text-red-400 border-red-600/50',
};

