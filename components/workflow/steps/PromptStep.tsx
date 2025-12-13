'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, ExternalLink, Clock, Lightbulb, CheckCircle, AlertTriangle, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { type PromptStep } from '@/lib/types/workflow';
import { WorkflowSectionLabel } from '@/components/workflow/WorkflowSectionLabel';
import { PromptReadyBanner } from '@/components/workflow/PromptReadyBanner';
import { ProTip } from '@/components/workflow/ProTip';
import { ChatInstructionHint } from '@/components/workflow/ChatInstructionHint';

interface PromptStepProps {
  step: PromptStep;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
  onCopyPrompt: () => void;
  onOpenChatGPT: () => void;
  generatedPrompt: string;
  tool?: 'chatgpt' | 'claude' | 'cursor' | 'any';
  isSOP?: boolean;
}

export function PromptStepComponent({
  step,
  fieldValues,
  onFieldChange,
  onCopyPrompt,
  onOpenChatGPT,
  generatedPrompt,
  tool = 'chatgpt',
  isSOP = false,
}: PromptStepProps) {
  // Check if all required fields are filled
  const areRequiredFieldsFilled = step.fields
    .filter(field => field.required)
    .every(field => fieldValues[field.name]?.trim());

  // Ensure that literal "\n" sequences from the database are rendered as real line breaks
  const displayPrompt = useMemo(
    () => generatedPrompt.replace(/\\n/g, '\n'),
    [generatedPrompt]
  );

  // Tool-specific button labels
  const openButtonLabels = {
    chatgpt: 'Open ChatGPT',
    claude: 'Open Claude',
    cursor: 'Open Cursor',
    any: 'Open AI Assistant'
  };

  // "Open AI Assistant" Button nur bei Step 1 oder explizit new_chat zeigen
  // Bei Step 2+ im gleichen Chat würde ein neuer Tab den Kontext zerstören
  const showOpenAIButton = !isSOP || step.number === 1 || step.chat_instruction === 'new_chat';

  return (
    <div>
      {/* SOP Chat-Hinweis (new_chat / same_chat / paste_previous) */}
      <ChatInstructionHint 
        stepNumber={step.number}
        chatInstruction={step.chat_instruction}
        isSOP={isSOP}
      />

      {/* SOP-spezifisch: Step Title groß */}
      {isSOP && step.title && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{step.title}</h2>
            {step.duration_minutes && (
              <span className="text-sm text-zinc-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~{step.duration_minutes} min
              </span>
            )}
          </div>
        </div>
      )}

      {/* SOP-spezifisch: Why this step? */}
      {isSOP && step.why && (
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-400 mb-1">Why this step?</p>
              <p className="text-sm text-zinc-300">{step.why}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
      {/* Fields Section with Label */}
      <div>
        <WorkflowSectionLabel 
          step={1} 
          title="Your Details" 
          subtitle="Fill in the fields to personalize your prompt"
        />
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="space-y-4 pt-6">
          {step.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-white">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {/* Text Input */}
              {field.type === 'text' && (
                <Input
                  id={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  value={fieldValues[field.name] || ''}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  required={field.required}
                  className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                />
              )}

              {/* Textarea */}
              {field.type === 'textarea' && (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={fieldValues[field.name] || ''}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  required={field.required}
                  rows={4}
                  className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                />
              )}

              {/* Select Dropdown */}
              {field.type === 'select' && field.options && (
                <Select
                  value={fieldValues[field.name] || ''}
                  onValueChange={(value) => onFieldChange(field.name, value)}
                >
                  <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white focus:border-blue-500">
                    <SelectValue placeholder={field.placeholder || 'Select an option'} />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {field.options.map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        className="text-white focus:bg-zinc-800 focus:text-white"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Multiselect Checkbox Group */}
              {field.type === 'multiselect' && field.options && (
                <div className="space-y-2 p-3 rounded-lg bg-zinc-950 border border-zinc-700">
                  {field.options.map((option) => {
                    // Parse current values (comma-separated string)
                    const currentValues = (fieldValues[field.name] || '').split(',').filter(Boolean).map(v => v.trim());
                    const isChecked = currentValues.includes(option);
                    
                    const handleToggle = (checked: boolean) => {
                      let newValues: string[];
                      if (checked) {
                        newValues = [...currentValues, option];
                      } else {
                        newValues = currentValues.filter(v => v !== option);
                      }
                      onFieldChange(field.name, newValues.join(', '));
                    };
                    
                    return (
                      <div key={option} className="flex items-center space-x-3">
                        <Checkbox
                          id={`${field.name}-${option}`}
                          checked={isChecked}
                          onCheckedChange={handleToggle}
                          className="border-zinc-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor={`${field.name}-${option}`}
                          className="text-sm text-zinc-300 cursor-pointer select-none"
                        >
                          {option}
                        </label>
                      </div>
                    );
                  })}
                  {/* Show selected count */}
                  {(fieldValues[field.name] || '').split(',').filter(Boolean).length > 0 && (
                    <p className="text-xs text-zinc-500 mt-2 pt-2 border-t border-zinc-800">
                      {(fieldValues[field.name] || '').split(',').filter(Boolean).length} selected
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          </CardContent>
        </Card>
      </div>

      {/* Generated Prompt Preview with Section Label */}
      {generatedPrompt && (
        <div>
          <WorkflowSectionLabel 
            step={2} 
            title="Your Prompt" 
          />
          <PromptReadyBanner isReady={areRequiredFieldsFilled} />
          
          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <CardContent className="space-y-4 pt-6">
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono">
                  {displayPrompt}
                </pre>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onCopyPrompt}
                  disabled={!areRequiredFieldsFilled}
                  variant="outline"
                  className={`${showOpenAIButton ? 'flex-1' : 'w-full'} !text-white !border-zinc-700 hover:!bg-zinc-800`}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                {showOpenAIButton && (
                  <Button
                    onClick={onOpenChatGPT}
                    disabled={!areRequiredFieldsFilled}
                    className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {openButtonLabels[tool]}
                  </Button>
                )}
              </div>

              <ProTip tool={tool} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* SOP-spezifisch: Quality Checks (nach dem Prompt, vor Navigation) */}
      {isSOP && step.quality_checks && step.quality_checks.length > 0 && (
        <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Before continuing, check:
          </p>
          <ul className="space-y-2">
            {step.quality_checks.map((check, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-green-400">□</span>
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SOP-spezifisch: Common Mistakes */}
      {isSOP && step.common_mistakes && step.common_mistakes.length > 0 && (
        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Common mistakes to avoid:
          </p>
          <ul className="space-y-2">
            {step.common_mistakes.map((mistake, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-amber-400">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

