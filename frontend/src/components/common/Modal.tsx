import { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, description, isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-2xl">
      <div className="bg-neutral-dark rounded-2xl border border-neutral-gray800 p-2xl max-w-2xl w-full grid gap-lg">
        <header className="grid gap-sm">
          <h2 className="text-h3 font-semibold text-neutral-white">{title}</h2>
          {description ? <p className="text-sm text-neutral-gray400">{description}</p> : null}
        </header>
        <div>{children}</div>
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
