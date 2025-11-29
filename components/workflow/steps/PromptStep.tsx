'use client';

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
import { Copy, ExternalLink } from 'lucide-react';
import { type PromptStep } from '@/lib/types/workflow';

interface PromptStepProps {
  step: PromptStep;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
  onCopyPrompt: () => void;
  onOpenChatGPT: () => void;
  generatedPrompt: string;
}

export function PromptStepComponent({
  step,
  fieldValues,
  onFieldChange,
  onCopyPrompt,
  onOpenChatGPT,
  generatedPrompt,
}: PromptStepProps) {
  // Check if all required fields are filled
  const areRequiredFieldsFilled = step.fields
    .filter(field => field.required)
    .every(field => fieldValues[field.name]?.trim());

  return (
    <div className="space-y-6">
      {/* Fields Section */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generated Prompt Preview */}
      {generatedPrompt && (
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-400">✨</span>
              Generated Prompt
            </CardTitle>
            <CardDescription>
              This is your final prompt ready to use in ChatGPT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono">
                {generatedPrompt}
              </pre>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onCopyPrompt}
                disabled={!areRequiredFieldsFilled}
                variant="outline"
                className="flex-1 !text-white !border-zinc-700 hover:!bg-zinc-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </Button>
              <Button
                onClick={onOpenChatGPT}
                disabled={!areRequiredFieldsFilled}
                className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Use in ChatGPT
              </Button>
            </div>

            {!areRequiredFieldsFilled && (
              <p className="text-sm text-zinc-500 text-center">
                Fill in all required fields to enable buttons
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

