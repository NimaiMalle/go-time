import { GoTime } from '../index'

/*
test.each`
    def                            | date                    | result
    ${'DoM<7; DoW=Sat,Sun'}        | ${'2022-01-01'}         | ${true}
    ${'DoM<7; DoW=Sat,Sun'}        | ${'2022-01-11'}         | ${false}
    ${'DoM<7; DoW=Sat,Sun'}        | ${'2022-02-05'}         | ${true}
`('',({def,date,result})=>{
    expect(new GoTime(def).test(date)).toBe(result);
});
*/

test('Halloween week', () => {
  const definition = 'M=Oct; DoM>=24'
  const goTime = new GoTime(definition)

  // October 20, 2022 is more than a week before Halloween
  expect(goTime.test(new Date(2022, 9, 20))).toBeFalsy()

  // October 24, 2022 is in Halloween week
  expect(goTime.test(new Date(2022, 9, 24))).toBeTruthy()

  // October 31, 2022 is Halloween
  expect(goTime.test(new Date(2022, 9, 31))).toBeTruthy()

  // November 1, 2022 is after Halloween
  expect(goTime.test(new Date(2022, 10, 1))).toBeFalsy()
})

test('First Weekend of the Month', () => {
  const definition = 'DoM<7; DoW=Sat,Sun'
  const goTime = new GoTime(definition)

  // Tue, Jan 11, 2022 is not a first weekend
  expect(goTime.test(new Date(2022, 0, 11))).toBeFalsy()

  // Tue, Jan 1, 2022 is a first Saturday
  expect(goTime.test(new Date(2022, 0, 1))).toBeTruthy()

  // Tue, Jun 5, 2022 is a first Sunday
  expect(goTime.test(new Date(2022, 5, 5))).toBeTruthy()
})

test('Noon to 1PM or Midnight to 1AM GMT', () => {
  const definition = 'Time=00:00-01:00; Time=12:00-13:00'
  const goTime = new GoTime(definition)

  // 6:05PM March 1 2022
  expect(goTime.test(new Date(2022, 2, 1, 18, 5))).toBeFalsy()

  // 12:30AM March 1 2022
  expect(goTime.test(new Date(2022, 2, 1, 0, 30))).toBeTruthy()

  // 12:30PM March 1 2022
  expect(goTime.test(new Date(2022, 2, 1, 12, 30))).toBeTruthy()

  // Midnight March 1 2022
  expect(goTime.test(new Date(2022, 2, 1, 0, 0))).toBeTruthy()

  // 1PM March 1 2022
  expect(goTime.test(new Date(2022, 2, 1, 13, 0))).toBeFalsy()
})

test('Day 46', () => {
  const definition = 'DoY=46'
  const goTime = new GoTime(definition)

  expect(goTime.test(new Date(2022, 1, 14))).toBeFalsy()
  expect(goTime.test(new Date(2022, 1, 15))).toBeTruthy()
  expect(goTime.test(new Date(2022, 1, 16))).toBeFalsy()
})

test('Tuesday through Sunday', () => {
  const definition = 'DoW=Tue-Sun'
  const goTime = new GoTime(definition)

  expect(goTime.test(new Date('2022-4-4'))).toBeFalsy()
  expect(goTime.test(new Date('2022-4-7'))).toBeTruthy()
})

test('Any time, after a certain time', () => {
  const definition = 'Datetime>=2022-03-20 13:00:00'
  const goTime = new GoTime(definition)

  expect(goTime.test(new Date('2022-06-01'))).toBeTruthy()
  expect(goTime.test(new Date('2022-03-20 12:59:00'))).toBeFalsy()
})

test('Any time, between two datetimes', () => {
  const definition = 'Datetime=2022-03-20 13:00:00|2022-03-22 05:30:00'
  const goTime = new GoTime(definition)

  expect(goTime.test(new Date('2022-03-21'))).toBeTruthy()
  expect(goTime.test(new Date('2022-03-20 12:59:00'))).toBeFalsy()
  expect(goTime.test(new Date('2022-03-22 06:00:00'))).toBeFalsy()
})
