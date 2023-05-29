import WS from "uWebSockets.js";

import { sending, logger } from "@app/libs";
import { startApp, ping, errorEvent, online } from "@app/events";
import { START_APP, PING, ONLINE } from "@app/constants";

export class User {
  private userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  public events(socket: WS.WebSocket, message: ArrayBuffer, _isBinary: boolean) {
    const msg = JSON.parse(Buffer.from(message).toString());
    const send = sending(socket);
    console.log(this.userId);

    try {
      switch (msg.type) {
        case PING:
          ping(send)();
          break;
        case START_APP:
          startApp(send)();
          break;
        case ONLINE:
          online(send)();
          break;
        default:
          errorEvent(send, socket)();
          break;
      }
    } catch (e) {
      logger.error(e);
    }
  }
}
