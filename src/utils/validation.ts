import { z } from 'zod';

export const requiredString = (message = 'Обязательное поле') =>
  z.string().trim().min(1, message);

export const emailSchema = requiredString().email('Введите корректный email');

export const passwordSchema = requiredString().min(6, 'Минимум 6 символов');

export const phoneSchema = requiredString().regex(
  /^\+?\d[\d\s()-]{9,}$/,
  'Введите корректный телефон',
);

export const urlSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => {
    if (!value) return true;
    try {
      const normalized = value.startsWith('http') ? value : `https://${value}`;
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  }, 'Введите корректный сайт');

export const nonNegativeAmountSchema = z
  .number()
  .min(0, 'Сумма не может быть отрицательной');

export function requiredLabel(label: string) {
  return `${label} *`;
}
