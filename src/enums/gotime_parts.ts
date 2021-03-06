export enum GoTimePart {
  year = 'y',
  month = 'm',
  weekOfYear = 'woy',
  weekOfMonth = 'wom',
  dayOfYear = 'doy',
  dayOfMonth = 'dom',
  dayOfWeek = 'dow',
  time = 'time',
  datetime = 'datetime',
}

export const GoTimeParts: ReadonlyArray<GoTimePart> = Object.values(GoTimePart)
