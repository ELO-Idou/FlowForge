import { ChangeEvent, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  className?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ label, id, className, ...props }: InputProps) => {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label htmlFor={inputId} className="grid gap-xs text-neutral-gray100">
      <span className="text-sm font-medium text-neutral-gray300">{label}</span>
      <input
        id={inputId}
        className={`rounded-lg bg-neutral-darkest border border-neutral-gray700 px-xl py-sm text-neutral-white focus:outline-none focus:ring-2 focus:ring-primary-yellow/60 ${className ?? ''}`.trim()}
        {...props}
      />
    </label>
  );
};
