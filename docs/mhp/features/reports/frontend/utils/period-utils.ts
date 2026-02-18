import { PeriodPreset, PeriodRange } from '../types/reports.types';

export function getPeriodRange(preset: PeriodPreset): PeriodRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const format = (d: Date) => d.toISOString().split('T')[0];

  switch (preset) {
    case 'day': {
      return {
        startDate: format(today),
        endDate: format(today),
      };
    }
    case 'week': {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return {
        startDate: format(weekStart),
        endDate: format(weekEnd),
      };
    }
    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        startDate: format(monthStart),
        endDate: format(monthEnd),
      };
    }
    case 'custom':
    default:
      return {
        startDate: format(today),
        endDate: format(today),
      };
  }
}
