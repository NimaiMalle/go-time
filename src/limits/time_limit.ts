import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeLimit } from './_limit'

export class TimeLimit extends GoTimeLimit {
  readonly part = GoTimePart.time

  protected getCurrentValue(date: Date): number {
    return date.getHours() * 60 + date.getMinutes()
  }

  protected toNumber(n: string): number {
    const hoursMinutes = n.split(':')
    const hours = parseInt(hoursMinutes[0].trim())
    const minutes = parseInt(hoursMinutes[1].trim())
    if (isNaN(hours) || isNaN(minutes)) throw new Error(`Unable to parse time "${n}"`)
    if (hours < 0 || hours > 24) throw new Error(`Invalid hours in time "${n}"`)
    if (minutes < 0 || minutes > 60) throw new Error(`Invalid minutes in time "${n}"`)
    return hours * 60 + minutes
  }
}
