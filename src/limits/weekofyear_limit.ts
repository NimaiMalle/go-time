import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit } from '../enums/gotime_unts'
import { GoTimeLimit } from './_limit'

export class WeekOfYearLimit extends GoTimeLimit {
  readonly part = GoTimePart.weekOfYear

  protected getCurrentValue(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1)
    return Math.ceil(((date.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
  }

  protected override computeUnit() {
    return GoTimeUnit.week
  }

  protected toNumber(n: string): number {
    const result = super.toNumber(n)
    if (isNaN(result) || result < 1 || result > 52) throw new Error(`Invalid week of year ${n}`)
    return result
  }
}
