# 📚 Workflow Creation Documentation

This folder contains everything you need to create and manage workflows in PromptFinder.

---

## 📄 Files in this Folder

### 1. **WORKFLOW_CREATION_CHEAT_SHEET.md**
**Quick reference for all workflow fields**
- Complete list of all available fields
- Examples for each field type
- Best practices and tips
- SQL commands for common tasks

**Use when:** Creating a new workflow and need to remember all options

---

### 2. **WORKFLOW_TEMPLATE.ts**
**Copy-paste template with validation**
- TypeScript template for new workflows
- Built-in validator for field names
- SQL generator for Supabase insertion
- Comments explaining each field

**Use when:** Starting a new workflow from scratch

---

### 3. **WORKFLOW_VISUAL_GUIDE.md**
**Visual mapping of fields to UI**
- Shows what users see vs. what you fill out
- Screenshots and ASCII diagrams
- Field → UI element mapping
- Tips system explained

**Use when:** Want to understand how fields appear to users

---

## 🚀 Quick Start Guide

### Step 1: Read the Cheat Sheet
```bash
docs/workflow-creation/WORKFLOW_CREATION_CHEAT_SHEET.md
```
Get familiar with all available fields and options.

### Step 2: Copy the Template
```bash
docs/workflow-creation/WORKFLOW_TEMPLATE.ts
```
Use as starting point for your new workflow.

### Step 3: Validate & Generate SQL
1. Fill out the template
2. Run `validateWorkflow()`
3. Run `generateSQL()`
4. Paste SQL in Supabase

### Step 4: Test
1. Visit `/workflows/your-slug`
2. Fill out fields
3. Generate prompt
4. Test in ChatGPT/Claude

---

## 📋 Typical Workflow Structure

```typescript
{
  // Basics
  slug: "unique-slug",
  title: "User-Facing Title",
  description: "One sentence explanation",
  
  // Organization
  category_id: 1,              // 1=Writing, 2=Marketing, etc.
  tags: ["tag1", "tag2"],
  icon: "📝",
  
  // UX
  difficulty: "beginner",      // beginner|intermediate|advanced
  estimated_minutes: 5,
  tool: "chatgpt",             // chatgpt|claude|cursor|any
  
  // Admin
  status: "published",         // draft|published
  
  // Content
  steps: [
    {
      type: "prompt",
      prompt_template: "...",
      fields: [...]
    }
  ]
}
```

---

## 🎨 Two Tip Systems Explained

### 🔵 Input Description Tip (Blue)
- **Where:** Above input fields in InputStep
- **Source:** `step.input_description` (you write it)
- **Color:** Blue (bg-blue-500/10)
- **Example:** "Tip: The messier the notes, the more helpful!"
- **Use for:** Input guidance, context help

### 🟡 Pro Tip (Amber)
- **Where:** After Copy/ChatGPT buttons
- **Source:** Automatic based on `workflow.tool`
- **Color:** Amber (bg-amber-500/10)
- **Example:** "Pro tip: After pasting in ChatGPT, hit Enter..."
- **Use for:** Usage guidance, next-step help

---

## 🔗 Related Files

### Core Types
- `lib/types/workflow.ts` - TypeScript interfaces
- `lib/constants/categories.ts` - Category constants

### Components
- `components/workflow/steps/PromptStep.tsx`
- `components/workflow/steps/InputStep.tsx`
- `components/workflow/steps/InstructionStep.tsx`
- `components/workflow/HowItWorksBox.tsx`
- `components/workflow/ProTip.tsx`

### Database
- `supabase/migrations/008_categories_and_workflow_extensions.sql`
- `supabase/verify_migration_008.sql`

---

## 💡 Pro Tips

1. **Start Simple:** Begin with 1-2 fields, expand later
2. **Test Prompts:** Always test in ChatGPT before publishing
3. **Use Placeholders:** Give concrete examples
4. **Be Specific:** "Write a cold email for SaaS" > "Write email"
5. **Validate Variables:** Ensure all `{{variables}}` match field names

---

## 🆘 Troubleshooting

**Workflow not appearing?**
→ Check `status: "published"` not "draft"

**Variables not replaced?**
→ Ensure `{{field_name}}` exactly matches `field.name`

**Wrong category badge?**
→ Verify `category_id` is correct (1-6)

**Pro tip not showing?**
→ Check `tool` field is set correctly

---

## 📞 Support

For questions about workflow creation:
1. Check the cheat sheet first
2. Look at existing workflows in Supabase
3. Review the visual guide for UI mapping

---

**Last Updated:** 2024-11-30  
**Version:** 1.0 (post Migration 008)

