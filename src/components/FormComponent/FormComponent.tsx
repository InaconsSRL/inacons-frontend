import React, { ReactNode } from 'react';
import { UseFormReturn } from '@tanstack/react-form';

interface GenericFormComponentProps<T> {
  form: UseFormReturn<T>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitButtonText: string;
}

function GenericFormComponent<T>({
  form,
  onSubmit,
  children,
  submitButtonText,
}: GenericFormComponentProps<T>) {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit">{submitButtonText}</button>
    </form>
  );
}

export default GenericFormComponent;