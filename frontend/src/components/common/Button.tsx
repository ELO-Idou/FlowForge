import { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className: customClassName,
  children,
  ...rest
}: ButtonProps) => (
  <button
    className={clsx(
      'rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-yellow/60',
      {
        primary: 'bg-primary-yellow text-neutral-darkest hover:bg-primary-yellowHover',
        ghost: 'bg-transparent text-neutral-white border border-neutral-gray700 hover:border-neutral-gray500',
      }[variant],
      {
        md: 'px-xl py-sm text-body',
        lg: 'px-2xl py-md text-lg',
      }[size],
      customClassName,
    )}
    {...rest}
  >
    {children}
  </button>
);
