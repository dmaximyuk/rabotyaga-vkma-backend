import WS from "uWebSockets.js";

import { logger, rateLimiter } from "@app/libs";

import { TEventsMessage } from "@app/engine/types";

type TFunc = (ws: WS.WebSocket) => void | Function;

class User {
  private isLimit: Function;

  constructor() {
    this.isLimit = rateLimiter(2000);
  }

  protected connect: TFunc = (_ws) => {
    logger.log("connect");
  };

  protected disconnect: TFunc = (_ws) => {
    logger.log("disconnect");
  };

  protected events = (
    ws: WS.WebSocket,
    msg: ArrayBuffer,
    isBinary: boolean
  ): void | Function => {
    try {
      if (this.isLimit()) {
        this.send(
          ws,
          {
            type: "LIMITER",
            params: {
              msg: "Stop it!",
            },
          },
          isBinary
        );
        return;
      }

      const msgToString = Buffer.from(msg).toString();
      const { type, params }: TEventsMessage = JSON.parse(msgToString);

      switch (type) {
        case "TOKEN":
          this.send(ws, params, isBinary);
          return logger.log(params);
        case "START_APP":
          this.send(ws, params, isBinary);
          return logger.debug("Start app params.");
        default:
          this.send(ws, params, isBinary);
          return logger.debug("Socket route is not type.");
      }
    } catch (e) {
      logger.error(e);
    }
  };

  private send = (ws: WS.WebSocket, data: object, isBinary: boolean) => {
    try {
      const stringifyData = JSON.stringify(data);
      ws.send(stringifyData, isBinary);
    } catch (e) {
      logger.error(e);
    }
  };
}

export default User;
