# 📝 Workflow Creation Cheat Sheet

## 🎯 Quick Reference für neue Workflows

Dieses Dokument zeigt dir **alle Felder** die du beim Erstellen eines Workflows ausfüllen kannst.

---

## 🗄️ Workflow Basis-Felder

### Pflichtfelder (REQUIRED)
```typescript
{
  id: "auto-generated-uuid",           // Automatisch von Supabase
  slug: "email-reply",                 // URL-freundlich, einzigartig
  title: "Quick Email Reply",          // Anzeige-Name
  description: "Generate a professional email reply", // Kurzbeschreibung
  workflow_type: "combined",           // "combined" oder "sequential"
  steps: [...],                        // Array von Step-Objekten
}
```

### Neue Felder (seit Migration 008)
```typescript
{
  // Organisation & Discovery
  category_id: 1,                      // FK zu categories Tabelle
  tags: ["email", "communication"],    // Array für Filterung
  icon: "📧",                          // Emoji für Cards
  
  // Schwierigkeit & Zeit
  difficulty: "beginner",              // "beginner" | "intermediate" | "advanced"
  estimated_minutes: 3,                // Zeitschätzung in Minuten
  
  // Tool & Platform
  tool: "chatgpt",                     // "chatgpt" | "claude" | "cursor" | "any"
  
  // SEO & Marketing
  meta_title: "Quick Email Reply Generator",           // SEO Titel
  meta_description: "Generate professional emails...", // SEO Description
  
  // Admin
  featured: false,                     // Auf Homepage highlighten?
  status: "published",                 // "draft" | "published"
  sort_order: 0,                       // Manuelle Reihenfolge
  usage_count: 0,                      // Auto-increment bei Nutzung
}
```

---

## 📋 Step Types & Ihre Felder

### 1️⃣ PromptStep (Formular mit Feldern)

**Wann verwenden?**
- User füllt Felder aus → Prompt wird generiert
- Standard für die meisten Workflows

```typescript
{
  number: 1,                           // Step-Nummer (auto)
  type: "prompt",                      // PFLICHT
  title: "Your Email Details",         // Wird NICHT mehr angezeigt (durch Section Label ersetzt)
  description: "Fill in the fields",   // Wird NICHT mehr angezeigt
  
  // PROMPT TEMPLATE - WICHTIG!
  prompt_template: `
Write a professional email reply to:

Email Context: {{email_context}}
Tone: {{tone}}
Key Points: {{key_points}}

Make it concise and friendly.
  `,
  
  // FELDER
  fields: [
    {
      name: "email_context",           // Variablen-Name (in {{  }})
      label: "What is this email about?", // User-sichtbares Label
      type: "textarea",                // "text" | "textarea" | "select"
      required: true,                  // Pflichtfeld?
      placeholder: "Paste the email or describe the context...",
      options: undefined               // Nur für type: "select"
    },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      required: true,
      placeholder: "Choose a tone",
      options: ["Professional", "Friendly", "Formal", "Casual"]
    },
    {
      name: "key_points",
      label: "Key Points to Address",
      type: "textarea",
      required: false,
      placeholder: "Optional: List main points...",
      options: undefined
    }
  ]
}
```

**💡 Prompt Template Variablen:**
- Verwende `{{field_name}}` um Feld-Werte einzufügen
- Name muss exakt mit `field.name` übereinstimmen
- Beispiel: `{{email_context}}` → wird durch User-Input ersetzt

---

### 2️⃣ InputStep (User fügt eigenen Content ein)

**Wann verwenden?**
- User soll Text/Code/Notizen einfügen
- Kein Formular, nur Freitext-Feld

```typescript
{
  number: 1,
  type: "input",                       // PFLICHT
  title: "Paste Your Notes",           // Anzeige-Titel
  description: "Paste your meeting notes below", // Anzeige-Text
  
  input_label: "Meeting Notes",        // Label über dem Textarea
  input_placeholder: "Paste your notes here...", // Placeholder
  input_description: "Tip: The messier the notes, the more helpful this tool is!", // 💡 BLAUER TIP!
  input_name: "meeting_notes"          // Variablen-Name für {{meeting_notes}}
}
```

**💡 Input Description = Blauer Tip:**
- Wird über dem Input-Feld angezeigt
- Blauer Kasten mit 💡
- Gibt Kontext-spezifische Hilfe

---

### 3️⃣ InstructionStep (Anleitung ohne Input)

**Wann verwenden?**
- Zwischen Steps Anweisungen geben
- "Jetzt kopiere X und füge in Y ein"
- Keine User-Eingabe nötig

```typescript
{
  number: 2,
  type: "instruction",                 // PFLICHT
  title: "Next: Open ChatGPT",         // Anzeige-Titel
  description: "Follow these steps",   // Anzeige-Text
  
  instruction_text: `
1. Copy the prompt above
2. Open ChatGPT in a new tab
3. Paste and hit Enter
4. Review and refine the result
  `,
  instruction_icon: "arrow-right"      // Optional: "clipboard" | "arrow-right" | "check" | "info" | "paste" | "send"
}
```

---

## 🎨 Field Types im Detail

### Text Input
```typescript
{
  type: "text",
  name: "company_name",
  label: "Company Name",
  required: true,
  placeholder: "e.g. Acme Corp"
}
```
**Gut für:** Namen, kurze Texte, URLs

---

### Textarea
```typescript
{
  type: "textarea",
  name: "project_description",
  label: "Project Description",
  required: true,
  placeholder: "Describe your project in detail..."
}
```
**Gut für:** Längere Texte, Kontext, Notizen, Code

---

### Select Dropdown
```typescript
{
  type: "select",
  name: "industry",
  label: "Industry",
  required: true,
  placeholder: "Select your industry",
  options: [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail"
  ]
}
```
**Gut für:** Vordefinierte Optionen, Tone, Style, Kategorien

---

## 🏷️ Categories (Referenz)

```sql
SELECT * FROM categories;
```

| ID | slug | name | icon |
|----|------|------|------|
| 1 | writing | Writing | ✍️ |
| 2 | marketing | Marketing | 📣 |
| 3 | business | Business | 💼 |
| 4 | productivity | Productivity | ⚡ |
| 5 | career | Career | 🎯 |
| 6 | development | Development | 💻 |

---

## 🎯 Tool Options

```typescript
tool: "chatgpt"  // Zeigt: "Pro tip: After pasting in ChatGPT..."
tool: "claude"   // Zeigt: "Pro tip: Paste in Claude and press Enter..."
tool: "cursor"   // Zeigt: "Pro tip: Use Cmd+K in Cursor..."
tool: "any"      // Zeigt: "Pro tip: Paste your prompt in any AI..."
```

---

## 📊 Difficulty Levels

```typescript
difficulty: "beginner"      // Grüner Badge, "Beginner friendly"
difficulty: "intermediate"  // Gelber Badge, "Some experience"
difficulty: "advanced"      // Roter Badge, "Advanced"
```

---

## 📝 Workflow Type

```typescript
workflow_type: "combined"    // Ein-Schritt, alles auf einer Seite
workflow_type: "sequential"  // Multi-Step, mit Navigation
```

**Empfehlung:** Nutze `"combined"` für einfache Workflows

---

## ✅ Workflow Creation Checklist

### Basis
- [ ] `slug` ist URL-freundlich und einzigartig
- [ ] `title` ist klar und beschreibend
- [ ] `description` erklärt den Nutzen in 1 Satz
- [ ] `category_id` ist gesetzt
- [ ] `icon` ist ein passendes Emoji

### Discovery & UX
- [ ] `tags` sind relevant (3-5 Tags)
- [ ] `difficulty` ist realistisch eingeschätzt
- [ ] `estimated_minutes` ist getestet
- [ ] `tool` ist passend gewählt

### Steps
- [ ] Mindestens 1 Step vorhanden
- [ ] `prompt_template` verwendet korrekte `{{variablen}}`
- [ ] Alle `field.name` matchen Template-Variablen
- [ ] `required` Felder sind sinnvoll gesetzt
- [ ] `placeholder` gibt hilfreiche Beispiele

### Optional aber empfohlen
- [ ] `input_description` gibt Kontext-Hilfe
- [ ] `meta_title` ist SEO-optimiert
- [ ] `meta_description` enthält Keywords
- [ ] `status: "published"` vor Go-Live

---

## 🚀 Workflow Template (Copy & Paste)

```typescript
{
  // Basis
  slug: "my-new-workflow",
  title: "My Awesome Workflow",
  description: "One-sentence description of what this does",
  workflow_type: "combined",
  
  // Discovery
  category_id: 1,  // Writing
  tags: ["email", "business", "communication"],
  icon: "📧",
  
  // UX
  difficulty: "beginner",
  estimated_minutes: 3,
  tool: "chatgpt",
  
  // SEO (optional)
  meta_title: "My Awesome Workflow - PromptFinder",
  meta_description: "Generate X using AI in seconds. Perfect for Y.",
  
  // Admin
  status: "published",
  featured: false,
  sort_order: 0,
  
  // Steps
  steps: [
    {
      number: 1,
      type: "prompt",
      title: "Step Title",
      description: "Step description",
      prompt_template: `
Your AI prompt here.

Use {{variable_name}} for user inputs.

Be specific and clear.
      `,
      fields: [
        {
          name: "variable_name",
          label: "User-friendly Label",
          type: "textarea",
          required: true,
          placeholder: "Helpful example..."
        }
      ]
    }
  ]
}
```

---

## 💡 Pro Tips für Workflow-Erstellung

### 1. Prompt Templates
- ✅ Sei spezifisch: "Write a professional email" > "Write email"
- ✅ Gib Kontext: "Reply to a customer complaint" statt nur "Reply"
- ✅ Formatiere: Nutze Absätze und Struktur
- ✅ Teste: Probiere Template in ChatGPT aus

### 2. Field Labels
- ✅ Frage stellen: "What is this email about?" > "Email Context"
- ✅ Sei hilfreich: "Your company's unique value prop" > "Value Prop"
- ✅ Vermeide Jargon: "Who will read this?" > "Target Audience"

### 3. Placeholders
- ✅ Gib Beispiele: "e.g. Acme Corp" statt "Enter company name"
- ✅ Zeige Format: "John Smith, Sarah Johnson" statt "Names"
- ✅ Sei konkret: "Paste the full email thread" > "Email text"

### 4. Required Fields
- ✅ Nur wirklich nötige Felder als `required: true`
- ✅ Optional fields für Feintuning
- ✅ Min. 1-2 Felder, max. 5-6 Felder

### 5. Input Descriptions (Blauer Tip)
- ✅ Gib Kontext: "The more detail, the better the result"
- ✅ Ermutige: "Don't worry about formatting - we'll handle it!"
- ✅ Sei positiv: "Tip: X works great!" > "Warning: Don't forget X"

---

## 🔗 Verwandte Dateien

- **Types:** `lib/types/workflow.ts`
- **Constants:** `lib/constants/categories.ts`
- **Migration:** `supabase/migrations/008_categories_and_workflow_extensions.sql`
- **Components:**
  - `components/workflow/steps/PromptStep.tsx`
  - `components/workflow/steps/InputStep.tsx`
  - `components/workflow/steps/InstructionStep.tsx`
  - `components/workflow/HowItWorksBox.tsx`
  - `components/workflow/ProTip.tsx`

---

## 📞 Testing Checklist

Bevor du einen Workflow veröffentlichst:

- [ ] Alle Felder ausfüllen und Prompt generieren
- [ ] Prompt in ChatGPT/Claude testen
- [ ] Mobile-Ansicht checken
- [ ] Typos prüfen
- [ ] Placeholder sind hilfreich
- [ ] Estimated time ist realistisch
- [ ] Tags sind relevant
- [ ] Category ist korrekt

---

**Letzte Aktualisierung:** 2024-11-30  
**Version:** 1.0 (nach Migration 008)

---

## 🎯 Quick Commands

### Workflow in Supabase erstellen:
```sql
INSERT INTO workflows (slug, title, description, category_id, tool, difficulty, estimated_minutes, icon, tags, workflow_type, status, steps)
VALUES (
  'email-reply',
  'Quick Email Reply',
  'Generate professional email replies',
  1, -- Writing category
  'chatgpt',
  'beginner',
  3,
  '📧',
  ARRAY['email', 'communication', 'business'],
  'combined',
  'published',
  '[{"number": 1, "type": "prompt", "title": "Email Details", ...}]'::jsonb
);
```

### Workflow updaten:
```sql
UPDATE workflows
SET 
  difficulty = 'intermediate',
  estimated_minutes = 5,
  tool = 'claude'
WHERE slug = 'email-reply';
```

---

**Drucke dieses Cheat Sheet aus oder speichere es als Bookmark!** 📌

