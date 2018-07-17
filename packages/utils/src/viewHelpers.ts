import { BigNumber } from "bignumber.js";

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

// accepts token balance in lowest-level form (no decimals). Converts to readable format (18 decimal places; cut off at 2)
export function getFormattedTokenBalance(balance: BigNumber, noCVLLabel?: boolean): string {
  // TODO: get decimal places value from EIP20 wrapper
  const formattedBalance = balance.div(1e18);
  return `${formattedBalance.toFormat(2)} ${!!noCVLLabel ? "" : "CVL"}`;
}

// Accepts a `seconds` or `Date` argument and returns a tuple containing
// localized Date and Time strings in a human-readable format
export function getLocalDateTimeStrings(seconds: number | Date): [string, string] {
  const theDate = typeof seconds === "number" ? new Date(seconds * 1000) : seconds;
  const pad = (num: number | string) => {
    return padString(num, 2, "0");
  };
  const hours = pad(theDate.getHours());
  const mins = pad(theDate.getMinutes());
  const tzOffset = `${pad(theDate.getTimezoneOffset() / 60)}${pad(theDate.getTimezoneOffset() % 60)}`;
  const dateString = `${theDate.getFullYear()}-${theDate.getMonth() + 1}-${theDate.getDate()}`;
  const timeString = `${hours}:${mins} GMT-${tzOffset}`;
  return [dateString, timeString];
}

export function padString(value: number | string, places: number, char: string, append: boolean = false): string {
  let out = typeof value === "number" ? value.toString() : value;
  while (out.length < places) {
    if (append) {
      out += char;
    } else {
      out = char + out;
    }
  }
  return out;
}

export function getNumberStringWithCommaDelimeters(
  num: number | string,
  delim: string = ",",
  places: number = 3,
): string {
  const numString = typeof num === "number" ? num.toString() : num;
  const lenStr = numString.length;
  const out = numString.split("").reverse();
  for (let i = places; i < lenStr; i = i + places) {
    out[i] = out[i] + ",";
  }
  return out.reverse().join("");
}
