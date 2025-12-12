'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clipboard, 
  ArrowRight, 
  CheckCircle, 
  Info, 
  ClipboardPaste, 
  Send,
  Check,
  ClipboardCheck
} from 'lucide-react';
import { type InstructionStep } from '@/lib/types/workflow';

interface InstructionStepProps {
  step: InstructionStep;
  onComplete: () => void;
  isCompleted: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clipboard: Clipboard,
  'arrow-right': ArrowRight,
  check: CheckCircle,
  info: Info,
  paste: ClipboardPaste,
  send: Send,
  'clipboard-check': ClipboardCheck, // Support clipboard-check icon
};

export function InstructionStepComponent({
  step,
  onComplete,
  isCompleted,
}: InstructionStepProps) {
  // Safe icon lookup with fallback - prevents undefined component errors
  const IconComponent = (step.instruction_icon && iconMap[step.instruction_icon]) || Info;

  return (
    <Card className={`border-2 transition-all ${
      isCompleted 
        ? 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5' 
        : 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isCompleted 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {isCompleted ? (
              <Check className="w-5 h-5" />
            ) : (
              <IconComponent className="w-5 h-5" />
            )}
          </div>
          <span>{step.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        {step.description && (
          <p className="text-zinc-400 text-sm">
            {step.description}
          </p>
        )}

        {/* Instruction Text */}
        <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
          <p className="text-white leading-relaxed whitespace-pre-wrap">
            {step.instruction_text}
          </p>
        </div>

        {/* Completion Control */}
        <div className="flex items-center justify-between pt-2">
          <label 
            htmlFor={`instruction-${step.number}`}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Checkbox
              id={`instruction-${step.number}`}
              checked={isCompleted}
              onCheckedChange={(checked) => {
                if (checked) {
                  onComplete();
                }
              }}
              className="border-zinc-700 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <span className="text-sm text-zinc-400">
              {isCompleted ? 'Completed' : 'Mark as done'}
            </span>
          </label>

          {isCompleted && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Done!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

