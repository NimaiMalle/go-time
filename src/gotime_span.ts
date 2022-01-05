export class GoTimeSpan {
  value: number
  end?: number

  constructor(value: number, end?: number) {
    if (end !== undefined && value >= end) {
      this.end = value
      this.value = end
    } else {
      this.value = value
      this.end = end
    }
  }

  public includes(value: number): boolean {
    return this.end === undefined ? value === this.value : value >= this.value && value < this.end
  }
}
