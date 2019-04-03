import * as React from "react";
import { useAsyncEffect } from "./useAsyncEffect";
const { useEffect, useState } = React;

export function useIntervalEffect(fn: () => Promise<void>, intervalMS: number): void {
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTicker(ticker + 1), intervalMS);

    return function cleanup(): void {
      clearInterval(interval);
    };
  });

  useAsyncEffect(fn, [ticker]);
}
