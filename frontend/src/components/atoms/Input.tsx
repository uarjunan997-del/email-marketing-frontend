import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({label, error, className, id, ...rest}, ref) => {
  const inputId = id || rest.name || label?.replace(/\s+/g,'-').toLowerCase();
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium">{label}</label>}
      <input ref={ref} id={inputId} className={clsx('rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-primary-500 disabled:opacity-60', error && 'border-red-500 focus:ring-red-500', className)} {...rest} />
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export default Input;
