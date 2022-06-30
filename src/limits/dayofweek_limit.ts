import { GoTimeDays } from '../enums/gotime_day'
import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit } from '../enums/gotime_unts'
import { GoTimeLimit } from './_limit'

export class DayOfWeekLimit extends GoTimeLimit {
  readonly part = GoTimePart.dayOfWeek

  protected getCurrentValue(date: Date): number {
    const dow = date.getDay()
    return dow === 0 ? 7 : dow // 1 = Monday, 7 = Sunday
  }

  protected override computeUnit() {
    return GoTimeUnit.day
  }

  protected toNumber(n: string): number {
    let result = super.toNumber(n)
    if (!isNaN(result)) {
      if (result < 1 || result > 7) throw new Error(`Invalid day of week ${n}`)
    } else {
      const asDay = GoTimeDays.indexOf(n.slice(0, 3))
      if (asDay >= 0) {
        result = asDay + 1
      } else {
        throw new Error(`Invalid day of week ${n}`)
      }
    }
    return result
  }
}
