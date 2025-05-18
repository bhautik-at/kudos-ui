export interface KeywordEntityProps {
  keyword: string;
  count: number;
  percentage: number;
}

export class KeywordEntity {
  readonly keyword: string;
  readonly count: number;
  readonly percentage: number;

  constructor(props: KeywordEntityProps) {
    this.keyword = props.keyword;
    this.count = props.count;
    this.percentage = props.percentage;

    this.validate();
  }

  private validate(): void {
    if (!this.keyword.trim()) {
      throw new Error('Keyword cannot be empty');
    }

    if (this.count < 0) {
      throw new Error('Count cannot be negative');
    }

    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
  }
}
