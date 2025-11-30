/**
 * 📝 WORKFLOW CREATION TEMPLATE
 * 
 * Kopiere diese Datei und fülle die Werte aus.
 * Dann kannst du den JSON in Supabase einfügen.
 */

import { type Workflow, type PromptStep, type InputStep, type InstructionStep } from '@/lib/types/workflow';

// ==============================================================================
// WORKFLOW TEMPLATE - FILL THIS OUT
// ==============================================================================

const newWorkflow = {
  // === BASICS (REQUIRED) ===
  slug: 'my-workflow-slug',              // ⚠️ Must be unique, URL-friendly
  title: 'My Workflow Title',            // ⚠️ User-visible name
  description: 'Short description',      // ⚠️ One sentence
  workflow_type: 'combined',             // 'combined' or 'sequential'
  tier: 'essential',                     // 'essential' or 'advanced'

  // === ORGANIZATION & DISCOVERY ===
  category_id: 1,                        // ⚠️ 1=Writing, 2=Marketing, 3=Business, 4=Productivity, 5=Career, 6=Development
  tags: ['tag1', 'tag2', 'tag3'],        // 💡 3-5 tags for search/filter
  icon: '📝',                            // 💡 Emoji that represents this workflow

  // === USER EXPERIENCE ===
  difficulty: 'beginner',                // 'beginner' | 'intermediate' | 'advanced'
  estimated_minutes: 5,                  // ⏱️ Realistic time estimate
  tool: 'any',                           // 'chatgpt' | 'claude' | 'cursor' | 'any'

  // === SEO (OPTIONAL) ===
  meta_title: null,                      // SEO title (leave null to use title)
  meta_description: null,                // SEO description (leave null to use description)

  // === ADMIN ===
  status: 'draft',                       // Start with 'draft', change to 'published' when ready
  featured: false,                       // Set to true for homepage highlight
  sort_order: 0,                         // Manual ordering (0 = default)

  // === STEPS (REQUIRED) ===
  steps: [
    // --- OPTION 1: PromptStep (most common) ---
    {
      number: 1,
      type: 'prompt',
      title: 'Your Details',             // ⚠️ Not displayed anymore (Section Label used)
      description: 'Fill in the fields', // ⚠️ Not displayed anymore
      
      prompt_template: `
Write a [something] that [does something].

Context: {{field_name_1}}
Additional info: {{field_name_2}}

Make it [characteristic].
      `,
      
      fields: [
        {
          name: 'field_name_1',          // ⚠️ Must match {{variable}} in template
          label: 'User-friendly label',  // ⚠️ What user sees
          type: 'textarea',              // 'text' | 'textarea' | 'select'
          required: true,                // Make essential fields required
          placeholder: 'Give a helpful example...',
        },
        {
          name: 'field_name_2',
          label: 'Another Field',
          type: 'select',
          required: false,
          placeholder: 'Select an option',
          options: ['Option 1', 'Option 2', 'Option 3'],
        },
      ],
    },

    // --- OPTION 2: InputStep (for pasting content) ---
    // {
    //   number: 1,
    //   type: 'input',
    //   title: 'Paste Your Content',
    //   description: 'Paste the content to process',
    //   input_label: 'Your Content',
    //   input_placeholder: 'Paste here...',
    //   input_description: 'Tip: The more context you provide, the better!',  // 💡 Shows as blue tip
    //   input_name: 'user_content',  // Variable for {{user_content}}
    // },

    // --- OPTION 3: InstructionStep (for guidance) ---
    // {
    //   number: 2,
    //   type: 'instruction',
    //   title: 'Next Steps',
    //   description: 'Follow these instructions',
    //   instruction_text: `
    //     1. Copy the generated prompt
    //     2. Open ChatGPT
    //     3. Paste and hit Enter
    //   `,
    //   instruction_icon: 'arrow-right',  // Optional: 'clipboard' | 'arrow-right' | 'check' | 'info' | 'paste' | 'send'
    // },
  ],
};

// ==============================================================================
// SQL INSERT STATEMENT GENERATOR
// ==============================================================================

/**
 * Copy this SQL and run in Supabase SQL Editor
 */
const generateSQL = () => {
  return `
INSERT INTO workflows (
  slug, 
  title, 
  description, 
  workflow_type, 
  tier,
  category_id, 
  tags, 
  icon,
  difficulty, 
  estimated_minutes, 
  tool,
  meta_title,
  meta_description,
  status, 
  featured, 
  sort_order,
  steps
)
VALUES (
  '${newWorkflow.slug}',
  '${newWorkflow.title}',
  '${newWorkflow.description}',
  '${newWorkflow.workflow_type}',
  '${newWorkflow.tier}',
  ${newWorkflow.category_id},
  ARRAY[${newWorkflow.tags.map(t => `'${t}'`).join(', ')}],
  '${newWorkflow.icon}',
  '${newWorkflow.difficulty}',
  ${newWorkflow.estimated_minutes},
  '${newWorkflow.tool}',
  ${newWorkflow.meta_title ? `'${newWorkflow.meta_title}'` : 'NULL'},
  ${newWorkflow.meta_description ? `'${newWorkflow.meta_description}'` : 'NULL'},
  '${newWorkflow.status}',
  ${newWorkflow.featured},
  ${newWorkflow.sort_order},
  '${JSON.stringify(newWorkflow.steps)}'::jsonb
);
`;
};

// ==============================================================================
// FIELD NAME VALIDATOR
// ==============================================================================

/**
 * Validates that all {{variables}} in prompt_template match field names
 */
const validateWorkflow = () => {
  const errors: string[] = [];

  newWorkflow.steps.forEach((step, index) => {
    if (step.type === 'prompt') {
      const template = step.prompt_template;
      const variables = template.match(/\{\{(\w+)\}\}/g) || [];
      const variableNames = variables.map(v => v.replace(/[{}]/g, ''));
      const fieldNames = step.fields.map(f => f.name);

      variableNames.forEach(varName => {
        if (!fieldNames.includes(varName)) {
          errors.push(`Step ${index + 1}: Variable {{${varName}}} has no matching field`);
        }
      });

      fieldNames.forEach(fieldName => {
        if (!template.includes(`{{${fieldName}}}`)) {
          errors.push(`Step ${index + 1}: Field "${fieldName}" is not used in template`);
        }
      });
    }
  });

  if (errors.length > 0) {
    console.error('❌ Validation Errors:');
    errors.forEach(err => console.error('  -', err));
    return false;
  }

  console.log('✅ Workflow is valid!');
  return true;
};

// ==============================================================================
// USAGE
// ==============================================================================

// 1. Fill out the newWorkflow object above
// 2. Run: validateWorkflow()
// 3. If valid, run: console.log(generateSQL())
// 4. Copy SQL and paste in Supabase SQL Editor
// 5. Test the workflow in your app

export { newWorkflow, generateSQL, validateWorkflow };

