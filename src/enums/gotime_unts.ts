export enum GoTimeUnit {
  minute = 'm',
  hour = 'h',
  day = 'd',
  week = 'w',
  month = 'M',
  year = 'y',
}

export const GoTimeUnits: ReadonlyArray<GoTimeUnit> = Object.values(GoTimeUnit)
