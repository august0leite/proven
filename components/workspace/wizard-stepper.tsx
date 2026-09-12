type WizardStepperProps = {
  steps: string[];
  currentStep: number;
};

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={step}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              isActive
                ? "border-[#111111] bg-[#111111] text-white"
                : isCompleted
                  ? "border-[#2F6B5A]/20 bg-[#2F6B5A]/10 text-[#244D42]"
                  : "border-black/10 bg-white text-[#111111]/55"
            }`}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{index + 1}</div>
            <div className="mt-2 font-medium">{step}</div>
          </div>
        );
      })}
    </div>
  );
}
