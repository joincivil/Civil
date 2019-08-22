import { SDKMessage } from "../SDKMessage";

interface Subscribers {
  [key: string]: Array<(data?: any) => void>;
}

export class DMZ {
  private sdkOrigin: string;
  private iframe?: Window;
  private subscribers: Subscribers = { READY: [] };

  public constructor(sdkOrigin: string) {
    this.sdkOrigin = sdkOrigin;
  }

  public initialize(): void {
    const body = document.getElementsByTagName("BODY")[0];
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3000/iframe.html";
    iframe.setAttribute("style", "display: none");
    iframe.onload = () => {
      const contentWindow = (iframe as HTMLIFrameElement).contentWindow;
      this.iframe = contentWindow!;
    };

    iframe.onerror = () => {
      // pretty sure this will never fire do to cross site origin restrictions
      console.error("FAILED TO LOAD CIVIL IFRAME!");
    };

    if (window.addEventListener) {
      const subs = this.subscribers;
      const sdkOrigin = this.sdkOrigin;
      window.addEventListener("message", function waitForAlive(message: any): void {
        if (message.origin === sdkOrigin && message.data.type && message.data.type === "ALIVE") {
          subs.READY.map(cb => cb());
          window.addEventListener("message", waitForAlive);
        }
      });

      window.addEventListener("message", this.handleMessage.bind(this));
    } else {
      (window as any).attachEvent("onmessage", this.handleMessage.bind(this));
    }

    body.appendChild(iframe);
  }
  public async send(message: SDKMessage): Promise<void> {
    if (!this.iframe) {
      console.log("not ready to send");
      return Promise.reject("not ready to send - iframe not available yet");
    }
    return new Promise((resolve, reject) => {
      console.log(`SEND ${message.type}`);
      this.iframe!.postMessage(message, this.sdkOrigin);
      this.listen("REPLY_" + message.type, response => {
        resolve(response);
        console.log(`REPONSE ${message.type}`, response);
      });
    });
  }

  public addOnloadHandler(f: () => void): void {
    this.subscribers.READY.push(f);
  }

  public listen(event: string, callback: (data?: any) => void): void {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    this.subscribers[event].push(callback);
  }

  private handleMessage(message: any): void {
    if (message.origin === this.sdkOrigin) {
      if (this.subscribers[message.data.type]) {
        this.subscribers[message.data.type].forEach(cb => cb(message.data));
      }
      this.subscribers[message.data.type] = [];
    }
  }
}
