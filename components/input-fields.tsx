'use client';

import { ComponentProps } from 'react';
import { TextField } from '@radix-ui/themes';
import { useFormContext } from 'react-hook-form';

interface InputFieldProps extends ComponentProps<typeof TextField.Root> {
  name: string;
  label?: string;
}

export const InputField = ({
  name,
  label,
  size = '3',
  ...props
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}
      <TextField.Root id={name} size={size} {...register(name)} {...props} />
      {error && <span className="text-red-700 text-sm">{error}</span>}
    </div>
  );
};
