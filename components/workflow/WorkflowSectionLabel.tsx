interface WorkflowSectionLabelProps {
  step: number;
  title: string;
  subtitle?: string;
}

export function WorkflowSectionLabel({ step, title, subtitle }: WorkflowSectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold shrink-0">
        {step}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-zinc-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

