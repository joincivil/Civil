import { Civil } from "@joincivil/core";

export function initializeDebugUI(callback: (civil: Civil) => void|Promise<void>): void {
  window.addEventListener("load", () => {
    callback(new Civil({ debug: true }));
  });
}
