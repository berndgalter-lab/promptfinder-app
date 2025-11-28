# Workflow Step Components

Diese drei Komponenten bilden die Bausteine für das neue Workflow-System.

---

## 📦 **Components**

### 1. **PromptStepComponent** (`PromptStep.tsx`)

**Zweck:** Rendert einen Step mit Eingabefeldern und generiert einen Prompt.

**Features:**
- ✅ Dynamische Felder (text, textarea, select)
- ✅ Required-Validierung mit * Indicator
- ✅ Generated Prompt Preview in Card
- ✅ "Copy Prompt" Button (disabled bis alle required fields gefüllt)
- ✅ "Open in ChatGPT" Button
- ✅ Responsive Design

**Props:**
```typescript
{
  step: PromptStep;                    // Step-Definition
  fieldValues: Record<string, string>; // Aktuelle Werte
  onFieldChange: (name, value) => void; // Field-Update
  onCopyPrompt: () => void;            // Copy-Handler
  onOpenChatGPT: () => void;           // ChatGPT-Handler
  generatedPrompt: string;             // Finaler Prompt
}
```

**Usage:**
```tsx
<PromptStepComponent
  step={step}
  fieldValues={values}
  onFieldChange={(name, value) => setValues({...values, [name]: value})}
  onCopyPrompt={() => navigator.clipboard.writeText(prompt)}
  onOpenChatGPT={() => window.open('https://chat.openai.com')}
  generatedPrompt={generatePrompt(step.prompt_template, values)}
/>
```

---

### 2. **InstructionStepComponent** (`InstructionStep.tsx`)

**Zweck:** Zeigt eine Anweisung an (z.B. "Kopiere das in ChatGPT").

**Features:**
- ✅ Icon-Support (6 Icons: clipboard, arrow-right, check, info, paste, send)
- ✅ Instruction Text in highlighted Card
- ✅ "Mark as Done" Checkbox
- ✅ Completed State mit grünem Checkmark
- ✅ Visuelles Feedback (Farben ändern sich)

**Props:**
```typescript
{
  step: InstructionStep;     // Step-Definition
  onComplete: () => void;    // Completion-Handler
  isCompleted: boolean;      // Completion-Status
}
```

**Usage:**
```tsx
<InstructionStepComponent
  step={step}
  onComplete={() => markStepComplete(step.number)}
  isCompleted={completedSteps.includes(step.number)}
/>
```

**Icons:**
- `clipboard` → Clipboard Icon
- `arrow-right` → ArrowRight Icon
- `check` → CheckCircle Icon
- `info` → Info Icon
- `paste` → ClipboardPaste Icon
- `send` → Send Icon

---

### 3. **InputStepComponent** (`InputStep.tsx`)

**Zweck:** User gibt eigenen Content ein (z.B. "Paste your article here").

**Features:**
- ✅ Large Textarea (12 rows)
- ✅ Character Counter
- ✅ Optional Description mit 💡 Tip
- ✅ "Continue" Button (disabled wenn leer)
- ✅ Monospace Font für bessere Lesbarkeit

**Props:**
```typescript
{
  step: InputStep;              // Step-Definition
  value: string;                // Aktueller Input
  onChange: (value) => void;    // Input-Handler
  onContinue: () => void;       // Continue-Handler
}
```

**Usage:**
```tsx
<InputStepComponent
  step={step}
  value={inputValue}
  onChange={(value) => setInputValue(value)}
  onContinue={() => goToNextStep()}
/>
```

---

## 🎨 **Design System**

### **Colors:**
- Background: `bg-zinc-900` / `bg-zinc-950`
- Borders: `border-zinc-800` / `border-zinc-700`
- Text: `text-white` / `text-zinc-400`
- Primary: `bg-blue-600` / `text-blue-400`
- Success: `bg-green-600` / `text-green-400`

### **States:**
- **Default:** Blue accents
- **Completed:** Green accents
- **Disabled:** Reduced opacity
- **Focus:** Blue border

---

## 📋 **Import & Export**

### **Import einzeln:**
```tsx
import { PromptStepComponent } from '@/components/workflow/steps/PromptStep';
import { InstructionStepComponent } from '@/components/workflow/steps/InstructionStep';
import { InputStepComponent } from '@/components/workflow/steps/InputStep';
```

### **Import via index:**
```tsx
import { 
  PromptStepComponent, 
  InstructionStepComponent, 
  InputStepComponent 
} from '@/components/workflow/steps';
```

---

## 🔧 **Type Guards Usage**

```tsx
import { isPromptStep, isInstructionStep, isInputStep } from '@/lib/types/workflow';

// Render basierend auf Step-Type
{steps.map(step => {
  if (isPromptStep(step)) {
    return <PromptStepComponent key={step.number} step={step} {...props} />;
  }
  if (isInstructionStep(step)) {
    return <InstructionStepComponent key={step.number} step={step} {...props} />;
  }
  if (isInputStep(step)) {
    return <InputStepComponent key={step.number} step={step} {...props} />;
  }
})}
```

---

## 🎯 **Example Workflow**

```tsx
const workflow = {
  steps: [
    {
      number: 1,
      type: 'prompt',
      title: 'Define Your Topic',
      description: 'Tell us what you want to write about',
      prompt_template: 'Write about {{topic}} for {{audience}}',
      fields: [
        { name: 'topic', label: 'Topic', type: 'text', required: true },
        { name: 'audience', label: 'Audience', type: 'text', required: true }
      ]
    },
    {
      number: 2,
      type: 'instruction',
      title: 'Copy to ChatGPT',
      description: 'Open ChatGPT and paste the prompt',
      instruction_text: 'Click "Open in ChatGPT" and paste the generated prompt.',
      instruction_icon: 'clipboard'
    },
    {
      number: 3,
      type: 'input',
      title: 'Paste Result',
      description: 'Paste what ChatGPT generated',
      input_label: 'ChatGPT Output',
      input_placeholder: 'Paste the response here...',
      input_description: 'Copy the entire response from ChatGPT'
    }
  ]
};
```

---

## ✅ **Features Summary**

### **PromptStep:**
- ✅ Dynamic field rendering
- ✅ Validation
- ✅ Prompt preview
- ✅ Copy & Open actions

### **InstructionStep:**
- ✅ Icon support
- ✅ Completion tracking
- ✅ Visual feedback

### **InputStep:**
- ✅ Large textarea
- ✅ Character count
- ✅ Continue button

---

## 🚀 **Next Steps**

Diese Components können jetzt in einem **WorkflowRunner** verwendet werden:

```tsx
<WorkflowRunner workflow={workflow}>
  {/* Rendert automatisch die richtigen Step-Components */}
</WorkflowRunner>
```

**Ready to use! 🎉**

