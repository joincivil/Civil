import * as React from "react";

export function useAsyncEffect(fn: () => Promise<void>, watcher: any[]): void {
  React.useEffect(() => {
    fn(); // tslint:disable-line
  }, watcher);
}
