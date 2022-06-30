import { GoTimeOperator } from '../enums/gotime_operator'
import { GoTimePart } from '../enums/gotime_parts'
import { GoTimeUnit } from '../enums/gotime_unts'
import { GoTimeSpan } from '../gotime_span'

export abstract class GoTimeLimit {
  abstract readonly part: GoTimePart
  unit: GoTimeUnit
  readonly operator: GoTimeOperator
  readonly values: ReadonlyArray<GoTimeSpan>

  constructor(op: GoTimeOperator, value: string) {
    this.operator = op
    this.values = this.parseValue(value)
    this.unit = this.computeUnit()
  }

  protected parseValue(value: string): Array<GoTimeSpan> {
    const result = new Array<GoTimeSpan>()
    const values = value.split(',').map((v) => v.trim())
    for (var val of values) {
      const [start, end] = val.split(/[-|]/).map((v) => this.toNumber(v.trim()))
      if (start === undefined) {
        throw new Error(`Unable to parse value "${val}"`)
      }
      result.push(new GoTimeSpan(start, end))
    }
    return result
  }

  // Called after values and operator are set to compute a unit based on the values
  protected abstract computeUnit(): GoTimeUnit

  protected toNumber(n: string): number {
    if (!n) return Number.NaN
    const v = parseFloat(n)
    if (!isNaN(v) && isFinite(v)) return v
    return Number.NaN
  }

  protected abstract getCurrentValue(date: Date): number

  public test(date: Date): boolean {
    let result = false
    const value = this.getCurrentValue(date)
    for (const span of this.values) {
      if (this.operator != GoTimeOperator.equals && span.end !== undefined) {
        if (span.end !== undefined) throw new Error(`Operator ${this.operator} doesn't work with a value range.`)
      }
      switch (this.operator) {
        case GoTimeOperator.equals:
          result = span.includes(value)
          break
        case GoTimeOperator.less:
          result = value < span.value
          break
        case GoTimeOperator.lessEq:
          result = value <= span.value
          break
        case GoTimeOperator.greater:
          result = value > span.value
          break
        case GoTimeOperator.greaterEq:
          result = value >= span.value
          break
      }
      if (result) break
    }
    return result
  }
}

export function goTimeToNumber(n: string): number | undefined {
  if (!n) return undefined
  const v = parseFloat(n)
  if (!isNaN(v) && isFinite(v)) return v
  return undefined
}
