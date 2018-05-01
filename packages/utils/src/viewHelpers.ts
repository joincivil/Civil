// A collection of helper methods for user-facing views

// Accepts `seconds` as a single argument and returns a
// human-readable string of a duration of time.
// ie: 1 day, 3 hours, 4 minutes, 20 seconds
export function getReadableDuration(seconds: number): string {
  const out = [];
  let period: [number, string];
  const periods: Array<[number, string]> = [[86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  let secondsRemaining: number = seconds;

  while (periods.length) {
    period = periods.shift()!;
    const periodUnits = Math.floor(secondsRemaining / period[0]);
    if (periodUnits > 0) {
      out.push(periodUnits.toString(), period[1] + (periodUnits !== 1 ? "s" : ""));
      secondsRemaining = secondsRemaining % period[0];
    }
  }

  return out.join(" ");
}
