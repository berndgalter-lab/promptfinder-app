// PromptFinder Workflow Type Definitions

// Category Type
export interface Category {
  id: number;
  created_at: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
  workflow_count: number;
}

// Step Types
export type StepType = 'prompt' | 'instruction' | 'input' | 'checkpoint';

// Tool Types
export type ToolType = 'chatgpt' | 'claude' | 'cursor' | 'any';

// Difficulty Types
export type DifficultyType = 'beginner' | 'intermediate' | 'advanced';

// Status Types
export type WorkflowStatus = 'draft' | 'published';

// Field Types (for prompt steps)
export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect';

// Field Definition
export interface WorkflowField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];  // only for type: 'select'
}

// Chat instruction type for multi-step SOPs
export type ChatInstruction = 'new_chat' | 'same_chat' | 'paste_previous';

// Base Step (shared properties)
export interface BaseStep {
  number: number;
  type: StepType;
  title: string;
  description: string;
  
  // SOP-spezifische Felder (optional, nur für SOPs)
  why?: string;
  duration_minutes?: number;
  quality_checks?: string[];
  common_mistakes?: string[];
  chat_instruction?: ChatInstruction;
}

// Prompt Step - has fields and prompt template
export interface PromptStep extends BaseStep {
  type: 'prompt';
  prompt_template: string;
  fields: WorkflowField[];
}

// Instruction Step - just text and icon
export interface InstructionStep extends BaseStep {
  type: 'instruction';
  instruction_text: string;
  instruction_icon?: 'clipboard' | 'clipboard-check' | 'arrow-right' | 'check' | 'info' | 'paste' | 'send';
}

// Input Step - user pastes their own content
export interface InputStep extends BaseStep {
  type: 'input';
  input_label: string;
  input_placeholder?: string;
  input_description?: string;
  input_name?: string;  // Variable name for use in prompts, e.g. "meeting_notes" → {{meeting_notes}}
}

// Checkpoint Item (for checkpoint steps)
export interface CheckpointItem {
  label: string;
  required: boolean;
}

// Checkpoint Step - checklist that user must complete before proceeding
export interface CheckpointStep {
  number: number;
  type: 'checkpoint';
  title: string;
  description?: string; // Optional for checkpoint steps
  items: CheckpointItem[];
  blocking?: boolean; // default true - must complete all required items to proceed
  // SOP-specific fields (optional)
  why?: string;
  duration_minutes?: number;
}

// Deliverable - output collected from a step
export interface Deliverable {
  step: number;
  name: string;
  format: 'text' | 'email' | 'checklist' | 'document';
  description?: string;
}

// Union type for all steps
export type WorkflowStep = PromptStep | InstructionStep | InputStep | CheckpointStep;

// Workflow Type
export type WorkflowType = 'combined' | 'sequential';

// SOP Details (for multi-step sequential workflows)
export interface SOPDetails {
  target_role: string | null;
  prerequisites: string[] | null;
  outcome_description: string | null;
  next_steps: string | null;
  platform_instructions: string | null;
}

// Complete Workflow
export interface Workflow {
  id: string;  // UUID from Supabase
  slug: string;
  title: string;
  description: string;
  workflow_type: WorkflowType;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
  // NEW: Extended fields for SEO, discovery, and organization
  category_id: number | null;
  tags: string[];
  tool: ToolType;
  difficulty: DifficultyType;
  estimated_minutes: number;
  icon: string;
  meta_title: string | null;
  meta_description: string | null;
  featured: boolean;
  usage_count: number;
  status: WorkflowStatus;
  sort_order: number;
  // NEW: Additional content fields
  time_saved_minutes: number | null;
  use_cases: string[] | null;
  example_output: string | null;
  long_description: string | null;
  sop_details: SOPDetails | null;
  // SOP Features
  deliverables?: Deliverable[];
  suggested_next_actions?: string[];
}

// User's progress through a workflow
export interface WorkflowProgress {
  currentStep: number;
  completedSteps: number[];
  fieldValues: Record<number, Record<string, string>>;  // stepNumber -> fieldName -> value
  inputValues: Record<number, string>;  // stepNumber -> user input text
}

// Type guards for step types
export function isPromptStep(step: WorkflowStep): step is PromptStep {
  return step.type === 'prompt';
}

export function isInstructionStep(step: WorkflowStep): step is InstructionStep {
  return step.type === 'instruction';
}

export function isInputStep(step: WorkflowStep): step is InputStep {
  return step.type === 'input';
}

export function isCheckpointStep(step: WorkflowStep): step is CheckpointStep {
  return step.type === 'checkpoint';
}

