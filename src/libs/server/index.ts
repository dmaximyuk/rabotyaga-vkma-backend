import WS from "uWebSockets.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { generateParams, logger } from "@app/libs";
// import { User } from "@app/modules";

import { SendFunctionModel } from "@app/engine/types";

export class Server {
  private id: number;
  private socket = WS.App();
  private rateLimiter: RateLimiterMemory;

  constructor(url: string) {
    this.id = 0;

    this.rateLimiter = new RateLimiterMemory({
      points: 1,
      duration: 2,
    });

    this.socket.ws(url, {
      compression: WS.DEDICATED_COMPRESSOR_128KB,
      sendPingsAutomatically: true,
      maxPayloadLength: 1024 / 4,
      idleTimeout: 60,
      open: (ws) => this.connect(ws),
      message: async (ws, msg, isBinary) => this.events(ws, msg, isBinary),
      close: async (ws) => this.disconnect(ws),
    });
  }

  private connect = (ws: WS.WebSocket): void => {
    console.log(ws.__proto__);
    const token = ws.getHeader("token");
    logger.server(`Получен токен: ${token}`);
    logger.log(`connect ${ws}`);
  };

  private disconnect = (ws: WS.WebSocket): void => {
    logger.log(`disconnect ${ws}`);
  };

  private events = (
    socket: WS.WebSocket,
    msg: ArrayBuffer,
    isBinary: boolean
  ): void | Function => {
    try {
      if (!this.id) return;

      this.rateLimiter
        .consume(this.id)
        .then(() => {
          const event = Buffer.from(msg).toString();
          console.log(event);
        })
        .catch((_e) => {
          return this.send(socket, {
            type: "LIMITER",
            params: {
              msg: "Stop it!",
            },
            isBinary,
          });
        });
    } catch (e) {
      logger.error(e);
    }
  };

  public send: SendFunctionModel = (ws, options) => {
    try {
      const msg = generateParams(options.type, options.params);
      ws.send(msg, options.isBinary);
    } catch (e) {
      logger.error(e);
    }
  };

  public listen = (PORT: number): void => {
    try {
      this.socket.listen(PORT, (listenSocket) => {
        if (!listenSocket) {
          return logger.error("The server failed to start due to an error");
        }

        logger.server(`Server running on: localhost:${PORT}`);
      });
    } catch (e) {}
  };
}
