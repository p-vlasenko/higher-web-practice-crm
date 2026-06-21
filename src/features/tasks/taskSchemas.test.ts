import { describe, expect, test } from '@jest/globals';

import { taskSchema } from './taskSchemas';

describe('task schema', () => {
  test('requires title, assignee, and status', () => {
    expect(
      taskSchema.safeParse({ title: 'Task', assigneeId: 'u', status: 'new' })
        .success,
    ).toBe(true);
    expect(
      taskSchema.safeParse({ title: '', assigneeId: '', status: 'new' })
        .success,
    ).toBe(false);
  });
});
