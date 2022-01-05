import { GoTimeOperator, GoTimeOperators } from './enums/gotime_operator'
import { GoTimePart, GoTimeParts } from './enums/gotime_parts'
import { DayOfMonthLimit } from './limits/dayofmonth_limit'
import { DayOfWeekLimit } from './limits/dayofweek_limit'
import { DayOfYearLimit } from './limits/dayofyear_limit'
import { GoTimeLimit } from './limits/_limit'
import { MonthLimit } from './limits/month_limit'
import { WeekOfMonthLimit } from './limits/weekofmonth_limit'
import { WeekOfYearLimit } from './limits/weekofyear_limit'
import { YearLimit } from './limits/year_limit'
import { TimeLimit } from './limits/time_limit'

export class GoTime {
  constructor(definition: string) {
    this.parse(definition)
  }

  public test(date: Date): boolean {
    let result = false
    for (const key in this.limits) {
      const limits = this.limits[key as GoTimePart]
      if (limits) {
        var test = false
        for (const limit of limits) {
          if (limit.test(date)) {
            test = true
            break
          }
        }
        if (!test) {
          result = false
          break
        }
        result = true
      }
    }
    return result
  }

  private limits: { [part in GoTimePart]?: Array<GoTimeLimit> } = {}

  private readonly defParse = new RegExp(`\\s*(${GoTimeParts.join('|')})\\s*(${GoTimeOperators.join('|')})\\s*([^;\\r\\n]+)[;\\r\\n\\s]*`, 'gmi')

  private parse(definition: string) {
    definition = definition.toLowerCase()
    const matches = [...definition.matchAll(this.defParse)]
    if (!matches?.length) {
      throw new Error(`Unable to parse GoTime definition.`)
    }
    for (const match of matches) {
      if (match.length !== 4) {
        throw new Error(`Unable to parse GoTime definition segment "${match[0]}".`)
      }
      const part = this.parsePart(match[1])
      const op = this.parseOperator(match[2])
      const value = match[3]
      let limit: GoTimeLimit | null = null
      switch (part) {
        case GoTimePart.year:
          limit = new YearLimit(op, value)
          break
        case GoTimePart.month:
          limit = new MonthLimit(op, value)
          break
        case GoTimePart.weekOfYear:
          limit = new WeekOfYearLimit(op, value)
          break
        case GoTimePart.weekOfMonth:
          limit = new WeekOfMonthLimit(op, value)
          break
        case GoTimePart.dayOfYear:
          limit = new DayOfYearLimit(op, value)
          break
        case GoTimePart.dayOfMonth:
          limit = new DayOfMonthLimit(op, value)
          break
        case GoTimePart.dayOfWeek:
          limit = new DayOfWeekLimit(op, value)
          break
        case GoTimePart.time:
          limit = new TimeLimit(op, value)
          break
      }
      if (limit) {
        if (this.limits[part] === undefined) {
          this.limits[part] = new Array<GoTimeLimit>()
        }
        this.limits[part]?.push(limit)
      }
    }
  }

  private parsePart(part: string): GoTimePart {
    if (!GoTimeParts.includes(part as GoTimePart)) {
      throw new Error(`Unknown GoTime part "${part}".`)
    }
    return part as GoTimePart
  }

  private parseOperator(op: string): GoTimeOperator {
    if (!GoTimeOperators.includes(op as GoTimeOperator)) {
      throw new Error(`Unknown GoTime operator "${op}".`)
    }
    return op as GoTimeOperator
  }
}
