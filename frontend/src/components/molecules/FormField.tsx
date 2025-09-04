import React from 'react';
import { FieldError } from 'react-hook-form';
import { Input, InputProps } from '../atoms/Input';

export interface FormFieldProps extends InputProps {
  errorObj?: FieldError;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(({errorObj, helperText, error, ...rest}, ref) => {
  return <Input ref={ref} error={error || errorObj?.message} {...rest} />;
});
FormField.displayName = 'FormField';

export default FormField;
