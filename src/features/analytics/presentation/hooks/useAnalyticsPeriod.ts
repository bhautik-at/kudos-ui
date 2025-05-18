import { useState, useEffect } from 'react';
import { PeriodType } from '../../domain/entities/PeriodEntity';

interface Period {
  type: PeriodType;
  value: number | string;
  label: string;
  startDate: Date;
  endDate: Date;
}

interface UseAnalyticsPeriodProps {
  initialType?: PeriodType;
  initialValue?: number | string;
}

interface UseAnalyticsPeriodResult {
  currentPeriod: Period;
  periodOptions: Period[];
  setPeriodType: (type: PeriodType) => void;
  setPeriodValue: (value: number | string) => void;
}

export const useAnalyticsPeriod = ({
  initialType = 'monthly',
  initialValue,
}: UseAnalyticsPeriodProps = {}): UseAnalyticsPeriodResult => {
  const [periodType, setPeriodType] = useState<PeriodType>(initialType);
  const [periodValue, setPeriodValue] = useState<number | string>(
    initialValue || getCurrentPeriodValue(initialType)
  );
  const [periodOptions, setPeriodOptions] = useState<Period[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<Period>(
    calculatePeriodDates(periodType, periodValue)
  );

  // Generate period options when period type changes
  useEffect(() => {
    const options = generatePeriodOptions(periodType);
    setPeriodOptions(options);

    // If the current value is not valid for this period type, reset to current
    if (!options.some(option => option.value.toString() === periodValue.toString())) {
      const currentValue = getCurrentPeriodValue(periodType);
      setPeriodValue(currentValue);
    }
  }, [periodType]);

  // Update current period when type or value changes
  useEffect(() => {
    setCurrentPeriod(calculatePeriodDates(periodType, periodValue));
  }, [periodType, periodValue]);

  return {
    currentPeriod,
    periodOptions,
    setPeriodType,
    setPeriodValue,
  };
};

// Helper functions

function getCurrentPeriodValue(periodType: PeriodType): number | string {
  const now = new Date();

  switch (periodType) {
    case 'weekly':
      return getWeekNumber(now);
    case 'monthly':
      return now.getMonth() + 1;
    case 'quarterly':
      return Math.floor(now.getMonth() / 3) + 1;
    case 'yearly':
      return now.getFullYear();
    default:
      return 1;
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function calculatePeriodDates(periodType: PeriodType, periodValue: number | string): Period {
  const now = new Date();
  const year = now.getFullYear();
  let startDate: Date;
  let endDate: Date;
  let label: string;

  let week: number;
  let month: number;
  let quarter: number;
  let quarterStartMonth: number;
  let yearValue: number;

  switch (periodType) {
    case 'weekly':
      // Calculate first day of the given week
      week = Number(periodValue);
      startDate = getDateOfWeek(week, year);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      label = `Week ${week}, ${year}`;
      break;

    case 'monthly':
      month = Number(periodValue) - 1; // JS months are 0-indexed
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0); // Last day of month
      label = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      break;

    case 'quarterly':
      quarter = Number(periodValue);
      quarterStartMonth = (quarter - 1) * 3;
      startDate = new Date(year, quarterStartMonth, 1);
      endDate = new Date(year, quarterStartMonth + 3, 0);
      label = `Q${quarter} ${year}`;
      break;

    case 'yearly':
      yearValue = Number(periodValue);
      startDate = new Date(yearValue, 0, 1);
      endDate = new Date(yearValue, 11, 31);
      label = yearValue.toString();
      break;

    default:
      startDate = new Date();
      endDate = new Date();
      label = 'Invalid period';
  }

  return {
    type: periodType,
    value: periodValue,
    label,
    startDate,
    endDate,
  };
}

function getDateOfWeek(week: number, year: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const ISOweekStart = simple;
  if (dayOfWeek <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
}

function generatePeriodOptions(periodType: PeriodType): Period[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const options: Period[] = [];

  switch (periodType) {
    case 'weekly': {
      // Generate options for last 12 weeks
      const currentWeek = getWeekNumber(now);
      const totalWeeksInYear = getWeekNumber(new Date(currentYear, 11, 31));

      for (let i = 0; i < 12; i++) {
        let weekValue = currentWeek - i;
        let yearToUse = currentYear;

        // Handle week values that go to previous year
        if (weekValue <= 0) {
          const lastYearWeeks = getWeekNumber(new Date(currentYear - 1, 11, 31));
          weekValue = lastYearWeeks + weekValue;
          yearToUse = currentYear - 1;
        }

        const period = calculatePeriodDates('weekly', weekValue);
        // Update the label to include the year if different from current
        if (yearToUse !== currentYear) {
          period.label = `Week ${weekValue}, ${yearToUse}`;
        }
        options.push(period);
      }
      break;
    }

    case 'monthly': {
      // Generate options for last 12 months
      const currentMonth = now.getMonth();

      for (let i = 0; i < 12; i++) {
        const monthOffset = currentMonth - i;
        const yearOffset = Math.floor(monthOffset / 12);
        const monthValue =
          monthOffset >= 0 ? (monthOffset % 12) + 1 : 12 + ((monthOffset + 1) % 12);

        const yearToUse = currentYear + yearOffset;
        const period = calculatePeriodDates('monthly', monthValue);

        // Adjust the dates to reflect the correct year
        if (yearToUse !== currentYear) {
          const startDate = new Date(yearToUse, monthValue - 1, 1);
          const endDate = new Date(yearToUse, monthValue, 0);
          period.startDate = startDate;
          period.endDate = endDate;
          period.label = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }

        options.push(period);
      }
      break;
    }

    case 'quarterly': {
      // Generate options for last 4 quarters
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

      for (let i = 0; i < 4; i++) {
        const quarterOffset = currentQuarter - i - 1;
        const yearOffset = Math.floor(quarterOffset / 4);
        const quarterValue =
          quarterOffset >= 0 ? (quarterOffset % 4) + 1 : 4 + ((quarterOffset + 1) % 4);

        const yearToUse = currentYear + yearOffset;

        // Calculate quarter dates manually
        const quarterStartMonth = (quarterValue - 1) * 3;
        const startDate = new Date(yearToUse, quarterStartMonth, 1);
        const endDate = new Date(yearToUse, quarterStartMonth + 3, 0);

        options.push({
          type: 'quarterly',
          value: quarterValue,
          label: `Q${quarterValue} ${yearToUse}`,
          startDate,
          endDate,
        });
      }
      break;
    }

    case 'yearly': {
      // Generate options for last 5 years
      for (let i = 0; i < 5; i++) {
        const yearValue = currentYear - i;
        options.push(calculatePeriodDates('yearly', yearValue));
      }
      break;
    }
  }

  return options;
}
