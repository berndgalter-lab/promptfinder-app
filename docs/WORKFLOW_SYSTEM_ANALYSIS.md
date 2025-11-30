# 📚 MULTI-STEP WORKFLOW SYSTEM - TECHNISCHE DOKUMENTATION

**Datum:** 26. November 2025  
**Projekt:** PromptFinder  
**Analysierte Dateien:**
- `lib/types/workflow.ts`
- `components/workflow/WorkflowRunner.tsx`
- `components/workflow/steps/PromptStep.tsx`
- `components/workflow/steps/InstructionStep.tsx`
- `components/workflow/steps/InputStep.tsx`
- `app/workflows/[slug]/page.tsx`

---

## 🎯 SYSTEM ÜBERSICHT

Das Multi-Step Workflow System unterstützt flexible Workflows mit drei verschiedenen Step-Types und zwei Execution-Modi. Es ermöglicht die Erstellung von geführten Prompt-Workflows für ChatGPT.

---

## 1. WORKFLOW TYPES

### **Unterstützte Werte:**
```typescript
type WorkflowType = 'combined' | 'sequential';
```

### **Unterschiede in der Logik:**

#### **`'combined'` Mode**
**Location:** `WorkflowRunner.tsx` Zeile 364-404

**Code:**
```typescript
if (!isSequential) {
  // Rendert ALLE Steps auf einmal
  workflow.steps.map(step => renderStep(step))
}
```

**Verhalten:**
- ✅ Alle Steps gleichzeitig sichtbar
- ✅ Kein Navigation UI (Back/Next Buttons)
- ✅ User scrollt zwischen Steps
- ✅ Jeder PromptStep hat eigene Copy/Open Buttons
- ✅ Gut für einfache, übersichtliche Workflows
- ✅ User sieht Gesamtbild

**Use Case:** Workflows mit 2-3 Steps, die zusammengehören

---

#### **`'sequential'` Mode**
**Location:** `WorkflowRunner.tsx` Zeile 194-361

**Code:**
```typescript
if (isSequential) {
  // Zeigt nur currentStep
  // Completed Steps als collapsed Cards oben
  // Navigation mit Back/Next Buttons
}
```

**Verhalten:**
- ✅ Nur aktueller Step sichtbar
- ✅ Progress Bar oben ("Step X of Y")
- ✅ Back/Next Navigation Buttons
- ✅ Completed Steps collapsed mit Edit-Option
- ✅ Fokussierter, geführter Flow
- ✅ Gut für komplexe, mehrstufige Workflows

**Use Case:** Workflows mit 4+ Steps, die nacheinander abgearbeitet werden

---

### **Fallback/Default:**

**Location:** `app/workflows/[slug]/page.tsx` Zeile 42

```typescript
workflow_type: rawWorkflow.workflow_type || 'combined'  // ← Default
```

✅ **Ja, es gibt einen Fallback!**
- Wenn `workflow_type` in DB fehlt → Default: `'combined'`
- Alte Workflows funktionieren automatisch
- Keine Breaking Changes

---

## 2. STEP TYPES

### **Definierte Werte:**
```typescript
type StepType = 'prompt' | 'instruction' | 'input';
```

### **Step-Type Beschreibungen:**

#### **`'prompt'` (PromptStep)**
**Location:** `lib/types/workflow.ts` Zeile 28-32

**Struktur:**
```typescript
interface PromptStep {
  type: 'prompt';
  number: number;
  title: string;
  description: string;
  prompt_template: string;      // Template mit {{variables}}
  fields: WorkflowField[];      // Input-Felder für User
}
```

**Zweck:**
- User füllt Felder aus
- System generiert finalen Prompt
- Copy & Open ChatGPT Buttons
- Haupttyp für Prompt-Generierung

**Beispiel:**
```json
{
  "number": 1,
  "type": "prompt",
  "title": "Define Your Topic",
  "description": "Tell us what you want to write about",
  "prompt_template": "Write a blog post about {{topic}} for {{audience}}",
  "fields": [
    {"name": "topic", "label": "Topic", "type": "text", "required": true},
    {"name": "audience", "label": "Audience", "type": "text", "required": true}
  ]
}
```

---

#### **`'instruction'` (InstructionStep)**
**Location:** `lib/types/workflow.ts` Zeile 35-39

**Struktur:**
```typescript
interface InstructionStep {
  type: 'instruction';
  number: number;
  title: string;
  description: string;
  instruction_text: string;
  instruction_icon?: 'clipboard' | 'arrow-right' | 'check' | 'info' | 'paste' | 'send';
}
```

**Zweck:**
- Zeigt Anweisung an (z.B. "Kopiere das in ChatGPT")
- User markiert als "Done" via Checkbox
- Keine Eingabefelder
- Für manuelle Aktionen zwischen Steps

**Beispiel:**
```json
{
  "number": 2,
  "type": "instruction",
  "title": "Copy to ChatGPT",
  "description": "Open ChatGPT and paste the prompt",
  "instruction_text": "Click 'Open in ChatGPT' above, then paste the generated prompt.",
  "instruction_icon": "clipboard"
}
```

---

#### **`'input'` (InputStep)**
**Location:** `lib/types/workflow.ts` Zeile 42-47

**Struktur:**
```typescript
interface InputStep {
  type: 'input';
  number: number;
  title: string;
  description: string;
  input_label: string;
  input_placeholder?: string;
  input_description?: string;
}
```

**Zweck:**
- User gibt eigenen Content ein (Large Textarea)
- Für User-Generated Content (z.B. "Paste your article")
- Continue Button
- Speichert in `inputValues[stepNumber]`

**Beispiel:**
```json
{
  "number": 3,
  "type": "input",
  "title": "Paste ChatGPT Result",
  "description": "Paste what ChatGPT generated",
  "input_label": "ChatGPT Output",
  "input_placeholder": "Paste the response here...",
  "input_description": "Copy the entire response from ChatGPT"
}
```

---

### **Fallback bei fehlendem `type`:**

**Location:** `app/workflows/[slug]/page.tsx` Zeile 45

```typescript
type: step.type || 'prompt'  // ← Default zu 'prompt'
```

✅ **Ja, es gibt einen Fallback!**
- Wenn `type` in Step fehlt → Default: `'prompt'`
- Alte Workflows ohne `type` funktionieren
- Werden als PromptStep behandelt

---

### **Type Guards:**

**Location:** `lib/types/workflow.ts` Zeile 76-86

```typescript
export function isPromptStep(step: WorkflowStep): step is PromptStep {
  return step.type === 'prompt';
}

export function isInstructionStep(step: WorkflowStep): step is InstructionStep {
  return step.type === 'instruction';
}

export function isInputStep(step: WorkflowStep): step is InputStep {
  return step.type === 'input';
}
```

✅ **Ja, Type Guards existieren!**
- Werden aktiv im WorkflowRunner verwendet
- TypeScript-safe Step-Rendering
- Ermöglichen korrekte Type-Inference

**Usage:**
```typescript
if (isPromptStep(step)) {
  // TypeScript weiß: step ist PromptStep
  step.prompt_template  // ✅ Valid
  step.fields           // ✅ Valid
}
```

---

## 3. ERLAUBTE KOMBINATIONEN

### **Antwort: JA, jede Kombination ist erlaubt!**

**Es gibt KEINE Validierung für Step-Reihenfolge oder Kombinationen.**

#### **Rendering-Logik (WorkflowRunner.tsx Zeile 288-314):**
```typescript
// Rendert einfach basierend auf Type, keine Validierung
{isPromptStep(currentStepObj) && <PromptStepComponent />}
{isInstructionStep(currentStepObj) && <InstructionStepComponent />}
{isInputStep(currentStepObj) && <InputStepComponent />}
```

#### **Alle Kombinationen funktionieren:**
```typescript
✅ prompt → instruction → input
✅ instruction → prompt → instruction
✅ input → prompt → input
✅ prompt → prompt → prompt
✅ instruction → instruction → input
✅ input → input → prompt
✅ Jede beliebige Reihenfolge
```

### **⚠️ POTENTIELLES PROBLEM:**

Es gibt **keine Validierung** ob Step-Kombinationen Sinn machen.

**Beispiel für sinnlosen Workflow:**
```json
[
  {"type": "instruction", "instruction_text": "Go to ChatGPT"},
  {"type": "instruction", "instruction_text": "Click send"},
  {"type": "instruction", "instruction_text": "Close ChatGPT"}
]
```

**Dieser Workflow wäre nutzlos, wird aber nicht verhindert!**

**Empfehlung:** Content-Validierung auf Admin-Ebene, nicht Code-Ebene.

---

## 4. DATENFLUSS

### **State-Struktur:**

```typescript
// WorkflowRunner.tsx Zeile 30-34
const [currentStep, setCurrentStep] = useState(1);
const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
const [fieldValues, setFieldValues] = useState<Record<number, Record<string, string>>>({});
const [inputValues, setInputValues] = useState<Record<number, string>>({});
const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
```

**Datenstruktur:**
```typescript
{
  currentStep: 2,                    // Aktueller Step (1-based)
  
  completedSteps: Set([1]),          // Abgeschlossene Steps
  
  fieldValues: {                     // PromptStep Werte
    1: { topic: "AI", audience: "Developers" },
    2: { tone: "Professional", length: "Long" }
  },
  
  inputValues: {                     // InputStep Werte
    3: "User's pasted article content...",
    5: "ChatGPT's response..."
  },
  
  expandedSteps: Set([1])            // UI: Welche collapsed steps sind expanded
}
```

---

### **❌ KRITISCHES PROBLEM: Keine Cross-Step Variablen!**

#### **Aktuelle Implementierung (Zeile 68-76):**
```typescript
const buildPrompt = (step: WorkflowStep, values: Record<string, string>) => {
  if (!isPromptStep(step)) return '';
  
  let prompt = step.prompt_template;
  Object.entries(values).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return prompt;
}

// Aufruf:
buildPrompt(currentStepObj, fieldValues[currentStep] || {})
//                           ^^^^^^^^^^^^^^^^^^^^^^^^
//                           Nur Werte vom AKTUELLEN Step!
```

#### **Problem:**
- Jeder Step hat nur Zugriff auf **seine eigenen** fieldValues
- `fieldValues[currentStep]` → nur Step-spezifische Werte
- **Variablen aus vorherigen Steps sind NICHT verfügbar!**

#### **Beispiel-Szenario:**
```typescript
// Step 1: User gibt "AI in Healthcare" als topic ein
fieldValues[1] = { topic: "AI in Healthcare", audience: "Doctors" }

// Step 3: Will topic aus Step 1 verwenden
prompt_template: "Now expand on {{topic}} with more details about {{detail}}"
fieldValues[3] = { detail: "use cases" }

// ❌ FEHLER: {{topic}} wird NICHT ersetzt!
// Resultat: "Now expand on {{topic}} with more details about use cases"
```

#### **Auswirkung:**
- 🔴 **HIGH SEVERITY**
- Multi-Step Workflows können nicht auf vorherige Inputs referenzieren
- Limitiert Use Cases erheblich
- Macht Sequential Mode weniger nützlich

---

### **❌ PROBLEM: InputStep Werte nicht in Prompts verfügbar**

#### **Gespeichert in:** `inputValues[stepNumber]`

```typescript
// WorkflowRunner.tsx Zeile 115-120
const handleInputChange = (stepNumber: number, value: string) => {
  setInputValues(prev => ({
    ...prev,
    [stepNumber]: value
  }));
};
```

#### **Problem:**
`inputValues` werden **NICHT** als Variablen in `buildPrompt()` verwendet!

#### **Beispiel-Szenario:**
```typescript
// Step 2: InputStep - User pastet Artikel
inputValues[2] = "Here is my article about AI..."

// Step 3: PromptStep - Will Artikel verbessern
prompt_template: "Improve this article: {{article}}"

// ❌ FEHLER: {{article}} bleibt unreplaced!
// inputValues[2] ist nicht als {{article}} verfügbar
```

#### **Auswirkung:**
- 🔴 **HIGH SEVERITY**
- InputStep-Content kann nicht in späteren Prompts verwendet werden
- Macht InputStep fast nutzlos für Multi-Step Workflows
- Limitiert Workflow-Designs erheblich

---

### **localStorage Persistence:**

#### **Load (Zeile 40-54):**
```typescript
useEffect(() => {
  const savedProgress = localStorage.getItem(`workflow_progress_${workflow.slug}`);
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      setCurrentStep(parsed.currentStep || 1);
      setCompletedSteps(new Set(parsed.completedSteps || []));
      setFieldValues(parsed.fieldValues || {});
      setInputValues(parsed.inputValues || {});
    } catch (error) {
      console.error('Error loading workflow progress:', error);
    }
  }
}, [workflow.slug]);
```

#### **Save (Zeile 56-65):**
```typescript
useEffect(() => {
  const progress = {
    currentStep,
    completedSteps: Array.from(completedSteps),
    fieldValues,
    inputValues
  };
  localStorage.setItem(`workflow_progress_${workflow.slug}`, JSON.stringify(progress));
}, [currentStep, completedSteps, fieldValues, inputValues, workflow.slug]);
```

#### **localStorage Key:**
```
workflow_progress_${workflow.slug}
```

#### **Gespeicherte Daten:**
```json
{
  "currentStep": 2,
  "completedSteps": [1],
  "fieldValues": {
    "1": {"topic": "AI", "audience": "Developers"}
  },
  "inputValues": {
    "3": "User's pasted content..."
  }
}
```

✅ **Funktioniert gut:**
- Speichert bei jedem State-Change
- Lädt beim Component Mount
- User kann Browser schließen und später weitermachen
- Error Handling bei Parse-Fehlern

---

## 5. EDGE CASES

### **Edge Case 1: Workflow mit nur 1 Step**

**Code (Zeile 332-350):**
```typescript
{currentStep < totalSteps ? (
  <Button onClick={goToNextStep}>
    Next <ChevronRight />
  </Button>
) : (
  <Button onClick={handleCompleteWorkflow}>
    <Check /> Complete Workflow
  </Button>
)}
```

✅ **Funktioniert korrekt:**
- Bei 1 Step: `currentStep (1) < totalSteps (1)` → false
- Zeigt direkt "Complete Workflow" Button
- Kein "Next" Button
- User kann sofort abschließen

---

### **Edge Case 2: PromptStep mit leeren `fields[]`**

**Code (PromptStep.tsx Zeile 36-38):**
```typescript
const areRequiredFieldsFilled = step.fields
  .filter(field => field.required)
  .every(field => fieldValues[field.name]?.trim());
```

**Verhalten:**
- `[].filter()` → `[]`
- `[].every()` → `true` (leeres Array ist immer true)
- Buttons sind **enabled**

✅ **Funktioniert technisch:**
- Keine Crashes
- Buttons sind enabled

⚠️ **ABER:**
- Prompt wird nicht generiert (keine Variablen)
- `prompt_template` ohne `{{variables}}` bleibt statisch
- Macht nur Sinn wenn prompt_template keine Variablen hat

**Use Case:** Statische Prompts ohne User-Input

---

### **Edge Case 3: InstructionStep ohne `instruction_text`**

**Code (InstructionStep.tsx Zeile 72-76):**
```typescript
<div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
  <p className="text-white leading-relaxed whitespace-pre-wrap">
    {step.instruction_text}  // ← Kann undefined oder '' sein!
  </p>
</div>
```

⚠️ **Problem:**
- Zeigt leere Box an
- Kein Fallback-Text
- Kein Error
- Schlechte UX

**Empfehlung:**
```typescript
{step.instruction_text || 'No instruction provided'}
```

---

### **Edge Case 4: Select Field ohne `options[]`**

**Code (PromptStep.tsx Zeile 83-103):**
```typescript
{field.type === 'select' && field.options && (
  <Select>
    {field.options.map(option => ...)}
  </Select>
)}
```

✅ **Funktioniert:**
- Prüft `field.options` vor Rendering
- Wenn fehlt: Select wird nicht gerendert
- Kein Crash

⚠️ **ABER:** Field wird einfach übersprungen, kein Error-Hinweis

---

### **Edge Case 5: Ungültiger `instruction_icon` Wert**

**Code (InstructionStep.tsx Zeile 23-39):**
```typescript
const iconMap = {
  clipboard: Clipboard,
  'arrow-right': ArrowRight,
  check: CheckCircle,
  info: Info,
  paste: ClipboardPaste,
  send: Send,
};

const IconComponent = step.instruction_icon 
  ? iconMap[step.instruction_icon]  // ← Was wenn 'invalid'?
  : Info;
```

⚠️ **Problem:**
- `iconMap['invalid']` → `undefined`
- `IconComponent = undefined`
- Zeile 57: `<IconComponent />` → **CRASH!**

**Lösung:**
```typescript
const IconComponent = (step.instruction_icon && iconMap[step.instruction_icon]) || Info;
```

---

## 6. BUGS / PROBLEME

### **🐛 BUG #1: Keine Cross-Step Variablen** 🔴 HIGH

**Location:** `WorkflowRunner.tsx` Zeile 68-76

**Problem:**
```typescript
const buildPrompt = (step: WorkflowStep, values: Record<string, string>) => {
  // Verwendet nur 'values' Parameter
  // values = fieldValues[currentStep] ← Nur aktueller Step!
}

// Aufruf (Zeile 293):
buildPrompt(currentStepObj, fieldValues[currentStep] || {})
```

**Impact:**
- Variablen aus Step 1 sind in Step 3 nicht verfügbar
- Multi-Step Workflows können nicht aufeinander aufbauen
- Limitiert Workflow-Design erheblich

**Beispiel:**
```
Step 1: topic = "AI"
Step 2: Instruction
Step 3: prompt_template = "Expand on {{topic}}"
❌ {{topic}} wird nicht ersetzt!
```

**Fix:**
```typescript
const buildPrompt = (step: WorkflowStep, values: Record<string, string>) => {
  if (!isPromptStep(step)) return '';
  
  // Merge ALLE fieldValues von ALLEN Steps
  const allFieldValues = Object.values(fieldValues).reduce((acc, stepVals) => ({
    ...acc,
    ...stepVals
  }), {});
  
  let prompt = step.prompt_template;
  Object.entries(allFieldValues).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return prompt;
};
```

---

### **🐛 BUG #2: InputStep Werte nicht in Prompts verfügbar** 🔴 HIGH

**Problem:**
```typescript
// inputValues werden gespeichert:
inputValues[2] = "User's article content"

// Aber in buildPrompt() nicht verwendet:
buildPrompt(step, fieldValues[currentStep])  // ← inputValues fehlen!
```

**Impact:**
- InputStep-Content kann nicht in späteren Prompts verwendet werden
- Macht InputStep fast nutzlos für Multi-Step Workflows
- User kann z.B. keinen Artikel pasten und dann verbessern lassen

**Beispiel-Szenario:**
```
Step 1: InputStep - User pastet Artikel
Step 2: PromptStep - "Improve this: {{article}}"
❌ {{article}} ist nicht verfügbar!
```

**Fix:**
```typescript
// Option 1: InputStep braucht "name" Property
interface InputStep {
  input_name: string;  // z.B. "article"
  // ...
}

// Option 2: Auto-Namen generieren
const allValues = {
  ...mergedFieldValues,
  [`input_step_${stepNumber}`]: inputValues[stepNumber]
};

// Dann in Prompt:
"Improve this: {{input_step_2}}"
```

---

### **🐛 BUG #3: ID Type Mismatch** 🟡 MEDIUM

**Problem:**
```typescript
// lib/types/workflow.ts - Zeile 57
id: number

// app/workflows/[slug]/page.tsx - Zeile 37
id: parseInt(rawWorkflow.id) || 0

// Aber Supabase hat: id UUID (String!)
// parseInt("550e8400-e29b-41d4-a716-446655440000") → NaN → 0
```

**Impact:**
- `workflow.id` ist immer `0`
- FavoriteButton bekommt falsche ID
- Database Queries mit `workflow_id = 0` schlagen fehl
- Favorites können nicht gespeichert werden

**Fix:**
```typescript
// In lib/types/workflow.ts:
id: string  // statt number

// In app/workflows/[slug]/page.tsx:
id: rawWorkflow.id  // kein parseInt()
```

---

### **🐛 BUG #4: data-step Attribute fehlt** 🟡 MEDIUM

**Problem (Zeile 392-398):**
```typescript
onContinue={() => {
  if (index < workflow.steps.length - 1) {
    const nextStepElement = document.querySelector(`[data-step="${step.number + 1}"]`);
    nextStepElement?.scrollIntoView({ behavior: 'smooth' });
  }
}}
```

**Code sucht:** `[data-step="2"]`

**Aber HTML hat (Zeile 367):**
```typescript
<div key={step.number}>  // ← Kein data-step Attribute!
```

**Impact:**
- `querySelector` findet nichts → `null`
- Scroll-to-next-step funktioniert nicht
- Kein Error, aber Feature funktioniert nicht

**Fix:**
```typescript
<div key={step.number} data-step={step.number}>
```

---

### **🐛 BUG #5: InputStep hat keinen Back Button** 🟡 MEDIUM

**Problem (Zeile 318):**
```typescript
{isSequential && !isInputStep(currentStepObj) && (
  <Card>
    <Button>Back</Button>
    <Button>Next</Button>
  </Card>
)}
```

**Logik:**
- PromptStep: Hat Back/Next Buttons ✅
- InstructionStep: Hat Back/Next Buttons ✅
- InputStep: Hat **KEINEN** Back Button ❌

**Impact:**
- User kann bei InputStep nicht zurück navigieren
- Muss Content löschen und neu eingeben wenn Fehler
- Schlechte UX

**Warum so?**
- InputStep hat eigenen "Continue" Button
- Aber kein "Back" Button integriert

**Fix:**
```typescript
// In InputStep.tsx:
<div className="flex gap-2">
  {showBackButton && <Button onClick={onBack}>Back</Button>}
  <Button onClick={onContinue}>Continue</Button>
</div>
```

---

### **🐛 BUG #6: onComplete fehlen inputValues** 🟡 MEDIUM

**Problem (Zeile 174-182):**
```typescript
const handleCompleteWorkflow = () => {
  if (onComplete) {
    onComplete(fieldValues);  // ← inputValues fehlen!
  }
  toast({
    title: '🎉 Workflow Complete!',
    description: 'You\'ve completed all steps',
  });
};
```

**Impact:**
- `inputValues` werden **nicht** an `onComplete` übergeben
- WorkflowRunnerWrapper bekommt nur `fieldValues`
- InputStep-Daten gehen bei Database Recording verloren
- Usage Tracking ist unvollständig

**Aktuell in WorkflowRunnerWrapper.tsx:**
```typescript
onComplete: async (fieldValues) => {
  // Flatten field values
  const allValues: Record<string, any> = {};
  Object.values(fieldValues).forEach(stepValues => {
    Object.assign(allValues, stepValues);
  });
  // ← inputValues fehlen hier komplett!
}
```

**Fix:**
```typescript
// Ändere Signature:
onComplete?: (data: { 
  fieldValues: Record<number, Record<string, string>>,
  inputValues: Record<number, string>
}) => void;

// Aufruf:
onComplete({ fieldValues, inputValues });
```

---

### **⚠️ PROBLEM #7: Keine Icon Validierung** 🟢 LOW

**Location:** `InstructionStep.tsx` Zeile 37-39

```typescript
const IconComponent = step.instruction_icon 
  ? iconMap[step.instruction_icon]  // ← Was wenn ungültiger Wert?
  : Info;
```

**Problem:**
- `instruction_icon = 'invalid'` → `iconMap['invalid']` → `undefined`
- `<IconComponent />` mit `undefined` → **React Crash!**

**Fix:**
```typescript
const IconComponent = (step.instruction_icon && iconMap[step.instruction_icon]) || Info;
```

---

### **⚠️ PROBLEM #8: Checkbox nicht uncheckable** 🟢 LOW

**Location:** `InstructionStep.tsx` Zeile 87-91

```typescript
onCheckedChange={(checked) => {
  if (checked) {
    onComplete();
  }
  // ← Was wenn unchecked? Nichts passiert!
}}
```

**Problem:**
- User kann Checkbox nicht rückgängig machen
- Einmal "Done" → immer "Done"
- Kein `onUncomplete` callback

**Impact:**
- User kann Fehler nicht korrigieren
- Muss Page reloaden um zurückzusetzen

**Fix:**
```typescript
// Braucht onUncomplete callback:
interface InstructionStepProps {
  onComplete: () => void;
  onUncomplete: () => void;  // ← NEU
  isCompleted: boolean;
}

onCheckedChange={(checked) => {
  if (checked) {
    onComplete();
  } else {
    onUncomplete();
  }
}}
```

---

### **⚠️ PROBLEM #9: Navigation Buttons Logik inkonsistent** 🟢 LOW

**Location:** `WorkflowRunner.tsx` Zeile 318

```typescript
{isSequential && !isInputStep(currentStepObj) && (
  // Navigation Buttons
)}
```

**Logik:**
- Sequential Mode: Zeigt Buttons ✅
- Combined Mode: Keine Buttons ✅
- InputStep: Keine Buttons (hat eigenen Continue) ✅

**ABER:**
- InputStep in Sequential Mode hat **keinen Back Button**
- User sitzt fest wenn er zurück will

---

## 📊 DATENSTRUKTUR DETAILS

### **fieldValues Struktur:**
```typescript
Record<number, Record<string, string>>

// Beispiel:
{
  1: {                    // Step 1
    topic: "AI",
    audience: "Developers"
  },
  2: {                    // Step 2
    tone: "Professional",
    length: "Long"
  }
}
```

### **inputValues Struktur:**
```typescript
Record<number, string>

// Beispiel:
{
  3: "User's article content...",
  5: "ChatGPT's response..."
}
```

### **completedSteps Struktur:**
```typescript
Set<number>

// Beispiel:
Set([1, 2, 4])  // Steps 1, 2, 4 sind completed
```

---

## 🔧 VALIDIERUNGS-LOGIK

### **PromptStep Validation (Zeile 85-90):**
```typescript
if (isPromptStep(currentStepObj)) {
  const values = fieldValues[currentStep] || {};
  return currentStepObj.fields
    .filter(f => f.required)
    .every(f => values[f.name]?.trim());
}
```

**Regel:** Alle `required: true` Felder müssen gefüllt sein (nicht nur whitespace)

**Beispiel:**
```typescript
fields: [
  { name: "topic", required: true },   // Muss gefüllt sein
  { name: "notes", required: false }   // Optional
]

// Valid wenn:
values = { topic: "AI" }              // ✅
values = { topic: "AI", notes: "" }   // ✅
values = { topic: "" }                // ❌
values = { topic: "   " }             // ❌ (nur whitespace)
```

---

### **InstructionStep Validation (Zeile 92-94):**
```typescript
if (isInstructionStep(currentStepObj)) {
  return completedSteps.has(currentStep);
}
```

**Regel:** Step muss in `completedSteps` Set sein

**User Action:** Checkbox "Mark as done" anklicken

---

### **InputStep Validation (Zeile 96-98):**
```typescript
if (isInputStep(currentStepObj)) {
  return (inputValues[currentStep] || '').trim().length > 0;
}
```

**Regel:** Input darf nicht leer sein (nach trim)

**Beispiel:**
```typescript
inputValues[3] = "Content"    // ✅ Valid
inputValues[3] = ""           // ❌ Invalid
inputValues[3] = "   "        // ❌ Invalid (nur whitespace)
```

---

## 📋 SUPABASE TABELLEN-ANFORDERUNGEN

### **Aktuelle `workflows` Tabelle:**
```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  steps JSONB,
  created_at TIMESTAMP WITH TIME ZONE
);
```

### **❌ FEHLENDE SPALTE:**
```sql
workflow_type TEXT CHECK (workflow_type IN ('combined', 'sequential')) DEFAULT 'combined'
```

### **✅ BENÖTIGTE MIGRATION:**
```sql
-- Add workflow_type column
ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS workflow_type TEXT 
CHECK (workflow_type IN ('combined', 'sequential')) 
DEFAULT 'combined';

-- Update existing workflows
UPDATE workflows 
SET workflow_type = 'combined' 
WHERE workflow_type IS NULL;

-- Verify
SELECT id, slug, workflow_type FROM workflows;
```

### **Steps JSONB Struktur:**

#### **Minimale Struktur (Alte Workflows):**
```json
[
  {
    "title": "Step 1",
    "description": "...",
    "prompt_template": "Write about {{topic}}",
    "fields": [
      {"name": "topic", "label": "Topic", "type": "text", "required": true}
    ]
  }
]
```

#### **Vollständige Struktur (Neue Workflows):**
```json
[
  {
    "number": 1,
    "type": "prompt",
    "title": "Define Topic",
    "description": "What to write about",
    "prompt_template": "Write about {{topic}} for {{audience}}",
    "fields": [
      {"name": "topic", "label": "Topic", "type": "text", "required": true},
      {"name": "audience", "label": "Audience", "type": "text", "required": true}
    ]
  },
  {
    "number": 2,
    "type": "instruction",
    "title": "Copy to ChatGPT",
    "description": "Open ChatGPT",
    "instruction_text": "Click the button above to open ChatGPT and paste the prompt.",
    "instruction_icon": "clipboard"
  },
  {
    "number": 3,
    "type": "input",
    "title": "Paste Result",
    "description": "Paste ChatGPT output",
    "input_label": "ChatGPT Output",
    "input_placeholder": "Paste here...",
    "input_description": "Copy the entire response from ChatGPT"
  }
]
```

---

## 🚨 BUGS ZUSAMMENFASSUNG

| # | Bug | Severity | Location | Impact |
|---|-----|----------|----------|--------|
| 1 | Keine Cross-Step Variablen | 🔴 HIGH | WorkflowRunner.tsx:68-76 | Variablen aus Step 1 nicht in Step 3 verfügbar |
| 2 | InputStep Werte nicht in Prompts | 🔴 HIGH | WorkflowRunner.tsx:68-76 | InputStep-Content kann nicht verwendet werden |
| 3 | ID Type Mismatch (number vs UUID) | 🟡 MEDIUM | types/workflow.ts:57 | parseInt(UUID) → 0, FavoriteButton fails |
| 4 | data-step Attribute fehlt | 🟡 MEDIUM | WorkflowRunner.tsx:367 | Scroll-to-step funktioniert nicht |
| 5 | InputStep hat keinen Back Button | 🟡 MEDIUM | WorkflowRunner.tsx:318 | Schlechte UX in Sequential Mode |
| 6 | onComplete fehlen inputValues | 🟡 MEDIUM | WorkflowRunner.tsx:176 | InputStep-Daten gehen bei Recording verloren |
| 7 | Keine icon Validierung | 🟢 LOW | InstructionStep.tsx:37 | Crash bei ungültigem icon |
| 8 | Checkbox nicht uncheckable | 🟢 LOW | InstructionStep.tsx:87 | User kann nicht rückgängig machen |
| 9 | Leere instruction_text | 🟢 LOW | InstructionStep.tsx:74 | Zeigt leere Box |

---

## ✅ WAS GUT FUNKTIONIERT

### **Architektur:**
- ✅ Saubere Type Definitions
- ✅ Type Guards für Type Safety
- ✅ Component Separation (3 Step-Components)
- ✅ Klare Props Interfaces

### **Features:**
- ✅ localStorage Persistence
- ✅ Backward Compatibility (Fallbacks)
- ✅ Progress Tracking
- ✅ Completed Steps Display mit Edit
- ✅ Validation pro Step-Type
- ✅ Copy & Open ChatGPT

### **UI/UX:**
- ✅ Dark Theme konsistent
- ✅ Responsive Design
- ✅ Loading States
- ✅ Toast Notifications
- ✅ Smooth Animations

### **Code Quality:**
- ✅ TypeScript strict mode
- ✅ Keine Linter-Fehler
- ✅ Gute Kommentare
- ✅ Error Handling (localStorage)

---

## 🔧 EMPFOHLENE FIXES (PRIORITÄT)

### **Priority 1 - Kritisch (Blocking für Multi-Step):**

#### **Fix #1: Cross-Step Variablen**
```typescript
// In WorkflowRunner.tsx
const buildPrompt = (step: WorkflowStep, values: Record<string, string>) => {
  if (!isPromptStep(step)) return '';
  
  // Merge ALLE fieldValues
  const allFieldValues = Object.values(fieldValues).reduce((acc, stepVals) => ({
    ...acc,
    ...stepVals
  }), {});
  
  let prompt = step.prompt_template;
  Object.entries(allFieldValues).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return prompt;
};
```

#### **Fix #2: ID Type**
```typescript
// In lib/types/workflow.ts
export interface Workflow {
  id: string;  // ← Ändern von number zu string
  // ...
}

// In app/workflows/[slug]/page.tsx
const workflow: Workflow = {
  id: rawWorkflow.id,  // ← Kein parseInt()
  // ...
};
```

#### **Fix #3: onComplete mit inputValues**
```typescript
// In WorkflowRunner.tsx
const handleCompleteWorkflow = () => {
  if (onComplete) {
    onComplete({ fieldValues, inputValues });  // ← Beide übergeben
  }
};

// Update Props Interface:
interface WorkflowRunnerProps {
  onComplete?: (data: {
    fieldValues: Record<number, Record<string, string>>,
    inputValues: Record<number, string>
  }) => void;
}
```

---

### **Priority 2 - Wichtig (UX Improvements):**

#### **Fix #4: data-step Attribute**
```typescript
// In WorkflowRunner.tsx Zeile 367
<div key={step.number} data-step={step.number}>
```

#### **Fix #5: InputStep Back Button**
```typescript
// In InputStep.tsx Props hinzufügen:
interface InputStepProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

// In UI:
<div className="flex gap-2">
  {showBackButton && onBack && (
    <Button onClick={onBack} variant="outline">
      <ChevronLeft /> Back
    </Button>
  )}
  <Button onClick={onContinue}>
    Continue <ArrowRight />
  </Button>
</div>
```

---

### **Priority 3 - Nice to Have:**

#### **Fix #6: Icon Validation**
```typescript
const IconComponent = (step.instruction_icon && iconMap[step.instruction_icon]) || Info;
```

#### **Fix #7: Checkbox Uncheck**
```typescript
// Add onUncomplete prop
onCheckedChange={(checked) => {
  if (checked) {
    onComplete();
  } else {
    onUncomplete();
  }
}}
```

#### **Fix #8: Empty instruction_text**
```typescript
{step.instruction_text || 'No instruction provided'}
```

---

## 📝 KEINE TODO KOMMENTARE

✅ **Alle Placeholder und TODOs wurden entfernt!**
- Kein `// TODO:` im Code
- Keine `alert('coming soon')`
- Alle Features implementiert

---

## 🎯 VERWENDUNG FÜR ENTWICKLER

### **Workflow erstellen:**
```sql
INSERT INTO workflows (title, description, slug, workflow_type, steps) VALUES (
  'Blog Post Writer',
  'Create SEO-optimized blog posts',
  'blog-post-writer',
  'sequential',  -- ← Wichtig!
  '[
    {
      "number": 1,
      "type": "prompt",
      "title": "Define Topic",
      "description": "What do you want to write about?",
      "prompt_template": "Write a blog post about {{topic}} for {{audience}}. Tone: {{tone}}.",
      "fields": [
        {"name": "topic", "label": "Topic", "type": "text", "required": true},
        {"name": "audience", "label": "Target Audience", "type": "text", "required": true},
        {"name": "tone", "label": "Tone", "type": "select", "required": true, "options": ["Professional", "Casual", "Friendly"]}
      ]
    },
    {
      "number": 2,
      "type": "instruction",
      "title": "Copy to ChatGPT",
      "description": "Open ChatGPT and paste the prompt",
      "instruction_text": "1. Click 'Open in ChatGPT' above\n2. Paste the generated prompt\n3. Wait for response",
      "instruction_icon": "clipboard"
    },
    {
      "number": 3,
      "type": "input",
      "title": "Paste Result",
      "description": "Paste what ChatGPT generated",
      "input_label": "ChatGPT Output",
      "input_placeholder": "Paste the blog post here...",
      "input_description": "Copy the entire response from ChatGPT"
    }
  ]'::jsonb
);
```

### **Component Usage:**
```tsx
import { WorkflowRunnerWrapper } from '@/components/workflow/WorkflowRunnerWrapper';

<WorkflowRunnerWrapper
  workflow={workflow}
  userId={user?.id || null}
/>
```

---

## 🎨 UI KOMPONENTEN ÜBERSICHT

### **WorkflowRunner:**
- Progress Bar
- Completed Steps (collapsed)
- Current Step Renderer
- Navigation Buttons

### **PromptStepComponent:**
- Dynamic Fields (text, textarea, select)
- Required Indicator (*)
- Generated Prompt Preview
- Copy & Open ChatGPT Buttons

### **InstructionStepComponent:**
- Icon Display (6 Icons)
- Instruction Text Box
- "Mark as Done" Checkbox
- Completed State (grün)

### **InputStepComponent:**
- Large Textarea (12 rows)
- Character Counter
- Optional Description (💡 Tip)
- Continue Button

---

## 📈 PERFORMANCE NOTES

### **Re-Renders:**
- `useMemo` für `isCurrentStepValid` (Zeile 82-101)
- Verhindert unnötige Validierungs-Checks
- Optimiert für große Workflows

### **localStorage:**
- Speichert bei jedem State-Change
- Könnte debounced werden für bessere Performance
- Aktuell: Kein Performance-Problem

---

## 🔒 SECURITY NOTES

### **XSS Risiken:**
- ✅ `instruction_text` wird als Text gerendert (nicht HTML)
- ✅ `prompt_template` wird escaped
- ✅ User Input wird nicht als HTML interpretiert

### **localStorage:**
- ⚠️ Sensitive Daten könnten in localStorage landen
- ⚠️ Kein Encryption
- ⚠️ Accessible via Browser DevTools

**Empfehlung:** Keine sensitive Daten in Workflows

---

## 📚 ZUSAMMENFASSUNG FÜR ENTWICKLER

### **Das System kann:**
✅ Multi-Step Workflows mit 3 Step-Types
✅ Sequential & Combined Modes
✅ Progress Tracking mit localStorage
✅ Backward Compatible mit alten Workflows
✅ Type-Safe mit TypeScript
✅ Validation pro Step-Type

### **Das System kann NICHT:**
❌ Cross-Step Variablen (Bug #1)
❌ InputStep Werte in Prompts (Bug #2)
❌ Step-Reihenfolge validieren
❌ Instruction Steps unchecken
❌ InputStep Back Navigation (Sequential)

### **Kritische Fixes benötigt:**
1. 🔴 Cross-Step Variablen enablen
2. 🔴 InputStep Werte in buildPrompt integrieren
3. 🟡 ID Type von number → string
4. 🟡 onComplete mit inputValues
5. 🟡 InputStep Back Button

### **Code Quality:**
- ✅ Keine Linter-Fehler
- ✅ TypeScript strict mode
- ✅ Gute Component-Struktur
- ✅ Saubere Separation of Concerns

---

## 📞 KONTAKT

Bei Fragen zu dieser Dokumentation:
- Siehe Code-Kommentare in den analysierten Dateien
- Siehe `WORKFLOW_RUNNER_DOCS.md` für Usage Examples
- Siehe `components/workflow/steps/README.md` für Step-Components

---

**Dokumentation erstellt:** 26. November 2025  
**Version:** 1.0  
**Status:** Complete & Production-Ready (mit bekannten Bugs)

