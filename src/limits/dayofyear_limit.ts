import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit } from '../enums/gotime_unts'
import { GoTimeLimit } from './_limit'

export class DayOfYearLimit extends GoTimeLimit {
  readonly part = GoTimePart.dayOfYear

  protected getCurrentValue(date: Date): number {
    const doy = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
    return doy
  }

  protected override computeUnit() {
    return GoTimeUnit.day
  }

  protected toNumber(n: string): number {
    const result = super.toNumber(n)
    if (isNaN(result) || result < 0 || result > 365) throw new Error(`Invalid day of year ${n}`)
    return result
  }
}
