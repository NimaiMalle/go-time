import { GoTimeMonths } from '../enums/gotime_month'
import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeLimit } from './_limit'

export class MonthLimit extends GoTimeLimit {
  readonly part = GoTimePart.month

  protected getCurrentValue(date: Date): number {
    return date.getMonth() + 1
  }

  protected toNumber(n: string): number {
    let result = super.toNumber(n)
    if (!isNaN(result)) {
      if (result < 1 || result > 12) throw new Error(`Invalid month ${n}`)
    } else {
      const asMonth = GoTimeMonths.indexOf(n.slice(0, 3))
      if (asMonth >= 0) {
        result = asMonth + 1
      } else {
        throw new Error(`Invalid month ${n}`)
      }
    }
    return result
  }
}
