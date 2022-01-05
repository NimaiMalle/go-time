export enum GoTimeOperator {
  equals = '=',
  lessEq = '<=',
  greaterEq = '>=',
  less = '<',
  greater = '>',
}

export const GoTimeOperators: ReadonlyArray<GoTimeOperator> = Object.values(GoTimeOperator)
