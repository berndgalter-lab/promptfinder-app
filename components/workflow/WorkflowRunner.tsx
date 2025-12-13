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
import { ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp, Copy, ExternalLink, CheckCircle, RotateCcw, Layout } from 'lucide-react';
import Link from 'next/link';
import { WorkflowRating } from '@/components/workflow/WorkflowRating';
import { SOPOverview } from '@/components/workflow/SOPOverview';
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
  
  // Check if this is an SOP that should show overview first
  const isSOP = workflow.workflow_type === 'sequential' && workflow.sop_details;
  
  // Debug logging
  console.log('=== SOP DEBUG ===');
  console.log('workflow_type:', workflow.workflow_type);
  console.log('sop_details:', workflow.sop_details);
  console.log('isSOP:', isSOP);
  console.log('workflow.slug:', workflow.slug);
  
  // Check localStorage synchronously to determine if user has already started
  const checkIfStarted = () => {
    if (typeof window === 'undefined') {
      console.log('checkIfStarted: window is undefined (SSR)');
      return false;
    }
    if (!isSOP) {
      console.log('checkIfStarted: not an SOP, returning false');
      return false;
    }
    try {
      const savedProgress = localStorage.getItem(`workflow_progress_${workflow.slug}`);
      console.log('checkIfStarted: savedProgress from localStorage:', savedProgress);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        const hasProgress = !!(parsed.currentStep || (parsed.completedSteps && parsed.completedSteps.length > 0));
        console.log('checkIfStarted: hasProgress:', hasProgress, 'parsed:', parsed);
        return hasProgress;
      }
    } catch (error) {
      console.error('Error checking workflow progress:', error);
    }
    console.log('checkIfStarted: returning false (no saved progress)');
    return false;
  };
  
  const [hasStarted, setHasStarted] = useState(checkIfStarted());
  console.log('hasStarted state:', hasStarted);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [fieldValues, setFieldValues] = useState<Record<number, Record<string, string>>>({});
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false); // Single mode completion
  const [isWorkflowCompleted, setIsWorkflowCompleted] = useState(false); // Multi-step completion
  const [hasBeenUsed, setHasBeenUsed] = useState(false); // Track if history entry already created

  // Auto-detect mode: Single (1 prompt) vs Multi-Step (everything else)
  const isSingleMode = workflow.steps.length === 1 && isPromptStep(workflow.steps[0]);
  const isMultiStep = !isSingleMode;
  const totalSteps = workflow.steps.length;
  const progress = (currentStep / totalSteps) * 100;

  // Load progress from localStorage (only for mid-session recovery, not after completion)
  useEffect(() => {
    const savedProgress = localStorage.getItem(`workflow_progress_${workflow.slug}`);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        
        // GDPR-SAFE: Only load progress state, NO user content
        // User must re-enter fields - this is safer
        // Only restore if workflow hasn't been completed yet
        if (!isWorkflowCompleted) {
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
          if (parsed.completedSteps) setCompletedSteps(new Set(parsed.completedSteps));
          
          // If there's saved progress, user has already started the SOP
          if (isSOP && (parsed.currentStep || (parsed.completedSteps && parsed.completedSteps.length > 0))) {
            setHasStarted(true);
          }
        }
        
        // fieldValues and inputValues are NOT loaded
        // User starts with empty fields - Privacy by Design
        
        console.log('[GDPR-Safe] Progress restored, but content fields reset for privacy');
      } catch (error) {
        console.error('Error loading workflow progress:', error);
      }
    }
  }, [workflow.slug, isWorkflowCompleted, isSOP]);

  // If SOP and not started, show overview
  console.log('=== SOP RENDERING CHECK ===');
  console.log('isSOP:', isSOP);
  console.log('hasStarted:', hasStarted);
  console.log('Should show SOP Overview?', isSOP && !hasStarted);
  
  if (isSOP && !hasStarted) {
    console.log('✅ Rendering SOPOverview component');
    return (
      <SOPOverview 
        workflow={workflow} 
        onStart={() => {
          console.log('🚀 SOP Start button clicked');
          setHasStarted(true);
        }} 
      />
    );
  } else {
    console.log('❌ NOT showing SOP Overview - isSOP:', isSOP, 'hasStarted:', hasStarted);
  }

  // Save progress to localStorage (but not after completion)
  useEffect(() => {
    // Don't save progress if workflow is completed - user should start fresh on next visit
    if (isWorkflowCompleted) {
      return;
    }

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
  }, [currentStep, completedSteps, workflow.slug, isWorkflowCompleted]);

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
    
    // 4. Start from prompt_template and normalize escaped newlines
    // Some templates in the database store literal "\n" sequences instead of real line breaks.
    // Replace those with actual newline characters so the preview is readable.
    let prompt = step.prompt_template.replace(/\\n/g, '\n');

    // 5. Replace all variables in prompt
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

  // Handle Single Mode completion (triggered by Copy or Open)
  const handleSingleModeComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      // Don't track usage here - only on explicit "Complete Workflow"
    }
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    
    // Don't track usage here - only create history entry on "Complete Workflow"
    
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
    
    // Don't track usage here - only create history entry on "Complete Workflow"
    
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
    // Mark all steps as completed
    const allStepNumbers = workflow.steps.map(s => s.number);
    setCompletedSteps(new Set(allStepNumbers));
    
    // Create history entry ONLY on explicit completion (prevents duplicates from copy/open)
    if (onComplete && !hasBeenUsed) {
      setHasBeenUsed(true); // Prevent duplicate entries
      onComplete({ fieldValues, inputValues });
    }
    
    // Show completion screen FIRST (prevents save useEffect from running)
    setIsWorkflowCompleted(true);
    
    // Clear ALL progress data from localStorage after completion
    // User should start fresh on next visit
    localStorage.removeItem(`workflow_progress_${workflow.slug}`);
    
    toast({
      title: '🎉 Workflow Complete!',
      description: 'You\'ve completed all steps',
    });
  };

  // Reset workflow to start again
  const handleResetWorkflow = () => {
    setIsWorkflowCompleted(false);
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setFieldValues({});
    setInputValues({});
    setExpandedSteps(new Set());
    setHasBeenUsed(false); // Reset usage tracking for new session
    
    // Clear localStorage for fresh start
    localStorage.removeItem(`workflow_progress_${workflow.slug}`);
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

  // Show completion screen if workflow is completed
  if (isWorkflowCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-8">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        {/* Success Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Workflow Complete!</h2>
          <p className="text-zinc-400 max-w-md">
            You've successfully completed the {workflow.title}. Your prompts are ready to use.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleResetWorkflow}
            variant="outline"
            className="!border-zinc-700 !text-white hover:!bg-zinc-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Again
          </Button>
          
          <Link href="/workflows">
            <Button className="!bg-blue-600 hover:!bg-blue-700 !text-white">
              <Layout className="w-4 h-4 mr-2" />
              Browse Workflows
            </Button>
          </Link>
        </div>
        
        {/* Rating Section */}
        <div className="pt-8 border-t border-zinc-800 w-full max-w-md">
          <p className="text-zinc-400 mb-4">How helpful was this workflow?</p>
          <WorkflowRating workflowId={workflow.id} userId={userId} />
        </div>
      </div>
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
              tool={workflow.tool}
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

