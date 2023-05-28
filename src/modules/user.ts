import WS from "uWebSockets.js";

import { logger } from "@app/libs";
import { sending } from "@app/utils";
import { startApp, ping, errorEvent } from "@app/events";
import { START_APP, PING } from "@app/constants";

export class User {
  constructor() {
    this.userId = undefined;
  }

  get userId() {
    return this.userId;
  }

  set userId(value: number | undefined) {
    if (!value && Number(value) >= 1) {
      this.userId = value;
    }
  }

  public events(
    socket: WS.WebSocket,
    message: ArrayBuffer,
    _isBinary: boolean
  ) {
    // ! Add rate limiter
    console.log(socket["0"].uniqueKey);

    if (!this.userId) return socket.end(Number(process.env.CODE_ERROR_AUTH));
    const msg = JSON.parse(Buffer.from(message).toString());
    const send = sending(socket);

    try {
      switch (msg.type) {
        case PING:
          ping(send)();
          break;
        case START_APP:
          startApp(send)();
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
