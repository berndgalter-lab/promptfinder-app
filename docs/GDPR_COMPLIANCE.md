# GDPR/DSGVO Compliance Documentation

## Overview

PromptFinder implements **Privacy by Design** to comply with:
- 🇪🇺 **GDPR** (General Data Protection Regulation - Europe)
- 🇺🇸 **CCPA** (California Consumer Privacy Act - USA)
- 🇧🇷 **LGPD** (Lei Geral de Proteção de Dados - Brazil)
- 🇨🇳 **PIPL** (Personal Information Protection Law - China)

---

## Data Storage Policy

### ✅ What We Store

| Data Type | Storage Location | Reason |
|-----------|------------------|--------|
| User ID | Supabase | Authentication |
| Workflow ID | Supabase | Usage tracking |
| Timestamp | Supabase | Usage statistics |
| **Select field values** | Supabase | Non-personal dropdown choices |
| Step progress (numbers) | localStorage | Session continuity |

### ❌ What We DO NOT Store

| Data Type | Why NOT Stored | User Impact |
|-----------|----------------|-------------|
| **Text input fields** | Could contain personal data | User must re-enter on return |
| **Textarea fields** | Could contain personal data | User must re-enter on return |
| **InputStep content** | Definitely personal (emails, notes) | Never persisted anywhere |
| Field values | Could be personal | User must re-enter on return |

---

## Implementation Details

### 1. WorkflowRunnerWrapper.tsx

**Location:** `components/workflow/WorkflowRunnerWrapper.tsx`

**What it does:**
- Filters `fieldValues` to ONLY include `select` type fields
- Completely ignores `text` and `textarea` fields
- Never stores `inputValues` (user-generated content)

**Code:**
```typescript
// ONLY store select fields - no text/textarea
workflow.steps.forEach(step => {
  if (step.type === 'prompt' && 'fields' in step) {
    const stepValues = data.fieldValues[step.number] || {};
    step.fields.forEach(field => {
      if (field.type === 'select' && stepValues[field.name]) {
        safeValues[field.name] = stepValues[field.name];
      }
    });
  }
});
```

### 2. WorkflowRunner.tsx - localStorage

**Location:** `components/workflow/WorkflowRunner.tsx`

**What it does:**
- Saves ONLY step progress (currentStep, completedSteps)
- Does NOT save fieldValues or inputValues
- Clears localStorage on workflow completion

**Save Logic:**
```typescript
const progressData = {
  currentStep,
  completedSteps: Array.from(completedSteps),
  // fieldValues NOT persisted
  // inputValues NOT persisted
};
localStorage.setItem(`workflow_progress_${workflow.slug}`, JSON.stringify(progressData));
```

**Load Logic:**
```typescript
// Only restore progress, NOT content
if (parsed.currentStep) setCurrentStep(parsed.currentStep);
if (parsed.completedSteps) setCompletedSteps(new Set(parsed.completedSteps));
// fieldValues and inputValues stay empty
```

**Cleanup on Completion:**
```typescript
localStorage.removeItem(`workflow_progress_${workflow.slug}`);
```

---

## Data Flow Diagram

```
USER INPUT
    ↓
┌─────────────────────────────────────┐
│ Browser RAM (React State)          │
│ - fieldValues (all types)          │
│ - inputValues (user content)       │
│ ✅ Temporary, session-only          │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ localStorage                        │
│ - currentStep (number)              │
│ - completedSteps (numbers)          │
│ ❌ NO fieldValues                   │
│ ❌ NO inputValues                   │
│ 🗑️ Cleared on completion            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Supabase Database                   │
│ - user_id (UUID)                    │
│ - workflow_id (UUID)                │
│ - timestamp                         │
│ - select values ONLY                │
│ ❌ NO text/textarea values          │
│ ❌ NO inputValues                   │
└─────────────────────────────────────┘
```

---

## User Experience Impact

### What Users Experience:

1. **During Workflow:**
   - All fields work normally
   - Data stays in browser memory
   - Can navigate back/forward freely

2. **Closing Browser Tab:**
   - Step progress is saved (which step they're on)
   - Field content is NOT saved
   - User must re-enter data if they return

3. **Completing Workflow:**
   - Usage is tracked (for statistics)
   - Only non-personal metadata stored
   - localStorage is cleared

4. **History Page:**
   - Shows which workflows were used and when
   - Shows select field choices (e.g., "Tone: Professional")
   - Does NOT show text/textarea content
   - Does NOT show InputStep content

### Why This is Better:

✅ **Privacy First:** No personal data at risk  
✅ **Compliance:** Meets global privacy regulations  
✅ **Transparency:** Users know their content isn't stored  
✅ **Security:** No data breach risk for user content  

---

## Testing Checklist

### Test 1: Single Mode Workflow
- [ ] Fill in text field with personal data (e.g., "John Smith")
- [ ] Fill in select field (e.g., "Professional")
- [ ] Click "Copy Prompt"
- [ ] Check Supabase `user_usage` table
- [ ] ✅ Should contain ONLY select value
- [ ] ❌ Should NOT contain text field value

### Test 2: Multi-Step with InputStep
- [ ] Complete Step 1 (prompt with fields)
- [ ] Complete Step 2 (input with meeting notes)
- [ ] Complete Step 3 (final prompt)
- [ ] Check Supabase `user_usage` table
- [ ] ✅ Should contain workflow_id and timestamp
- [ ] ❌ Should NOT contain meeting notes
- [ ] ❌ Should NOT contain text field values

### Test 3: localStorage Privacy
- [ ] Start a workflow
- [ ] Fill in some fields
- [ ] Close browser tab
- [ ] Open DevTools > Application > Local Storage
- [ ] Check `workflow_progress_*` entry
- [ ] ✅ Should contain currentStep (number)
- [ ] ✅ Should contain completedSteps (array)
- [ ] ❌ Should NOT contain fieldValues
- [ ] ❌ Should NOT contain inputValues

### Test 4: Workflow Completion Cleanup
- [ ] Complete a workflow
- [ ] Check localStorage
- [ ] ✅ Progress entry should be DELETED

### Test 5: History Page Display
- [ ] Complete a workflow with text and select fields
- [ ] Go to History page
- [ ] Check displayed values
- [ ] ✅ Should show select values
- [ ] ❌ Should NOT show text/textarea values

---

## Compliance Statements

### GDPR (Europe)
✅ **Article 5 (Data Minimization):** We only collect necessary metadata  
✅ **Article 25 (Privacy by Design):** System designed to avoid personal data  
✅ **Article 32 (Security):** No personal data stored = no breach risk  

### CCPA (California)
✅ **Section 1798.100:** Users know what data is collected  
✅ **Section 1798.105:** No personal data to delete  

### LGPD (Brazil)
✅ **Article 6:** Legitimate purpose (usage statistics)  
✅ **Article 46:** Privacy by design implemented  

### PIPL (China)
✅ **Article 51:** Minimal data collection  
✅ **Article 9:** User content not processed or stored  

---

## Developer Guidelines

### When Adding New Fields:

1. **Select Fields:** ✅ Safe to store
   ```typescript
   { type: 'select', options: ['Option A', 'Option B'] }
   ```

2. **Text Fields:** ❌ Do NOT store
   ```typescript
   { type: 'text' } // Will NOT be persisted
   ```

3. **Textarea Fields:** ❌ Do NOT store
   ```typescript
   { type: 'textarea' } // Will NOT be persisted
   ```

4. **InputSteps:** ❌ NEVER store
   ```typescript
   { type: 'input' } // Content NEVER persisted
   ```

### When Debugging:

Check console logs:
- `[GDPR-Safe] Usage tracked with safe values only: [...]`
- `[GDPR-Safe] Progress restored, but content fields reset for privacy`

---

## FAQ

**Q: Why don't we save field values for convenience?**  
A: User convenience < User privacy. We prioritize compliance and security.

**Q: What if a user wants to save their data?**  
A: They can copy the generated prompt (which contains their data) and save it locally.

**Q: Can we add an "opt-in" to save data?**  
A: Technically yes, but it adds complexity and legal risk. Current approach is safest.

**Q: What about anonymous users?**  
A: Same rules apply. We track usage count in localStorage, but no content.

**Q: Is this overkill?**  
A: No. Privacy regulations are strict and penalties are severe. Better safe than sorry.

---

## Last Updated

**Date:** 2024-11-28  
**Version:** 1.0  
**Reviewed by:** Development Team  

---

## Related Files

- `components/workflow/WorkflowRunnerWrapper.tsx` - Supabase storage logic
- `components/workflow/WorkflowRunner.tsx` - localStorage logic
- `lib/usage-tracking.ts` - Usage tracking utilities
- `app/history/page.tsx` - History display
- `components/history/HistoryItem.tsx` - History item display

---

**🔒 Privacy is not a feature, it's a requirement.**

