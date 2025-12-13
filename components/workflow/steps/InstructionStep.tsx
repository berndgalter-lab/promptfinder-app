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
  ClipboardCheck,
  Clock,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { type InstructionStep } from '@/lib/types/workflow';

interface InstructionStepProps {
  step: InstructionStep;
  onComplete: () => void;
  isCompleted: boolean;
  isSOP?: boolean;
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
  isSOP = false,
}: InstructionStepProps) {
  // Safe icon lookup with fallback - prevents undefined component errors
  const IconComponent = (step.instruction_icon && iconMap[step.instruction_icon]) || Info;

  return (
    <div>
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

      <div>
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

