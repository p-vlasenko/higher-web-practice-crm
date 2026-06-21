import {
  PasswordInput,
  Select,
  TextInput,
  Textarea,
  NumberInput,
} from '@mantine/core';
import type { ComponentProps } from 'react';

import { requiredLabel } from '../../utils/validation';
import classes from './FormFields.module.css';

type BaseProps = {
  label: string;
  required?: boolean;
  error?: string;
};

export function CrmTextInput({
  label,
  required,
  error,
  ...props
}: BaseProps & ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      classNames={{
        root: classes.field,
        label: classes.label,
        input: classes.input,
        error: classes.error,
      }}
      label={required ? requiredLabel(label) : label}
      error={error}
      {...props}
    />
  );
}

export function CrmPasswordInput({
  label,
  required,
  error,
  ...props
}: BaseProps & ComponentProps<typeof PasswordInput>) {
  return (
    <PasswordInput
      classNames={{
        root: classes.field,
        label: classes.label,
        input: classes.input,
        error: classes.error,
      }}
      label={required ? requiredLabel(label) : label}
      error={error}
      {...props}
    />
  );
}

export function CrmTextarea({
  label,
  required,
  error,
  ...props
}: BaseProps & ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      classNames={{
        root: classes.field,
        label: classes.label,
        input: `${classes.input} ${classes.textarea}`,
        error: classes.error,
      }}
      label={required ? requiredLabel(label) : label}
      error={error}
      {...props}
    />
  );
}

export function CrmSelect({
  label,
  required,
  error,
  ...props
}: BaseProps & ComponentProps<typeof Select>) {
  return (
    <Select
      classNames={{
        root: classes.field,
        label: classes.label,
        input: classes.input,
        error: classes.error,
      }}
      label={required ? requiredLabel(label) : label}
      error={error}
      {...props}
    />
  );
}

export function CrmNumberInput({
  label,
  required,
  error,
  ...props
}: BaseProps & ComponentProps<typeof NumberInput>) {
  return (
    <NumberInput
      classNames={{
        root: classes.field,
        label: classes.label,
        input: classes.input,
        error: classes.error,
      }}
      label={required ? requiredLabel(label) : label}
      error={error}
      {...props}
    />
  );
}
