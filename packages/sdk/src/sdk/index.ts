import { DMZ } from "./dmz/DMZ";
import { Lockbox } from "./lockbox/Lockbox";
import { Registry } from "./registry/Registry";
import { Telemetry } from "./telemetry/Telemetry";
const SDK_ORIGIN = "http://localhost:3000";

const ts = new Date().getTime();
const dmz = new DMZ(SDK_ORIGIN);

export class Civil {
  public lockbox: Lockbox;
  public registry: Registry;
  public telemetry: Telemetry;
  constructor() {
    this.lockbox = new Lockbox(dmz);
    this.registry = new Registry(dmz);
    this.telemetry = new Telemetry();
  }

  public onLoad(f: () => void): void {
    dmz.addOnloadHandler(f);
  }
}

window.onload = () => {
  dmz.initialize();
  const ts2 = new Date().getTime();
  console.log(`Civil SDK initialized in ${ts2 - ts}ms`);
};
(window as any).Civil = Civil;
