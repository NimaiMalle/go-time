import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeSpan } from '../gotime_span'
import { GoTimeLimit } from './_limit'

export class DatetimeLimit extends GoTimeLimit {
  readonly part = GoTimePart.datetime

  protected getCurrentValue(date: Date): number {
    return date.getTime()
  }

  protected parseValue(value: string): Array<GoTimeSpan> {
    const result = new Array<GoTimeSpan>()
    const values = value.split(',').map((v) => v.trim())
    for (var val of values) {
      const [start, end] = val.split('|').map((v) => this.toNumber(v.trim()))
      if (start === undefined) {
        throw new Error(`Unable to parse value "${val}"`)
      }
      result.push(new GoTimeSpan(start, end))
    }
    return result
  }

  protected toNumber(n: string): number {
    const result = Date.parse(n)
    if (isNaN(result)) throw new Error(`Invalid datetime ${n}`)
    return result
  }
}
