'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  type Workflow,
  type WorkflowStep,
  type PromptStep,
  isPromptStep,
  isInstructionStep,
  isInputStep,
} from '@/lib/types/workflow';
import {
  PromptStepComponent,
  InstructionStepComponent,
  InputStepComponent,
} from '@/components/workflow/steps';

interface WorkflowRunnerProps {
  workflow: Workflow;
  userId: string | null;
  onComplete?: (data: {
    fieldValues: Record<number, Record<string, string>>;
    inputValues: Record<number, string>;
  }) => void;
}

export function WorkflowRunner({ workflow, userId, onComplete }: WorkflowRunnerProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [fieldValues, setFieldValues] = useState<Record<number, Record<string, string>>>({});
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasBeenUsed, setHasBeenUsed] = useState(false); // Track first usage

  // Auto-detect mode: Single (1 prompt) vs Multi-Step (everything else)
  const isSingleMode = workflow.steps.length === 1 && isPromptStep(workflow.steps[0]);
  const isMultiStep = !isSingleMode;
  const totalSteps = workflow.steps.length;
  const progress = (currentStep / totalSteps) * 100;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`workflow_progress_${workflow.slug}`);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        
        // GDPR-SAFE: Only load progress state, NO user content
        // User must re-enter fields - this is safer
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.completedSteps) setCompletedSteps(new Set(parsed.completedSteps));
        
        // fieldValues and inputValues are NOT loaded
        // User starts with empty fields - Privacy by Design
        
        console.log('[GDPR-Safe] Progress restored, but content fields reset for privacy');
      } catch (error) {
        console.error('Error loading workflow progress:', error);
      }
    }
  }, [workflow.slug]);

  // Save progress to localStorage
  useEffect(() => {
    // GDPR-SAFE: Store ONLY progress state, NO user content
    // - currentStep: OK (number)
    // - completedSteps: OK (array of numbers)
    // - fieldValues: NOT persisted - user must re-enter on return
    // - inputValues: NOT persisted - GDPR!
    
    const progressData = {
      currentStep,
      completedSteps: Array.from(completedSteps),
      // fieldValues are NOT persisted - user must re-enter when returning
      // inputValues are NOT persisted - GDPR!
    };
    
    localStorage.setItem(`workflow_progress_${workflow.slug}`, JSON.stringify(progressData));
  }, [currentStep, completedSteps, workflow.slug]);

  // Build prompt by replacing {{variables}} with values from ALL steps
  const buildPrompt = (step: WorkflowStep): string => {
    if (!isPromptStep(step)) return '';
    
    // 1. Merge all fieldValues from all steps (enables cross-step variables)
    const allFieldValues = Object.values(fieldValues).reduce((acc, stepVals) => ({
      ...acc,
      ...stepVals
    }), {} as Record<string, string>);
    
    // 2. Add inputValues with custom names or fallback to input_X
    const allInputValues: Record<string, string> = {};
    workflow.steps.forEach((s) => {
      if (isInputStep(s) && inputValues[s.number]) {
        const varName = s.input_name || `input_${s.number}`;
        allInputValues[varName] = inputValues[s.number];
      }
    });
    
    // 3. Merge both (inputValues can override fieldValues if same name)
    const allValues = { ...allFieldValues, ...allInputValues };
    
    // 4. Replace all variables in prompt
    let prompt = step.prompt_template;
    Object.entries(allValues).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return prompt;
  };

  // Get current step object
  const currentStepObj = workflow.steps.find(s => s.number === currentStep);

  // Check if current step is valid/complete
  const isCurrentStepValid = useMemo(() => {
    if (!currentStepObj) return false;

    if (isPromptStep(currentStepObj)) {
      const values = fieldValues[currentStep] || {};
      return currentStepObj.fields
        .filter(f => f.required)
        .every(f => values[f.name]?.trim());
    }

    if (isInstructionStep(currentStepObj)) {
      return completedSteps.has(currentStep);
    }

    if (isInputStep(currentStepObj)) {
      return (inputValues[currentStep] || '').trim().length > 0;
    }

    return false;
  }, [currentStepObj, currentStep, fieldValues, completedSteps, inputValues]);

  // Handle field change for PromptStep
  const handleFieldChange = (stepNumber: number, fieldName: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [stepNumber]: {
        ...(prev[stepNumber] || {}),
        [fieldName]: value,
      },
    }));
  };

  // Handle input change for InputStep
  const handleInputChange = (stepNumber: number, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [stepNumber]: value,
    }));
  };

  // Mark instruction step as complete
  const handleInstructionComplete = (stepNumber: number) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
  };

  // Track first usage (both Single and Multi-Step)
  const trackFirstUsage = () => {
    if (!hasBeenUsed) {
      setHasBeenUsed(true);
      
      // Trigger onComplete for usage tracking
      if (onComplete) {
        onComplete({ fieldValues, inputValues });
      }
      
      console.log('📊 First usage tracked for workflow:', workflow.slug);
    }
  };

  // Handle Single Mode completion (triggered by Copy or Open)
  const handleSingleModeComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      trackFirstUsage(); // Track usage on first interaction
    }
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    
    // Track first usage (both Single and Multi-Step)
    trackFirstUsage();
    
    // Different toast for Single vs Multi-Step
    if (isSingleMode) {
      handleSingleModeComplete();
      toast({
        title: '✅ Prompt copied!',
        description: 'Now paste it in ChatGPT to get your result.',
      });
    } else {
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard',
      });
    }
  };

  // Open in ChatGPT
  const handleOpenChatGPT = (prompt: string) => {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(prompt);
    
    // Track first usage (both Single and Multi-Step)
    trackFirstUsage();
    
    // Open ChatGPT with pre-filled prompt
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank');
    
    // Different toast for Single vs Multi-Step
    if (isSingleMode) {
      handleSingleModeComplete();
      toast({
        title: '✅ ChatGPT opened!',
        description: 'Your prompt is ready in ChatGPT.',
      });
    } else {
      toast({
        title: 'Opening ChatGPT',
        description: 'Your prompt is ready to use.',
      });
    }
  };

  // Navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps && isCurrentStepValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  // Toggle expanded step
  const toggleExpandedStep = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  // Complete workflow
  const handleCompleteWorkflow = () => {
    if (onComplete) {
      onComplete({ fieldValues, inputValues });
    }
    
    // Clear progress from localStorage after completion (Privacy)
    localStorage.removeItem(`workflow_progress_${workflow.slug}`);
    
    toast({
      title: '🎉 Workflow Complete!',
      description: 'You\'ve completed all steps',
    });
  };

  // ============================================
  // SINGLE MODE (1 prompt step)
  // ============================================
  if (isSingleMode) {
    const singleStep = workflow.steps[0] as PromptStep;
    const values = fieldValues[singleStep.number] || {};
    const generatedPrompt = buildPrompt(singleStep);
    
    const areAllFieldsFilled = singleStep.fields
      .filter(f => f.required)
      .every(f => values[f.name]?.trim());

    return (
      <div className="space-y-6">
        {/* Fields Card */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">{singleStep.title}</CardTitle>
            {singleStep.description && (
              <p className="text-sm text-zinc-400 mt-1">{singleStep.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {singleStep.fields.map(field => (
              <div key={field.name}>
                <Label className="text-white text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input
                    placeholder={field.placeholder}
                    value={values[field.name] || ''}
                    onChange={(e) => handleFieldChange(singleStep.number, field.name, e.target.value)}
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                )}
                
                {field.type === 'textarea' && (
                  <Textarea
                    placeholder={field.placeholder}
                    value={values[field.name] || ''}
                    onChange={(e) => handleFieldChange(singleStep.number, field.name, e.target.value)}
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px]"
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <Select
                    value={values[field.name] || ''}
                    onValueChange={(value) => handleFieldChange(singleStep.number, field.name, value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {field.options.map(option => (
                        <SelectItem key={option} value={option} className="text-white hover:bg-zinc-700">
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

      {/* Prompt Preview Card */}
      <Card className={`border-zinc-800 bg-zinc-900/50 transition-all ${isCompleted ? 'border-green-500/50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              {isCompleted && <Check className="w-5 h-5 text-green-500" />}
              Your Prompt
            </CardTitle>
            {areAllFieldsFilled && !isCompleted && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Ready to copy
              </span>
            )}
            {isCompleted && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Done! Ready to use
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 mb-4">
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
              {generatedPrompt || 'Fill in the fields above to generate your prompt...'}
            </pre>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => handleCopyPrompt(generatedPrompt)}
              disabled={!areAllFieldsFilled}
              variant="outline"
              className={`flex-1 transition-all ${
                isCompleted 
                  ? '!border-green-500/50 !text-green-500 hover:!bg-green-500/10' 
                  : '!border-zinc-700 !text-white hover:!bg-zinc-800'
              } disabled:opacity-50`}
            >
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
            <Button
              onClick={() => handleOpenChatGPT(generatedPrompt)}
              disabled={!areAllFieldsFilled}
              className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white disabled:opacity-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Use in ChatGPT
            </Button>
          </div>
          
          {/* Helpful hint after completion */}
          {isCompleted && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Workflow completed! Your prompt is ready to use in ChatGPT.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    );
  }

  // ============================================
  // MULTI-STEP MODE (everything else)
  // ============================================

  if (!currentStepObj) {
    return (
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-8 text-center">
          <p className="text-zinc-400">Step not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">
              Step {currentStep} of {totalSteps}
            </CardTitle>
            <span className="text-sm text-zinc-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Completed Steps (Collapsed) */}
      {isMultiStep && completedSteps.size > 0 && (
        <div className="space-y-2">
          {workflow.steps
            .filter(step => completedSteps.has(step.number) && step.number !== currentStep)
            .map(step => (
              <Card
                key={step.number}
                data-step={step.number}
                className="border-green-500/30 bg-gradient-to-r from-green-500/5 to-transparent"
              >
                <CardHeader className="py-3">
                  <button
                    onClick={() => toggleExpandedStep(step.number)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Step {step.number}: {step.title}
                        </p>
                        <p className="text-xs text-zinc-500">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToStep(step.number);
                        }}
                        className="!text-zinc-400 hover:!text-white"
                      >
                        Edit
                      </Button>
                      {expandedSteps.has(step.number) ? (
                        <ChevronUp className="w-5 h-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>
                  </button>
                </CardHeader>
                {expandedSteps.has(step.number) && (
                  <CardContent className="pt-0">
                    <div className="text-sm text-zinc-400">
                      {isPromptStep(step) && (
                        <div>
                          <p className="font-medium mb-2">Fields:</p>
                          <ul className="space-y-1">
                            {step.fields.map(field => (
                              <li key={field.name}>
                                {field.label}: <span className="text-white">{fieldValues[step.number]?.[field.name] || '-'}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {isInputStep(step) && (
                        <div>
                          <p className="font-medium mb-2">Input:</p>
                          <p className="text-white line-clamp-3">{inputValues[step.number] || '-'}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
        </div>
      )}

      {/* Current Step (Sequential Mode Only) */}
      {isMultiStep && (
        <div data-step={currentStep}>
          {isPromptStep(currentStepObj) && (
            <PromptStepComponent
              step={currentStepObj}
              fieldValues={fieldValues[currentStep] || {}}
              onFieldChange={(name, value) => handleFieldChange(currentStep, name, value)}
              onCopyPrompt={() => handleCopyPrompt(buildPrompt(currentStepObj))}
              onOpenChatGPT={() => handleOpenChatGPT(buildPrompt(currentStepObj))}
              generatedPrompt={buildPrompt(currentStepObj)}
            />
          )}

          {isInstructionStep(currentStepObj) && (
            <InstructionStepComponent
              step={currentStepObj}
              onComplete={() => handleInstructionComplete(currentStep)}
              isCompleted={completedSteps.has(currentStep)}
            />
          )}

          {isInputStep(currentStepObj) && (
            <InputStepComponent
              step={currentStepObj}
              value={inputValues[currentStep] || ''}
              onChange={(value) => handleInputChange(currentStep, value)}
              onContinue={goToNextStep}
              onBack={goToPreviousStep}
              showBackButton={currentStep > 1}
            />
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      {isMultiStep && !isInputStep(currentStepObj) && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                variant="outline"
                className="!text-white !border-zinc-700 hover:!bg-zinc-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={goToNextStep}
                  disabled={!isCurrentStepValid}
                  className="!bg-blue-600 hover:!bg-blue-700 !text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteWorkflow}
                  disabled={!isCurrentStepValid}
                  className="!bg-green-600 hover:!bg-green-700 !text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Workflow
                </Button>
              )}
            </div>

            {!isCurrentStepValid && (
              <p className="text-sm text-zinc-500 text-center mt-3">
                {isPromptStep(currentStepObj) && 'Fill in all required fields to continue'}
                {isInstructionStep(currentStepObj) && 'Mark this step as done to continue'}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

