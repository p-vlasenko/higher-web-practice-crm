import { describe, expect, it } from '@jest/globals';

import { formatCurrency, formatPhone } from '../utils/formatters';
import {
  createClientOptions,
  createDealOptions,
  createUserOptions,
} from '../utils/optionReadModels';
import { getPeriodStart, isDateInRange } from '../utils/periods';
import {
  createDealTableRows,
  createTaskTableRows,
} from '../utils/relationReadModels';

const adaUser = {
  id: 'u1',
  accountName: 'ada',
  email: 'ada@example.test',
  firstName: 'Ada',
  lastName: 'Lovelace',
  password: 'password',
  createdAt: '2026-06-01',
};

describe('shared utilities', () => {
  it('formats currency and phone values', () => {
    expect(formatCurrency(120000)).toContain('120');
    expect(formatPhone('+79990001122')).toBe('+7 (999) 000-11-22');
  });

  it('calculates calendar periods and date ranges', () => {
    const monthStart = getPeriodStart('month', new Date('2026-06-09T12:00:00'));
    expect(monthStart.getFullYear()).toBe(2026);
    expect(monthStart.getMonth()).toBe(5);
    expect(monthStart.getDate()).toBe(1);
    expect(isDateInRange('2026-06-09', '2026-06-01', '2026-06-30')).toBe(true);
  });

  it('adds relation display fields to deal and task table rows', () => {
    const dealRows = createDealTableRows(
      [
        {
          id: 'd1',
          title: 'Big Renewal',
          clientId: 'c1',
          amount: 120000,
          status: 'new',
          createdAt: '2026-06-01',
          createdBy: 'u1',
        },
        {
          id: 'd2',
          title: 'Orphan Deal',
          clientId: 'missing',
          amount: 80000,
          status: 'in_progress',
          createdAt: '2026-06-02',
          createdBy: 'u1',
        },
      ],
      [
        {
          id: 'c1',
          name: 'Acme',
          company: 'Acme Inc.',
          email: 'sales@acme.test',
          phone: '+79990001122',
          createdAt: '2026-06-01',
          createdBy: 'u1',
        },
      ],
    );

    expect(dealRows.map((deal) => deal.clientName)).toEqual([
      'Acme',
      'Удалённый клиент',
    ]);

    const taskRows = createTaskTableRows(
      [
        {
          id: 't1',
          title: 'Prepare docs',
          dealId: 'd1',
          assigneeId: 'u1',
          status: 'new',
          createdAt: '2026-06-03',
          createdBy: 'u1',
        },
        {
          id: 't2',
          title: 'Standalone follow-up',
          assigneeId: 'missing',
          status: 'in_progress',
          createdAt: '2026-06-04',
          createdBy: 'u1',
        },
      ],
      dealRows,
      [adaUser],
    );

    expect(taskRows.map((task) => [task.dealTitle, task.assigneeName])).toEqual(
      [
        ['Big Renewal', 'Ada Lovelace'],
        ['-', '-'],
      ],
    );
  });

  it('builds lightweight entity options for forms', () => {
    expect(
      createClientOptions([
        {
          id: 'c1',
          name: 'Acme',
          company: 'Acme Inc.',
          email: 'sales@acme.test',
          phone: '+79990001122',
          createdAt: '2026-06-01',
          createdBy: 'u1',
        },
      ]),
    ).toEqual([{ value: 'c1', label: 'Acme · Acme Inc.' }]);

    expect(
      createDealOptions([
        {
          id: 'd1',
          title: 'Big Renewal',
          clientId: 'c1',
          amount: 120000,
          status: 'new',
          createdAt: '2026-06-01',
          createdBy: 'u1',
        },
      ]),
    ).toEqual([{ value: 'd1', label: 'Big Renewal' }]);

    expect(
      createUserOptions([adaUser]),
    ).toEqual([{ value: 'u1', label: 'Ada Lovelace' }]);
  });
});
