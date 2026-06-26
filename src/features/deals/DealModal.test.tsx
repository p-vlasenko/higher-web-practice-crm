import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, jest } from '@jest/globals';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import { crmTheme } from '../../styles/theme';
import { DealModal } from './DealModal';
import type { DealFormValues } from './dealSchemas';

jest.mock('../../components/ui/Modal', () => ({
  CrmModal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../components/ui/FormFields', () => ({
  CrmTextInput: ({
    label,
    ...props
  }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
    <label>
      {label}
      <input aria-label={label} {...props} />
    </label>
  ),
  CrmNumberInput: ({
    label,
    ...props
  }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
    <label>
      {label}
      <input aria-label={label} type='number' {...props} />
    </label>
  ),
  CrmSelect: ({
    data,
    label,
    ...props
  }: {
    data: Array<{ value: string; label: string }>;
    label: string;
  } & SelectHTMLAttributes<HTMLSelectElement>) => (
    <label>
      {label}
      <select aria-label={label} {...props}>
        {data.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  ),
  CrmTextarea: ({
    label,
    ...props
  }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <label>
      {label}
      <textarea aria-label={label} {...props} />
    </label>
  ),
}));

const clientOptions = [{ value: 'client-1', label: 'Client One' }];

function getInput(name: string) {
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]`,
  );

  if (!input) {
    throw new Error(`Input "${name}" not found`);
  }

  return input;
}

function renderDealModal() {
  const handleSubmit: (values: DealFormValues) => void = () => undefined;

  return render(
    <MantineProvider theme={crmTheme}>
      <DealModal
        opened
        clientOptions={clientOptions}
        onClose={jest.fn()}
        onSubmit={handleSubmit}
      />
    </MantineProvider>,
  );
}

describe('DealModal', () => {
  it('shows completion dates for completed deals and limits completion date', async () => {
    const user = userEvent.setup();

    renderDealModal();

    expect(document.querySelector('input[name="createdAt"]')).toBeNull();
    expect(document.querySelector('input[name="completedAt"]')).toBeNull();

    await user.selectOptions(screen.getByLabelText('Статус'), 'completed');

    const createdAt = getInput('createdAt');
    const completedAt = getInput('completedAt');

    await user.clear(createdAt);
    await user.type(createdAt, '2026-01-10');

    await waitFor(() => {
      expect(completedAt.getAttribute('min')).toBe('2026-01-11');
    });
  });
});
