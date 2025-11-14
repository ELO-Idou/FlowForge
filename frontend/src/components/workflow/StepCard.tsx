interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  learningTip?: string;
}

export const StepCard = ({ stepNumber, title, description, learningTip }: StepCardProps) => (
  <article className="relative rounded-2xl border border-neutral-gray800 bg-neutral-dark/80 p-2xl glass-card shadow-card overflow-visible">
    <span className="absolute left-2xl -top-2 rounded-full bg-primary-yellow px-md py-xs text-sm font-semibold text-neutral-darkest shadow-glow">
      Step {stepNumber}
    </span>
    <h3 className="mt-lg text-lg font-semibold text-neutral-white">{title}</h3>
    <p className="mt-sm text-sm text-neutral-gray300">{description}</p>
    {learningTip ? (
      <p className="mt-md rounded-xl border border-neutral-gray700/80 bg-neutral-darkest/70 px-md py-sm text-xs text-neutral-gray400">
        <span className="font-semibold text-neutral-gray100">Pro tip:</span> {learningTip}
      </p>
    ) : null}
  </article>
);
