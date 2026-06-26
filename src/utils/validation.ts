import { z } from 'zod';

export const requiredString = (message = 'Обязательное поле') =>
  z.string().trim().min(1, message);

export const emailSchema = requiredString().email('Введите корректный email');

export const passwordSchema = requiredString().min(6, 'Минимум 6 символов');

export const phoneSchema = requiredString().regex(
  /^\+?\d[\d\s()-]{9,}$/,
  'Введите корректный телефон',
);

const HTTP_PROTOCOL_REGEXP = /^https?:\/\//i;

const getRawHostname = (value: string) => {
  const withoutProtocol = value.replace(HTTP_PROTOCOL_REGEXP, '');
  const [withoutPath] = withoutProtocol.split(/[/?#]/, 1);
  const [hostname] = withoutPath.split(':', 1);

  return hostname;
};

const hasDomain = (hostname: string) => {
  const labels = hostname.split('.');

  return (
    labels.length > 1 &&
    labels.every(Boolean) &&
    labels[labels.length - 1].length >= 2
  );
};

export const urlSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => {
    if (!value) return true;
    try {
      const normalized = HTTP_PROTOCOL_REGEXP.test(value)
        ? value
        : `https://${value}`;
      const hostname = getRawHostname(value);

      new URL(normalized);

      return hasDomain(hostname);
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
