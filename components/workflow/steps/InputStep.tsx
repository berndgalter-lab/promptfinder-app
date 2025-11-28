'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { type InputStep } from '@/lib/types/workflow';

interface InputStepProps {
  step: InputStep;
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack?: () => void;        // Back navigation handler
  showBackButton?: boolean;   // Show back button (not on first step)
}

export function InputStepComponent({
  step,
  value,
  onChange,
  onContinue,
  onBack,
  showBackButton,
}: InputStepProps) {
  const hasValue = value.trim().length > 0;

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-xl">{step.title}</CardTitle>
        {step.description && (
          <CardDescription>{step.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Description */}
        {step.input_description && (
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
            <p className="text-sm text-blue-300">
              💡 {step.input_description}
            </p>
          </div>
        )}

        {/* Input Label */}
        <div className="space-y-2">
          <label htmlFor={`input-${step.number}`} className="text-sm font-medium text-white">
            {step.input_label}
          </label>

          {/* Large Textarea */}
          <Textarea
            id={`input-${step.number}`}
            placeholder={step.input_placeholder || 'Paste your content here...'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={12}
            className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 font-mono text-sm"
          />

          {/* Character count */}
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>
              {value.length > 0 ? `${value.length} characters` : 'No content yet'}
            </span>
            {!hasValue && (
              <span className="text-zinc-600">
                Paste or type your content above
              </span>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-2">
          <div className="flex gap-3">
            {/* Back Button */}
            {showBackButton && onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="!text-white !border-zinc-700 hover:!bg-zinc-800"
                size="lg"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {/* Continue Button */}
            <Button
              onClick={onContinue}
              disabled={!hasValue}
              className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white"
              size="lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {!hasValue && (
            <p className="text-sm text-zinc-500 text-center mt-2">
              Add content to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

