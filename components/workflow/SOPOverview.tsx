'use client';

import { FileText, Users, Clock, Package, CheckCircle, ArrowRight, ListChecks, Lightbulb } from 'lucide-react';
import type { Workflow, SOPDetails } from '@/lib/types/workflow';

interface SOPOverviewProps {
  workflow: Workflow & { sop_details: SOPDetails | null };
  onStart: () => void;
}

export function SOPOverview({ workflow, onStart }: SOPOverviewProps) {
  try {
    // Safety check: ensure workflow has required fields
    if (!workflow) {
      console.error('SOPOverview: workflow is undefined or null');
      return <div className="text-red-400 p-4">Error: Workflow data is missing</div>;
    }

    const stepCount = workflow.steps?.length || 0;
    const sopDetails = workflow.sop_details;

    // Safely get prerequisites array
    const prerequisites = (() => {
      try {
        if (!sopDetails?.prerequisites) return [];
        // Handle both array and potentially string formats
        if (Array.isArray(sopDetails.prerequisites)) {
          return sopDetails.prerequisites.filter(Boolean).map(String);
        }
        // If it's a string, try to parse it or return empty array
        return [];
      } catch (error) {
        console.error('Error parsing prerequisites:', error);
        return [];
      }
    })();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium">
          <FileText className="w-4 h-4" />
          Multi-Step SOP · {stepCount} Steps
        </div>
        <h1 className="text-3xl font-bold text-white">{workflow.title}</h1>
        <p className="text-lg text-zinc-400">{workflow.description}</p>
        
        {/* Quick Start Button - above the fold */}
        <button
          onClick={onStart}
          className="mt-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
        >
          Start This SOP
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-zinc-400 mt-2">
          ~{workflow.estimated_minutes} min · Scroll down to see what's included
        </p>
      </div>

      {/* How this SOP works */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          How this SOP works
        </p>
        <ol className="text-sm text-zinc-400 space-y-1.5 list-decimal list-inside">
          <li>Click "Start This SOP" above</li>
          <li>Open ChatGPT, Claude, or your preferred AI tool</li>
          <li>Keep the <strong className="text-white">same chat</strong> open for all {stepCount} steps</li>
          <li>Copy each prompt → Paste → Get response → Continue</li>
        </ol>
        <p className="text-xs text-zinc-400 mt-3">
          💡 The AI builds on previous responses, so don't start a new chat between steps!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">For</p>
          <p className="text-sm text-white font-medium">{sopDetails?.target_role ? String(sopDetails.target_role) : 'All roles'}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">Duration</p>
          <p className="text-sm text-white font-medium">~{workflow.estimated_minutes} min · {stepCount} Steps</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <Package className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">Outcome</p>
          <p className="text-sm text-white font-medium">Ready-to-use content</p>
        </div>
      </div>

      {/* Prerequisites */}
      {prerequisites.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Before you start
          </h2>
          <ul className="space-y-2">
            {prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start gap-3 text-zinc-300">
                <span className="text-green-400 mt-1">•</span>
                <span>{String(prereq)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What You'll Create */}
      {sopDetails?.outcome_description && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            What you'll create
          </h2>
          <p className="text-zinc-300">{sopDetails.outcome_description ? String(sopDetails.outcome_description) : ''}</p>
        </div>
      )}

      {/* Steps Preview */}
      {workflow.steps && workflow.steps.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-blue-400" />
            What's included ({workflow.steps.length} Steps)
          </h2>
          <div className="space-y-3">
            {workflow.steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-white truncate">{step.title}</h4>
                    {'duration_minutes' in step && step.duration_minutes && (
                      <span className="flex-shrink-0 text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />~{step.duration_minutes} min
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-sm text-zinc-400 line-clamp-2">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Button */}
      <div className="text-center pt-4">
        <button
          onClick={onStart}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start This SOP
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-zinc-400 mt-3">
          Your progress will be saved automatically.
        </p>
      </div>

    </div>
    );
  } catch (error) {
    console.error('SOPOverview render error:', error);
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error loading SOP Overview</h2>
          <p className="text-zinc-400 text-sm">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

