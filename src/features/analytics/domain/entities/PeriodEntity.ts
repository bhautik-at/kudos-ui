export type PeriodType = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PeriodEntityProps {
  type: PeriodType;
  value: number | string;
  startDate: Date;
  endDate: Date;
}

export class PeriodEntity {
  readonly type: PeriodType;
  readonly value: number | string;
  readonly startDate: Date;
  readonly endDate: Date;

  constructor(props: PeriodEntityProps) {
    this.type = props.type;
    this.value = props.value;
    this.startDate = props.startDate;
    this.endDate = props.endDate;

    this.validate();
  }

  private validate(): void {
    if (!['weekly', 'monthly', 'quarterly', 'yearly'].includes(this.type)) {
      throw new Error('Invalid period type');
    }

    if (this.startDate > this.endDate) {
      throw new Error('Start date cannot be after end date');
    }
  }
}
