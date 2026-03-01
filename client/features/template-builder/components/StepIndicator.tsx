// features/template-builder/components/StepIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, HelpCircle, Eye, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Step } from '../template.types';

interface StepIndicatorProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
  completedSteps: Record<Step, boolean>;
}

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'preview', label: 'Preview', icon: Eye },
];

export function StepIndicator({ currentStep, onStepChange, completedSteps }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="px-4 sm:px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-amber-200/50">
      {/* Mobile Step Indicator */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentIndex + 1} of {STEPS.length}
          </span>
          <Badge variant="outline" className="rounded-full">
            {currentStep === 'details' && 'Template Details'}
            {currentStep === 'questions' && 'Build Questions'}
            {currentStep === 'preview' && 'Review & Save'}
          </Badge>
        </div>
        <Progress 
          value={((currentIndex + 1) / STEPS.length) * 100} 
          className="h-2 bg-amber-100"
        />
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden sm:flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps[step.id];
          const isClickable = isCompleted || index <= currentIndex;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <motion.div
                  className={cn(
                    "w-16 h-0.5 transition-colors",
                    index <= currentIndex 
                      ? "bg-gradient-to-r from-amber-500 to-rose-500" 
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                  animate={{ scaleX: index <= currentIndex ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <button
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-3 transition-all group",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                  isActive && "scale-110"
                )}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                    isActive && "ring-2 ring-offset-2 ring-amber-500",
                    isCompleted 
                      ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white" 
                      : isActive
                        ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                  )}
                  whileHover={{ scale: isClickable ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isActive && "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}