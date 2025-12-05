'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Copy, ExternalLink, Sparkles, Check, RotateCcw, Twitter, Linkedin, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  type Workflow,
  type PromptStep,
  isPromptStep,
} from '@/lib/types/workflow';

interface CleanWorkflowRunnerProps {
  workflow: Workflow;
  userId: string | null;
  onComplete?: (data: {
    fieldValues: Record<number, Record<string, string>>;
    inputValues: Record<number, string>;
  }) => void;
}

export function CleanWorkflowRunner({ workflow, userId, onComplete }: CleanWorkflowRunnerProps) {
  const { toast } = useToast();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [hasBeenUsed, setHasBeenUsed] = useState(false);

  // Get the first prompt step (for single-mode workflows)
  const promptStep = workflow.steps.find(isPromptStep) as PromptStep | undefined;

  if (!promptStep) {
    return (
      <div className="text-center text-zinc-500 py-8">
        No prompt step found in this workflow.
      </div>
    );
  }

  // Check if all required fields are filled
  const areAllFieldsFilled = useMemo(() => {
    return promptStep.fields
      .filter(f => f.required)
      .every(f => fieldValues[f.name]?.trim());
  }, [promptStep.fields, fieldValues]);

  // Handle field change
  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    // Reset generated state when user changes input
    if (promptGenerated) {
      setPromptGenerated(false);
      setGeneratedPrompt('');
    }
  };

  // Generate prompt by replacing {{variables}} with values
  const generatePrompt = () => {
    let prompt = promptStep.prompt_template.replace(/\\n/g, '\n');
    
    Object.entries(fieldValues).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    });
    
    setGeneratedPrompt(prompt);
    setPromptGenerated(true);
    
    // Scroll to result
    setTimeout(() => {
      document.getElementById('prompt-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Track first usage
  const trackFirstUsage = () => {
    if (!hasBeenUsed) {
      setHasBeenUsed(true);
      
      if (onComplete) {
        onComplete({ 
          fieldValues: { [promptStep.number]: fieldValues }, 
          inputValues: {} 
        });
      }
    }
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    trackFirstUsage();
    
    toast({
      title: '✅ Prompt copied!',
      description: 'Paste it in ChatGPT to get your result.',
    });
  };

  // Open in ChatGPT
  const handleOpenChatGPT = () => {
    navigator.clipboard.writeText(generatedPrompt);
    trackFirstUsage();
    
    const encodedPrompt = encodeURIComponent(generatedPrompt);
    window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank');
    
    toast({
      title: '✅ Opening ChatGPT',
      description: 'Your prompt is ready to use.',
    });
  };

  // Reset form
  const handleReset = () => {
    setFieldValues({});
    setPromptGenerated(false);
    setGeneratedPrompt('');
  };

  // Handle click on disabled button - scroll to first empty required field
  const handleDisabledClick = () => {
    if (areAllFieldsFilled) return;
    
    const firstEmptyField = promptStep.fields.find(
      field => field.required && !fieldValues[field.name]?.trim()
    );
    
    if (firstEmptyField) {
      const element = document.getElementById(`field-${firstEmptyField.name}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-red-500');
        }, 2000);
      }
    }
  };

  // Share URL
  const shareUrl = `https://prompt-finder.com/workflows/${workflow.slug}`;
  const timeSavedText = workflow.time_saved_minutes ? `${workflow.time_saved_minutes}+` : 'tons of';

  // Share on Twitter/X
  const shareOnTwitter = () => {
    const text = `Just used this free ${workflow.title} - saved me ${timeSavedText} minutes of work. Check it out:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  // Copy share link
  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: '🔗 Link copied!',
      description: 'Share this workflow with others.',
    });
  };

  // Native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: workflow.title,
          text: `Check out this ${workflow.title} - saves ${timeSavedText} min of work`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error - fallback to copy
        copyShareLink();
      }
    } else {
      copyShareLink();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Input Section */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white">
              Create Your {workflow.title.replace(/Generator|Creator|Builder/gi, '').trim()}
            </CardTitle>
            {promptStep.description && (
              <p className="text-sm text-zinc-400 mt-1">{promptStep.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            {promptStep.fields.map((field, index) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-white text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input
                    id={`field-${field.name}`}
                    placeholder={field.placeholder}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                )}
                
                {field.type === 'textarea' && (
                  <Textarea
                    id={`field-${field.name}`}
                    placeholder={field.placeholder}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px] focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <div id={`field-${field.name}`} className="transition-all duration-200">
                    <Select
                      value={fieldValues[field.name] || ''}
                      onValueChange={(value) => handleFieldChange(field.name, value)}
                    >
                      <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {field.options.map(option => (
                          <SelectItem 
                            key={option} 
                            value={option} 
                            className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}

            {/* Generate Button */}
            <div className="pt-4">
              {/* Wrapper div to capture clicks on "disabled" button */}
              <div 
                onClick={!areAllFieldsFilled ? handleDisabledClick : undefined}
                className={!areAllFieldsFilled ? 'cursor-pointer' : ''}
              >
                <Button
                  onClick={areAllFieldsFilled ? generatePrompt : undefined}
                  disabled={!areAllFieldsFilled}
                  className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white disabled:!bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base font-medium pointer-events-auto"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Prompt
                </Button>
              </div>
              
              {!areAllFieldsFilled && (
                <p className="text-xs text-zinc-500 text-center mt-2">
                  Fill in all required fields to generate your prompt
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Prompt Result */}
        {promptGenerated && (
          <Card id="prompt-result" className="border-green-500/30 bg-zinc-900/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Your Prompt is Ready
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="!text-zinc-400 hover:!text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Start Over
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Prompt Display */}
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 mb-4 max-h-[400px] overflow-y-auto">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
              
              {/* Action Buttons (visible inline) */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCopyPrompt}
                  variant="outline"
                  className="flex-1 !border-zinc-700 !text-white hover:!bg-zinc-800 h-11"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
                <Button
                  onClick={handleOpenChatGPT}
                  className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white h-11"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Use in ChatGPT
                </Button>
              </div>

              {/* Share Section */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {workflow.time_saved_minutes && workflow.time_saved_minutes > 0 && (
                    <p className="text-sm text-zinc-400">
                      💡 This workflow saves ~{workflow.time_saved_minutes} min of work
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">Share:</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={shareOnTwitter}
                      className="h-8 w-8 !text-zinc-400 hover:!text-white hover:!bg-zinc-800"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={shareOnLinkedIn}
                      className="h-8 w-8 !text-zinc-400 hover:!text-white hover:!bg-zinc-800"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleNativeShare}
                      className="h-8 w-8 !text-zinc-400 hover:!text-white hover:!bg-zinc-800"
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

