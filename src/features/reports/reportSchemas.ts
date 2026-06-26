import { z } from 'zod';

export const reportPeriods = ['week', 'month', 'quarter'] as const;
export const reportDealStatuses = [
  'new',
  'in_progress',
  'completed',
  'cancelled',
] as const;

const optionalFilterString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
);

export const reportFilterSchema = z
  .object({
    period: z.enum(reportPeriods).default('week'),
    dateFrom: optionalFilterString,
    dateTo: optionalFilterString,
    dealStatus: z
      .preprocess(
        (value) => (value === '' ? undefined : value),
        z.enum(reportDealStatuses).optional(),
      )
      .optional(),
    managerId: optionalFilterString,
  })
  .refine(
    (values) =>
      !values.dateFrom ||
      !values.dateTo ||
      new Date(values.dateFrom) <= new Date(values.dateTo),
    {
      message: 'Дата начала не может быть позже даты окончания',
      path: ['dateTo'],
    },
  );

export type ReportFilterValues = z.infer<typeof reportFilterSchema>;
