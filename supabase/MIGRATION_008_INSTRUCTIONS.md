# Migration 008: Categories & Workflow Extensions

## 📋 Overview

This migration adds:
- **Categories table** with 6 predefined categories
- **12 new columns** to workflows table for SEO, discovery, and organization
- **Indexes** for performance
- **Constraints** for data validation
- **RLS policies** for security

---

## 🚀 How to Apply Migration

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your PromptFinder project
3. Click **SQL Editor** in sidebar

### Step 2: Run Migration Script

1. Copy contents of `supabase/migrations/008_categories_and_workflow_extensions.sql`
2. Paste into SQL Editor
3. Click **Run** button
4. Wait for success message

### Step 3: Verify Migration

1. Copy contents of `supabase/verify_migration_008.sql`
2. Paste into SQL Editor
3. Click **Run** button
4. Check all results show `✅ PASS`

---

## 📊 What This Migration Does

### Creates `categories` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key |
| `slug` | TEXT | Unique URL-friendly identifier |
| `name` | TEXT | Display name |
| `description` | TEXT | Category description |
| `icon` | TEXT | Emoji icon |
| `sort_order` | INTEGER | Display order |
| `workflow_count` | INTEGER | Number of workflows in category |

**Seeded Categories:**
1. ✍️ Writing
2. 📣 Marketing
3. 💼 Business
4. ⚡ Productivity
5. 🎯 Career
6. 💻 Development

---

### Extends `workflows` Table

**New Columns:**

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `category_id` | BIGINT | NULL | FK to categories |
| `tags` | TEXT[] | [] | Flexible filtering |
| `tool` | TEXT | 'any' | chatgpt/claude/cursor/any |
| `difficulty` | TEXT | 'beginner' | beginner/intermediate/advanced |
| `estimated_minutes` | INTEGER | 5 | Time estimate |
| `icon` | TEXT | '📝' | Workflow emoji |
| `meta_title` | TEXT | NULL | SEO title |
| `meta_description` | TEXT | NULL | SEO description |
| `featured` | BOOLEAN | FALSE | Homepage highlight |
| `usage_count` | INTEGER | 0 | Popularity tracking |
| `status` | TEXT | 'draft' | draft/published |
| `sort_order` | INTEGER | 0 | Manual ordering |

**Constraints:**
- `valid_tool`: Ensures tool is one of: chatgpt, claude, cursor, any
- `valid_difficulty`: Ensures difficulty is: beginner, intermediate, advanced
- `valid_status`: Ensures status is: draft, published

**Indexes:**
- `idx_workflows_category_id` - Fast category filtering
- `idx_workflows_status` - Fast draft/published filtering
- `idx_workflows_featured` - Fast featured workflow queries
- `idx_workflows_tags` - GIN index for array search
- `idx_workflows_tool` - Fast tool filtering
- `idx_workflows_difficulty` - Fast difficulty filtering
- `idx_categories_slug` - Fast category lookup by slug
- `idx_categories_sort_order` - Fast ordered category queries

---

## 🔍 TypeScript Types Updated

Updated: `lib/types/workflow.ts`

**New Types:**
```typescript
export type ToolType = 'chatgpt' | 'claude' | 'cursor' | 'any';
export type DifficultyType = 'beginner' | 'intermediate' | 'advanced';
export type WorkflowStatus = 'draft' | 'published';

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
```

**Extended Workflow Interface:**
```typescript
export interface Workflow {
  // ... existing fields ...
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
}
```

---

## ⚠️ Breaking Changes

### Before Migration
```typescript
interface Workflow {
  id: string;
  slug: string;
  title: string;
  // ... 6 more fields
}
```

### After Migration
```typescript
interface Workflow {
  id: string;
  slug: string;
  title: string;
  // ... 6 existing + 12 NEW fields
}
```

**Impact:**
- Existing workflow queries will still work (backward compatible)
- New fields have sensible defaults
- All existing workflows set to `status: 'published'` automatically
- TypeScript will now enforce new field types

---

## 📝 Next Steps After Migration

1. **Update workflow forms** to include new fields
2. **Add category filter** to workflows page
3. **Implement tag system** for flexible filtering
4. **Add SEO meta tags** to workflow detail pages
5. **Create featured workflows section** on homepage
6. **Track usage counts** when workflows are used
7. **Add difficulty badges** to workflow cards
8. **Show estimated time** on workflow cards

---

## 🔄 Rollback (if needed)

If you need to rollback this migration:

```sql
-- Remove new columns from workflows
ALTER TABLE public.workflows
DROP COLUMN IF EXISTS category_id,
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS tool,
DROP COLUMN IF EXISTS difficulty,
DROP COLUMN IF EXISTS estimated_minutes,
DROP COLUMN IF EXISTS icon,
DROP COLUMN IF EXISTS meta_title,
DROP COLUMN IF EXISTS meta_description,
DROP COLUMN IF EXISTS featured,
DROP COLUMN IF EXISTS usage_count,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS sort_order;

-- Drop categories table
DROP TABLE IF EXISTS public.categories CASCADE;
```

---

## ✅ Verification Checklist

After running migration, verify:

- [ ] Categories table created with 6 categories
- [ ] Workflows table has 12 new columns
- [ ] All constraints are in place
- [ ] All indexes are created
- [ ] RLS policy for categories exists
- [ ] TypeScript types updated
- [ ] No linter errors
- [ ] Existing workflows still load correctly

---

## 📞 Support

If you encounter issues:
1. Check Supabase SQL Editor error messages
2. Run verification script
3. Review migration SQL for typos
4. Check Supabase logs in Dashboard

---

**Migration Status:** ✅ Ready to Apply
**Created:** 2024-11-30
**Author:** AI Assistant
**Version:** 008

