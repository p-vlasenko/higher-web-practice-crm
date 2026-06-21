import { z } from 'zod';

export const reportFilterSchema = z
  .object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    dealStatus: z.string().optional(),
    managerId: z.string().optional(),
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
