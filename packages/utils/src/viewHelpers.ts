// A collection of helper methods for user-facing views

// Accepts `seconds` as a single argument and returns a
// human-readable string of a duration of time.
// ie: 1 day, 3 hours, 4 minutes, 20 seconds
export function getReadableDuration(seconds: number): string {
  const periods: Array<[number, string]> = [[86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  let secondsRemaining: number = seconds;
  const lenPeriods: number = periods.length;
  return periods.reduce((acc: string, item: [number, string], index: number) => {
    const periodUnits = Math.floor(secondsRemaining / item[0]);
    let out: string = acc;
    if (periodUnits > 0) {
      out += `${periodUnits} ${item[1]}${periodUnits !== 1 ? "s" : ""}${index < lenPeriods - 1 ? " " : ""}`;
      secondsRemaining = secondsRemaining % item[0];
    }
    return out;
  }, "");
}
