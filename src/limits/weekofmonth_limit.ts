import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit } from '../enums/gotime_unts'
import { GoTimeLimit } from './_limit'

export class WeekOfMonthLimit extends GoTimeLimit {
  readonly part = GoTimePart.weekOfMonth

  protected getCurrentValue(date: Date): number {
    const jan1 = new Date(date.getFullYear(), 0, 1)
    const startWeek = Math.ceil(((date.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const week = Math.ceil(((date.getTime() - firstOfMonth.getTime()) / 86400000 + firstOfMonth.getDay() + 1) / 7)
    return week - startWeek
  }

  protected override computeUnit() {
    return GoTimeUnit.week
  }

  protected toNumber(n: string): number {
    const result = super.toNumber(n)
    if (isNaN(result) || result < 1 || result > 5) throw new Error(`Invalid week of month ${n}`)
    return result
  }
}
