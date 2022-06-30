import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit, GoTimeUnits } from '../enums/gotime_unts'
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

  protected override computeUnit() {
    let unitIndex = GoTimeUnits.length - 1
    for (const span of this.values) {
      let i = unitIndex
      if (span.end !== undefined) {
        const diffMinutes = (span.end - span.value) / (60 * 1000)
        if (diffMinutes < 365 * 24 * 60) {
          if (diffMinutes < 31 * 24 * 60) {
            if (diffMinutes < 24 * 60) {
              if (diffMinutes < 60) {
                if (diffMinutes <= 0) throw new Error(`Start and End datetime may not be the same.`)
                else i = GoTimeUnits.indexOf(GoTimeUnit.minute)
              } else i = GoTimeUnits.indexOf(GoTimeUnit.hour)
            } else i = GoTimeUnits.indexOf(GoTimeUnit.day)
          } else i = GoTimeUnits.indexOf(GoTimeUnit.month)
        } else i = GoTimeUnits.indexOf(GoTimeUnit.year)
      } else i = GoTimeUnits.indexOf(GoTimeUnit.year)
      if (i < unitIndex) unitIndex = i
    }
    return GoTimeUnits[unitIndex]
  }

  protected toNumber(n: string): number {
    const result = Date.parse(n)
    if (isNaN(result)) throw new Error(`Invalid datetime ${n}`)
    const date = new Date(result)
    if (date.getMilliseconds() !== 0) throw new Error(`Invalid datetime ${n}.  Can't contain milliseconds.`)
    if (date.getSeconds() !== 0) throw new Error(`Invalid datetime ${n}.  Can't contain seconds.`)
    return result
  }
}

function findUnit(date: Date): GoTimeUnit {
  if (date.getMinutes() == 0) {
    if (date.getHours() == 0) {
      if (date.getDate() == 1) {
        if (date.getMonth() == 0) {
          return GoTimeUnit.year
        }
        return GoTimeUnit.month
      }
      return GoTimeUnit.day
    }
    return GoTimeUnit.hour
  }
  return GoTimeUnit.minute
}
