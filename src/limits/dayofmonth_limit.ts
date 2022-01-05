import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeLimit } from './_limit'

export class DayOfMonthLimit extends GoTimeLimit {
  readonly part = GoTimePart.dayOfMonth

  protected getCurrentValue(date: Date): number {
    return date.getDate()
  }

  protected toNumber(n: string): number {
    const result = super.toNumber(n)
    if (isNaN(result) || result < 1 || result > 32) throw new Error(`Invalid day of month ${n}`)
    return result
  }
}
