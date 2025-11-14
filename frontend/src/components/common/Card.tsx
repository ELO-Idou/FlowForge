import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => (
  <section className="bg-neutral-dark rounded-xl border border-neutral-gray800 p-2xl grid gap-md">
    {title ? <h3 className="text-lg font-semibold text-neutral-white">{title}</h3> : null}
    {description ? <p className="text-sm text-neutral-gray400">{description}</p> : null}
    <div>{children}</div>
  </section>
);
