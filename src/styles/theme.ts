import {
  Button,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  TextInput,
  Textarea,
  createTheme,
} from '@mantine/core';

export const crmTheme = createTheme({
  fontFamily: 'Inter, Arial, sans-serif',
  headings: {
    fontFamily: 'Roboto, Inter, Arial, sans-serif',
    sizes: {
      h1: { fontSize: '30px', lineHeight: '36px', fontWeight: '700' },
      h2: { fontSize: '24px', lineHeight: '32px', fontWeight: '700' },
      h3: { fontSize: '20px', lineHeight: '28px', fontWeight: '700' },
    },
  },
  colors: {
    crmBlue: [
      '#eff6ff',
      '#dbeafe',
      '#bfdbfe',
      '#93c5fd',
      '#60a5fa',
      '#3b82f6',
      '#2563eb',
      '#1d4ed8',
      '#1e40af',
      '#1e3a8a',
    ],
  },
  primaryColor: 'crmBlue',
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
  },
  defaultRadius: 'sm',
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 'sm',
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        radius: 'xs',
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        radius: 'xs',
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: 'xs',
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        radius: 'xs',
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: 'xs',
      },
    }),
  },
});
