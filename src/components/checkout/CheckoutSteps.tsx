'use client';
import { useLang } from '@/hooks/useLang';

export default function CheckoutSteps({ currentStep }: { currentStep: number }) {
  const { t } = useLang();

  const STEPS = [
    { id: 1, label: t('checkout.steps.shipping') },
    { id: 2, label: t('checkout.steps.payment') },
    { id: 3, label: t('checkout.steps.confirmation') },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id < currentStep
                  ? 'bg-accent text-white'
                  : step.id === currentStep
                    ? 'bg-accent text-white ring-2 ring-accent/40 ring-offset-2 ring-offset-bg-base'
                    : 'bg-bg-subtle text-text-muted border border-border'
              }`}
            >
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span className={`text-xs mt-1 font-medium ${step.id <= currentStep ? 'text-text-primary' : 'text-text-muted'}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-16 mx-2 mb-4 ${step.id < currentStep ? 'bg-accent' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
