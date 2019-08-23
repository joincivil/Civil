import { Server } from "mock-socket";
import { ReceiveTypes } from "../iframe/services/communication/ReceiveTypes";
import { SendTypes, PrivateChannelMessageType } from "../iframe/services/communication/SendTypes";

function send(socket: WebSocket, type: ReceiveTypes, data: any): void {
  socket.send(JSON.stringify({ type, data }));
}

interface Channels {
  [key: string]: {
    [deviceID: string]: {
      socket: WebSocket;
      publicKeyString: string;
      deviceID: string;
      message: string;
      userAgent: string;
    };
  };
}

export function buildMockWebsocketServer(mockURL: string): Server {
  const mockServer = new Server(mockURL);

  const channels: Channels = {};

  mockServer.on("connection", socket => {
    // @ts-ignore
    socket.on("message", (data: any) => {
      let request;
      try {
        request = JSON.parse(data);
        if (!request.type || !request.data) {
          throw new Error("no event type or no data");
        }
      } catch (err) {
        console.log("failed to parse event", err);
      }

      switch (request.type) {
        case SendTypes.OPEN_SECURE_CHANNEL:
          const sender = {
            socket,
            publicKeyString: request.data.publicKeyString,
            deviceID: request.data.deviceID,
            message: request.data.message,
            userAgent: request.data.userAgent,
          };
          if (channels[request.data.channelName]) {
            const channel = channels[request.data.channelName];

            const creator = channel[Object.keys(channel)[0]];
            channel[request.data.deviceID] = sender;

            send(creator.socket, ReceiveTypes.REQUEST_TO_JOIN_CHANNEL, {
              deviceID: request.data.deviceID,
              publicKeyString: request.data.publicKeyString,
              message: request.data.message,
              userAgent: request.data.userAgent,
            });
            send(sender.socket, ReceiveTypes.REQUEST_TO_JOIN_CHANNEL, {
              deviceID: creator.deviceID,
              publicKeyString: creator.publicKeyString,
              message: creator.message,
              userAgent: creator.userAgent,
            });
          } else {
            channels[request.data.channelName] = {
              [request.data.deviceID]: sender,
            };
          }
          break;
        case SendTypes.PRIVATE_CHANNEL_MESSAGE:
          handlePrivateChannelMessage(request.data).catch(e => {
            throw e;
          });
          break;
        default:
          throw new Error("don't know how to handle " + request.type);
      }
    });

    async function handlePrivateChannelMessage(request: PrivateChannelMessageType): Promise<void> {
      send(channels[request.channelName][request.toDeviceID].socket, ReceiveTypes.PRIVATE_CHANNEL_MESSAGE, request);
    }
  });

  return mockServer;
}
