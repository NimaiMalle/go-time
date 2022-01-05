export enum GoTimeDay {
  mon = 1,
  tue = 2,
  wed = 3,
  thu = 4,
  fri = 5,
  sat = 6,
  sun = 7,
}

export const GoTimeDays: ReadonlyArray<string> = Object.keys(GoTimeDay).filter((e) => isNaN(parseInt(e)))
