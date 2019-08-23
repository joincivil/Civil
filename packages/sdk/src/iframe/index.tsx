import { WindowMessageHandler } from "./services/MessageHandler";
import { KeyManager } from "./services/keys/KeyManager";
import { LockboxService } from "./services/civil-node/LockboxService";
import { CivilPersistence } from "./services/civil-node/CivilPersistence";
import { CivilWebsocket } from "./services/communication/CivilWebsocket";

const CIVIL_WEBSOCKET_URL = "ws://localhost:8080/ws";
const CIVIL_REST_URL = "http://localhost:8080";

const handler = new WindowMessageHandler(document.referrer);

let parentDomain: string;
const parentUrl = window.location !== window.parent.location ? document.referrer : document.location.href;
if (parentUrl) {
  const match = parentUrl.match(/(.*):\/\/(.[^/]+)/);
  if (match) {
    parentDomain = match[0];
  }
}
console.log("Initializing iframe from parentUrl: ", parentUrl);

handler
  .initialize(async () => {
    const persistence = new CivilPersistence(CIVIL_REST_URL);
    const lockbox = new LockboxService(persistence);
    const websockets = new CivilWebsocket(CIVIL_WEBSOCKET_URL);
    const keyManager = await KeyManager.initialize(lockbox, websockets);
    return {
      keyManager,
    };
  })
  .catch(err => {
    console.error("Error initializing civil-sdk", err);
  });

if (window.addEventListener) {
  window.addEventListener("message", handleMessage);
} else {
  (window as any).attachEvent("onmessage", handleMessage);
}

async function handleMessage(message: any): Promise<void> {
  if (message.origin === parentDomain) {
    await handler.receive(message.data);
  }
}
