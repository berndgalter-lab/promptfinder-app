# 🎨 Workflow Field Visual Guide

## Was User sehen vs. was du ausfüllst

---

## 📍 WORKFLOW-SEITE HEADER

```
┌────────────────────────────────────────────────────┐
│ ✍️ Writing                         [★ Favorite]   │  ← category_id + icon
│                                                    │
│ Quick Email Reply                                  │  ← title
│ Generate professional email replies in seconds     │  ← description
└────────────────────────────────────────────────────┘
```

**Du füllst aus:**
- `title` → Zeile 3
- `description` → Zeile 4
- `category_id` → Badge "✍️ Writing"
- `icon` → Auf Cards in Übersicht

---

## 📦 HOW IT WORKS BOX

```
┌────────────────────────────────────────────────────┐
│ HOW THIS WORKS                              [×]    │
│                                                    │
│  📝 Fill in  →  📋 Copy  →  ✨ Get result         │
│   Your details  Your prompt  From ChatGPT         │  ← tool
│                                                    │
│ ⏱️ ~3 min · 🎯 Beginner · 🤖 Works with ChatGPT  │
│    ↑            ↑                    ↑             │
│    estimated_   difficulty           tool          │
│    minutes                                         │
└────────────────────────────────────────────────────┘
```

**Du füllst aus:**
- `estimated_minutes` → "~3 min"
- `difficulty` → "🎯 Beginner"
- `tool` → "From ChatGPT" + "Works with ChatGPT"

---

## ① YOUR DETAILS (PromptStep Fields)

```
┌────────────────────────────────────────────────────┐
│ ① Your Details                                     │
│   Fill in the fields to personalize your prompt    │  ← Auto-Text
│                                                    │
│ What is this email about? *                        │  ← field.label + required
│ ┌────────────────────────────────────────────────┐ │
│ │ Paste the email or describe the context...    │ │  ← field.placeholder
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Tone                                               │  ← field.label
│ ┌────────────────────────────────────────────────┐ │
│ │ Professional              ▼                    │ │  ← field.type="select"
│ └────────────────────────────────────────────────┘ │
│   • Professional                                   │  ← field.options
│   • Friendly                                       │
│   • Formal                                         │
└────────────────────────────────────────────────────┘
```

**Du füllst aus:**
```typescript
fields: [
  {
    name: "email_context",
    label: "What is this email about?",    // ← User sieht das
    type: "textarea",                      // ← Bestimmt Input-Typ
    required: true,                        // ← Zeigt *
    placeholder: "Paste the email...",     // ← Hilfe-Text im Feld
  },
  {
    name: "tone",
    label: "Tone",
    type: "select",
    required: true,
    options: ["Professional", "Friendly", "Formal"]  // ← Dropdown-Optionen
  }
]
```

---

## 💡 INPUT DESCRIPTION TIP (Blau, bei InputStep)

```
┌────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────┐ │
│ │ 💡 Tip: The messier the notes, the more       │ │  ← input_description
│ │    helpful this tool is!                      │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Meeting Notes                                      │  ← input_label
│ ┌────────────────────────────────────────────────┐ │
│ │ Paste your notes here...                      │ │  ← input_placeholder
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Du füllst aus:**
```typescript
{
  type: "input",
  input_label: "Meeting Notes",
  input_placeholder: "Paste your notes here...",
  input_description: "Tip: The messier the notes, the more helpful this tool is!"  // ← BLAUER TIP
}
```

---

## ② YOUR PROMPT (Output)

```
┌────────────────────────────────────────────────────┐
│ ② Your Prompt                                      │
│ ✨ Your personalized prompt is ready!              │  ← Auto (wenn Felder ausgefüllt)
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ Write a professional email reply...            │ │  ← prompt_template
│ │                                                │ │     (mit Variablen ersetzt)
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ [Copy to Clipboard]  [Open ChatGPT]               │  ← Auto (tool-basiert)
│                        ↑                           │
│                    tool="chatgpt" → "Open ChatGPT" │
│                    tool="claude" → "Open Claude"   │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ 💡 Pro tip: After pasting in ChatGPT, just    │ │  ← Auto (tool-basiert)
│ │    hit Enter to get your result instantly.    │ │
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Du füllst aus:**
```typescript
{
  prompt_template: `
Write a professional email reply to:

Context: {{email_context}}
Tone: {{tone}}

Make it concise and friendly.
  `
}
```

**Auto-generiert:**
- "Copy to Clipboard" Button
- "Open ChatGPT" Button (basierend auf `tool`)
- Pro Tip (basierend auf `tool`)

---

## 🎯 WELCHE FELDER SIND AUTO vs. MANUAL?

| Feld | Type | Du füllst aus | User sieht |
|------|------|---------------|------------|
| **title** | Manual | ✅ | ✅ Als H1 |
| **description** | Manual | ✅ | ✅ Unter Titel |
| **category_id** | Manual | ✅ | ✅ Als Badge (z.B. "✍️ Writing") |
| **icon** | Manual | ✅ | ✅ Auf Cards |
| **estimated_minutes** | Manual | ✅ | ✅ "~3 min" |
| **difficulty** | Manual | ✅ | ✅ "🎯 Beginner" |
| **tool** | Manual | ✅ | ✅ "ChatGPT" + Button Labels + Pro Tip |
| **tags** | Manual | ✅ | ❌ (noch nicht, für Filter) |
| **field.label** | Manual | ✅ | ✅ Über Input |
| **field.placeholder** | Manual | ✅ | ✅ Im Input (grau) |
| **input_description** | Manual | ✅ | ✅ Blauer Tip |
| **prompt_template** | Manual | ✅ | ✅ Nach Variablen-Ersetzung |
| **Section Labels** | Auto | ❌ | ✅ "① Your Details", "② Your Prompt" |
| **PromptReadyBanner** | Auto | ❌ | ✅ "✨ Your prompt is ready!" |
| **Pro Tip** | Auto | ❌ | ✅ Basierend auf `tool` |
| **Button Labels** | Auto | ❌ | ✅ Basierend auf `tool` |

---

## 📚 ZWEI ARTEN VON TIPS:

### 1. 🔵 Input Description (Manual, Workflow-specific)
```typescript
// Du schreibst:
input_description: "Tip: The messier the notes, the more helpful this tool is!"

// User sieht (BLAU):
┌────────────────────────────────────────────┐
│ 💡 Tip: The messier the notes, the more   │
│    helpful this tool is!                  │
└────────────────────────────────────────────┘
```

**Wann:** Bei InputStep, über dem Textarea  
**Zweck:** Hilft beim Ausfüllen  
**Farbe:** Blau (bg-blue-500/10)

---

### 2. 🟡 Pro Tip (Auto, Tool-based)
```typescript
// Du setzt nur:
tool: "chatgpt"

// User sieht automatisch (AMBER):
┌────────────────────────────────────────────┐
│ 💡 Pro tip: After pasting in ChatGPT,     │
│    just hit Enter to get your result.     │
└────────────────────────────────────────────┘
```

**Wann:** Nach Copy/ChatGPT Buttons  
**Zweck:** Hilft beim Verwenden  
**Farbe:** Amber (bg-amber-500/10)  
**4 Varianten:** chatgpt, claude, cursor, any

---

## ✅ QUICK CHECKLIST

Beim Erstellen eines Workflows, denke an:

- [ ] `title` - Klar und prägnant
- [ ] `description` - Ein Satz, erklärt Nutzen
- [ ] `category_id` - Richtige Kategorie wählen
- [ ] `icon` - Passendes Emoji
- [ ] `estimated_minutes` - Realistisch testen
- [ ] `difficulty` - Ehrlich einschätzen
- [ ] `tool` - Bestes Tool für den Use Case
- [ ] `tags` - 3-5 relevante Tags
- [ ] `field.label` - Als Frage formulieren
- [ ] `field.placeholder` - Beispiel geben
- [ ] `input_description` - Kontexthilfe (bei InputStep)
- [ ] `prompt_template` - Testen in ChatGPT!

---

## 🎓 LERN-RESOURCEN

- **Cheat Sheet:** `docs/WORKFLOW_CREATION_CHEAT_SHEET.md`
- **Template:** `docs/WORKFLOW_TEMPLATE.ts`
- **Types:** `lib/types/workflow.ts`
- **Constants:** `lib/constants/categories.ts`
- **Beispiel:** Siehe bestehende Workflows in Supabase

---

**Drucke diese Seite aus für schnelle Referenz beim Erstellen!** 📌

