'use client';

import { FileText, Users, Clock, Package, CheckCircle, ArrowRight } from 'lucide-react';
import type { Workflow, SOPDetails } from '@/lib/types/workflow';

interface SOPOverviewProps {
  workflow: Workflow & { sop_details: SOPDetails | null };
  onStart: () => void;
}

export function SOPOverview({ workflow, onStart }: SOPOverviewProps) {
  const stepCount = workflow.steps?.length || 0;
  const sopDetails = workflow.sop_details;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium">
          <FileText className="w-4 h-4" />
          Multi-Step SOP
        </div>
        <h1 className="text-3xl font-bold text-white">{workflow.title}</h1>
        <p className="text-lg text-zinc-400">{workflow.description}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-500">For</p>
          <p className="text-sm text-white font-medium">{sopDetails?.target_role || 'All roles'}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-500">Duration</p>
          <p className="text-sm text-white font-medium">~{workflow.estimated_minutes} min · {stepCount} Steps</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <Package className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-500">Outcome</p>
          <p className="text-sm text-white font-medium">Ready-to-use content</p>
        </div>
      </div>

      {/* Prerequisites */}
      {sopDetails?.prerequisites && sopDetails.prerequisites.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Before you start
          </h3>
          <ul className="space-y-2">
            {sopDetails.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start gap-3 text-zinc-300">
                <span className="text-green-400 mt-1">•</span>
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What You'll Create */}
      {sopDetails?.outcome_description && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            What you'll create
          </h3>
          <p className="text-zinc-300">{sopDetails.outcome_description}</p>
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
        <p className="text-sm text-zinc-500 mt-3">
          Your progress will be saved automatically.
        </p>
      </div>

    </div>
  );
}

