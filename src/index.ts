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
import { DatetimeLimit } from './limits/datetime_limit'
import { GoTimeUnit, GoTimeUnits } from './enums/gotime_unts'

export class GoTime {
  constructor(definition: string) {
    this.parse((this.definition = definition))
    this._unit = this.computeUnit()
  }

  public test(date: Date | null | undefined): boolean {
    if (!date) return false
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
  private definition: string
  private _unit: GoTimeUnit // Biggest step in time we can take when searching ahead
  public get unit() {
    return this._unit
  }

  public toString(): string {
    return this.definition
  }

  protected computeUnit() {
    let unitIndex = GoTimeUnits.length - 1
    for (var key in this.limits) {
      const part = key as GoTimePart
      const limits = this.limits[part]
      if (limits) {
        for (var limit of limits) {
          const index = GoTimeUnits.indexOf(limit.unit)
          if (index < unitIndex) unitIndex = index
        }
      }
    }
    const unit = GoTimeUnits[unitIndex]
    return unit
  }

  /**
   * Returns the next time this Go-Time will be active, or null if no active time is found.  The search is a brute force minute by minute check, so don't pass in large time spans
   * @param {Date} from Optional date to start checking from, or now in UTC
   * @param {Date} to Optional date to give up the search, or a week from now
   * @param {GoTimeUnit} unit Optional unit to step by through time.  Will default to largest step viable based on definition.  Also see `step`
   * @param {number} step Optional step or stride to sample the from-to range.  Make sure this won't skip over a potential active time based on your Go-Time definition.
   */
  public next(from?: Date, to?: Date, unit: GoTimeUnit | null = null, step: number = 1): Date | null {
    if (!unit) {
      unit = this._unit
    }

    let ts: number
    if (from) {
      ts = from.getTime()
    } else {
      // If there's no from time supplied, use "now" in UTC
      const d = new Date()
      const z = d.getTimezoneOffset()
      ts = d.getTime() + z * 60 * 1000
    }
    let d = new Date(ts)
    // Go-Time doesn't go down to second granularity, so zero out seconds and milliseconds
    d.setSeconds(0)
    d.setMilliseconds(0)

    // Depending on the units, we have different functions for moving through time
    // Things like leapyear and days in a month are considered for
    const stepFunctions: { [k in GoTimeUnit]: (v: number) => void } = {
      m: (v: number) => (d = new Date((ts += v * 1000 * 60))),
      h: (v: number) => (d = new Date((ts += v * 1000 * 60 * 60))),
      d: (v: number) => {
        d.setDate(d.getDate() + v)
        ts = d.getTime()
      },
      w: (v: number) => {
        d.setDate(d.getDate() + v * 7)
        ts = d.getTime()
      },
      M: (v: number) => {
        const o = d.getDate()
        d.setMonth(d.getMonth() + v)
        if (d.getDate() != o) d.setDate(0)
        ts = d.getTime()
      },
      y: (v: number) => {
        const o = d.getDate()
        d.setFullYear(d.getFullYear() + v)
        if (d.getDate() != o) d.setDate(0)
        ts = d.getTime()
      },
    }

    // Table of next smaller units
    let unitIndex = GoTimeUnits.indexOf(unit)

    // Step forward in time, until we find a time that is active (tests true)
    let stepFn = stepFunctions[unit]
    const end = to ? to.getTime() : new Date(ts).setDate(new Date(ts).getDate() + 10)
    const start = ts
    while (ts < end) {
      if (this.test(d)) break
      stepFn(step)
    }

    // If we found an active datetime...
    if (ts < end || unit != GoTimeUnit.minute) {
      // If we were stepping in units greater than one minute, we
      //  need start stepping back in successively smaller units
      //  until we get to the first minute that tests true
      let smallerUnits: GoTimeUnit | null = unitIndex >= 0 ? GoTimeUnits[--unitIndex] : null
      stepFn = smallerUnits ? stepFunctions[smallerUnits] : stepFn
      while (smallerUnits) {
        stepFn(-1)
        if (ts < start || !this.test(d)) {
          stepFn(1)
          smallerUnits = unitIndex >= 0 ? GoTimeUnits[--unitIndex] : null
          stepFn = smallerUnits ? stepFunctions[smallerUnits] : stepFn
        }
      }
    }

    // Return null if we didn't find an active time
    return ts >= end ? null : d
  }

  private static readonly defParse = new RegExp(`\\s*(${GoTimeParts.join('|')})\\s*(${GoTimeOperators.join('|')})\\s*([^;\\r\\n]+)[;\\r\\n\\s]*`, 'gmi')

  private parse(definition: string) {
    definition = definition.toLowerCase()
    const matches = [...definition.matchAll(GoTime.defParse)]
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
        case GoTimePart.datetime:
          limit = new DatetimeLimit(op, value)
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
