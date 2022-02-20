# Go-Time

GoTime is a simple but powerful library and syntax for defining times when you desire something to be active, and test dates against that definition.

```
.'`~~~~~~~~~~~`'.
(  .'11 12 1'.  )
|  :10 \|   2:  |
|  :9   @   3:  |
|  :8       4;  |
'. '..7 6 5..' .'
 ~-------------~
```

## GoTime Syntax

A GoTime definition is a series of test statements, each following this pattern: `{part}{operator}{value}`

### Part

The first section of a test is the `part`, and it can be one of the following:

| Part code | Meaning                                                    |
| --------- | ---------------------------------------------------------- |
| `y`       | Year. i.e. 2021                                            |
| `m`       | Month. 1 - 12 or Jan or January, etc.                      |
| `woy`     | Week of the Year. 1 - 53                                   |
| `wom`     | Week of the Month. 1 - 5                                   |
| `doy`     | Day of the Year. 1 - 365                                   |
| `dom`     | Day of the Month. 1 - 31                                   |
| `dow`     | Day of the Week. 1 - 7 or Monday or Mon, etc. Monday is 1. |
| `time`    | Time of Day. 00:00 - 23:59 must have hours : minutes       |

### Operator

The second section of a GoTime test is the operator.
| Operator | Meaning |
| --- | --- |
| `=` | Equals |
| `<=` | Less than or equal |
| `>=` | Greater than or equal |
| `<` | Greater than |
| `>` | Less than |

### Value

The third section of a GoTime test is the value. Valid values depend on the `part` used in the test. For example, `m=2022` is invalid because the `m` (Month) part is being used, and 2022 isn't a valid Month.

This section can declare a single value, a series of comma separated values, or a span of values with a minimum (inclusive) and maximum (exclusive) separated by a dash. Only the equals operator can be used with the comma separated values or span syntax; it doesn't make sense to be less than a span or a list of values, for example.

### Multiple Statements

A GoTime definition needs at least one test statement, but can include multiple tests separated by a semicolon. Tests using the same part are OR'd together, so if any one is true, the part test passes. For the entire definition to evaluate to true, a the input Date must pass every part. See the exmaples below.

## GoTime Examples

Here are some example definitions
| Definition Syntax | Meaning |
| --- | --- |
| `M=Oct; DoM>=24` | Halloween week. The last 7 days of October. |
| `DoM<7; DoW=Sat,Sun` | The first weekend of the month. (Might only be one Sunday!) |
| `Time=00:00-01:00; Time=12:00-13:00` | Midnight hour or noon hour |

## GoTime Usage

```typescript
const firstWeekend = new GoTime('DoM<7; DoW=Sat,Sun')
const now = new Date()
if (firstWeekend.test(now)) {
  // Do something here
}
```
