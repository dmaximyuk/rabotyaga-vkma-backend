import WS from "uWebSockets.js";

import { logger } from "@app/libs";
import { sending } from "@app/utils";
import { startApp } from "@app/events";

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
    if (!this.userId)
      return logger.error(`user id is not setted: ${this.userId}`);
    const msg = JSON.parse(Buffer.from(message).toString());
    const send = sending(socket);

    try {
      switch (msg.type) {
        case "PING":
          send("PONG", { msg: "ok", id: this.userId || 0 });
          break;
        case "START_APP":
          startApp(send);
          break;
        default:
          send("ERR_EVENT", { msg: "ok" });
          break;
      }
    } catch (e) {
      logger.error(e);
    }
  }
}
