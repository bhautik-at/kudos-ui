export interface AnalyticsEntityProps {
  id?: string;
  name: string;
  count: number;
  percentage: number;
}

export class AnalyticsEntity {
  readonly id?: string;
  readonly name: string;
  readonly count: number;
  readonly percentage: number;

  constructor(props: AnalyticsEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.count = props.count;
    this.percentage = props.percentage;

    this.validate();
  }

  private validate(): void {
    if (this.count < 0) {
      throw new Error('Count cannot be negative');
    }

    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
  }
}
