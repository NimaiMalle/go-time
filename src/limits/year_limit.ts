import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit } from '../enums/gotime_unts'
import { GoTimeLimit } from './_limit'

export class YearLimit extends GoTimeLimit {
  readonly part = GoTimePart.year

  protected getCurrentValue(date: Date): number {
    return date.getFullYear()
  }

  protected override computeUnit() {
    return GoTimeUnit.year
  }

  protected toNumber(n: string): number {
    const result = super.toNumber(n)
    if (isNaN(result) || result < 1970 || result > 2099) throw new Error(`Invalid year ${n}`)
    return result
  }
}
