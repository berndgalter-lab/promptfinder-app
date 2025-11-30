-- Verification Script for Migration 008
-- Run this in Supabase SQL Editor to verify the migration was successful

-- ==============================================================================
-- 1. Check if categories table exists and has data
-- ==============================================================================

SELECT 
  'Categories Table' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 6 THEN '✅ PASS'
    ELSE '❌ FAIL - Expected 6 categories'
  END as status
FROM public.categories;

-- Show all categories
SELECT * FROM public.categories ORDER BY sort_order;

-- ==============================================================================
-- 2. Check if workflows table has new columns
-- ==============================================================================

SELECT 
  'Workflows Columns' as check_name,
  COUNT(*) as new_columns_count,
  CASE 
    WHEN COUNT(*) >= 12 THEN '✅ PASS'
    ELSE '❌ FAIL - Missing columns'
  END as status
FROM information_schema.columns 
WHERE table_name = 'workflows' 
AND column_name IN (
  'category_id', 'tags', 'tool', 'difficulty', 
  'estimated_minutes', 'icon', 'meta_title', 'meta_description',
  'featured', 'usage_count', 'status', 'sort_order'
);

-- Show all new columns with their types
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'workflows' 
AND column_name IN (
  'category_id', 'tags', 'tool', 'difficulty', 
  'estimated_minutes', 'icon', 'meta_title', 'meta_description',
  'featured', 'usage_count', 'status', 'sort_order'
)
ORDER BY column_name;

-- ==============================================================================
-- 3. Check constraints
-- ==============================================================================

SELECT 
  'Constraints' as check_name,
  COUNT(*) as constraint_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS'
    ELSE '❌ FAIL - Missing constraints'
  END as status
FROM pg_constraint 
WHERE conname IN ('valid_tool', 'valid_difficulty', 'valid_status');

-- Show all constraints
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conname IN ('valid_tool', 'valid_difficulty', 'valid_status');

-- ==============================================================================
-- 4. Check indexes
-- ==============================================================================

SELECT 
  'Indexes' as check_name,
  COUNT(*) as index_count,
  CASE 
    WHEN COUNT(*) >= 8 THEN '✅ PASS'
    ELSE '❌ FAIL - Missing indexes'
  END as status
FROM pg_indexes 
WHERE tablename IN ('workflows', 'categories')
AND indexname LIKE 'idx_%';

-- Show all new indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('workflows', 'categories')
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ==============================================================================
-- 5. Check RLS policies
-- ==============================================================================

SELECT 
  'RLS Policies' as check_name,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN policyname IS NOT NULL THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status
FROM pg_policies 
WHERE tablename = 'categories';

-- ==============================================================================
-- 6. Sample workflow check (if any workflows exist)
-- ==============================================================================

SELECT 
  'Sample Workflow' as check_name,
  COUNT(*) as workflow_count,
  CASE 
    WHEN COUNT(*) > 0 THEN 'ℹ️ Workflows exist'
    ELSE 'ℹ️ No workflows (clean slate)'
  END as status
FROM public.workflows;

-- If workflows exist, show their extended fields
SELECT 
  id,
  title,
  category_id,
  tool,
  difficulty,
  estimated_minutes,
  icon,
  featured,
  usage_count,
  status,
  ARRAY_LENGTH(tags, 1) as tag_count
FROM public.workflows
LIMIT 5;

-- ==============================================================================
-- SUMMARY
-- ==============================================================================

SELECT 
  '=== MIGRATION 008 VERIFICATION SUMMARY ===' as summary;

SELECT 
  CASE 
    WHEN 
      (SELECT COUNT(*) FROM public.categories) = 6 AND
      (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'workflows' AND column_name IN ('category_id', 'tags', 'tool', 'difficulty', 'estimated_minutes', 'icon', 'meta_title', 'meta_description', 'featured', 'usage_count', 'status', 'sort_order')) >= 12 AND
      (SELECT COUNT(*) FROM pg_constraint WHERE conname IN ('valid_tool', 'valid_difficulty', 'valid_status')) >= 3
    THEN '✅ ALL CHECKS PASSED - Migration successful!'
    ELSE '❌ SOME CHECKS FAILED - Review output above'
  END as final_status;

