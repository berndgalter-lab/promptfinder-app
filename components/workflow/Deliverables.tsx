'use client';

import { Package, Copy, Download, FileText, Mail, CheckSquare, File, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import type { Deliverable } from '@/lib/types/workflow';

interface DeliverablesProps {
  deliverables: Deliverable[];
  completedSteps: number[];
  outputs: Record<number, string>; // step number -> output content
  workflowTitle: string;
}

const formatIcons = {
  text: FileText,
  email: Mail,
  checklist: CheckSquare,
  document: File,
};

export function Deliverables({ deliverables, completedSteps, outputs, workflowTitle }: DeliverablesProps) {
  const { toast } = useToast();

  const copyToClipboard = async (content: string, name: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied!',
        description: `${name} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Please try again',
      });
    }
  };

  const downloadAll = () => {
    const allContent = deliverables
      .filter(d => completedSteps.includes(d.step))
      .map(d => `## ${d.name}\n\n${outputs[d.step] || 'Not completed'}\n\n---\n`)
      .join('\n');

    if (!allContent.trim()) {
      toast({
        title: 'Nothing to download',
        description: 'Complete some steps first',
      });
      return;
    }

    const blob = new Blob([`# ${workflowTitle} - Deliverables\n\n${allContent}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowTitle.toLowerCase().replace(/\s+/g, '-')}-deliverables.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: 'Your deliverables have been saved',
    });
  };

  const completedDeliverables = deliverables.filter(d => completedSteps.includes(d.step));
  const progress = deliverables.length > 0 
    ? Math.round((completedDeliverables.length / deliverables.length) * 100) 
    : 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
          <Package className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-white">Your Deliverables</h3>
          <p className="text-sm text-zinc-400">
            {completedDeliverables.length > 0
              ? `${completedDeliverables.length} of ${deliverables.length} ready`
              : 'Complete steps to unlock'}
          </p>
        </div>
        {/* Progress indicator */}
        <div className="text-right">
          <span className="text-2xl font-bold text-purple-400">{progress}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Deliverables List */}
      <div className="space-y-3">
        {deliverables.map((deliverable, index) => {
          const isComplete = completedSteps.includes(deliverable.step);
          const Icon = formatIcons[deliverable.format] || FileText;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                isComplete 
                  ? "bg-zinc-900/50 border-zinc-700" 
                  : "bg-zinc-800/30 border-zinc-800 opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isComplete ? "bg-green-600/20" : "bg-zinc-800"
                )}>
                  {isComplete ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isComplete ? "text-white" : "text-zinc-500"
                  )}>
                    {deliverable.name}
                  </p>
                  {deliverable.description && (
                    <p className="text-xs text-zinc-500">{deliverable.description}</p>
                  )}
                </div>
              </div>

              {isComplete && outputs[deliverable.step] && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(outputs[deliverable.step], deliverable.name)}
                  className="text-zinc-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Download Button */}
      {completedDeliverables.length > 0 && (
        <Button 
          onClick={downloadAll} 
          className="w-full mt-6 !bg-zinc-800 hover:!bg-zinc-700 !text-white"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download All as Markdown
        </Button>
      )}
    </div>
  );
}

