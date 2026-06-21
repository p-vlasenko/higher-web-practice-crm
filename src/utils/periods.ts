export type Period = 'today' | 'week' | 'month' | 'quarter';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getPeriodStart(period: Period, now = new Date()) {
  const current = startOfDay(now);
  if (period === 'today') return current;

  if (period === 'week') {
    const day = current.getDay() || 7;

    return new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate() - day + 1,
    );
  }

  if (period === 'month')
    return new Date(current.getFullYear(), current.getMonth(), 1);

  const quarterMonth = Math.floor(current.getMonth() / 3) * 3;

  return new Date(current.getFullYear(), quarterMonth, 1);
}

export function isWithinPeriod(
  value: string | undefined,
  period: Period,
  now = new Date(),
) {
  if (!value) return false;

  const date = new Date(value);

  return date >= getPeriodStart(period, now) && date <= now;
}

export function isDateInRange(
  value: string | undefined,
  from?: string,
  to?: string,
) {
  if (!value) return false;

  const time = new Date(value).getTime();

  return (
    (!from || time >= new Date(from).getTime()) &&
    (!to || time <= new Date(to).getTime())
  );
}
