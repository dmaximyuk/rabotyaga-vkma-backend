import { RateLimiterMemory } from "rate-limiter-flexible";

import { generateParams, logger } from "@app/libs";
import { User } from "@app/modules";

import { TEvents, TSendFunction } from "@app/engine/types";
import type { WebSocket } from "uWebSockets.js";
type TFunc = (ws: WebSocket) => void | Function;

class Socket extends User {
  private rateLimiter: RateLimiterMemory;
  constructor() {
    super();

    this.rateLimiter = new RateLimiterMemory({
      points: 1,
      duration: 2,
    });
  }

  /**
   * @function
   * @name connect
   * @description If the user connects, the connect function will work
   * @param  {WebSocket} ws
   * @returns void
   */

  protected connect: TFunc = (_ws): void => {
    logger.log("connect");
  };

  /**
   * @function
   * @name disconnect
   * @param  {WebSocket} ws
   * @returns void
   * @description If the user is disconnected, the disconnect function will work
   */

  protected disconnect: TFunc = (_ws): void => {
    logger.log("disconnect");
  };

  /**
   * @description Managing all incoming messages
   * @param  {WebSocket} ws
   * @param  {ArrayBuffer} msg
   * @param  {boolean} isBinary
   * @returns void | Function
   */

  protected events = (
    socket: WebSocket,
    msg: ArrayBuffer,
    isBinary: boolean
  ): void | Function => {
    try {
      if (!this.id) return;

      this.rateLimiter
        .consume(this.id)
        .then(() => {
          const event = Buffer.from(msg).toString() as TEvents;
          this.actions({
            socket,
            send: this.send,
            event,
            isBinary,
          });
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

  /**
   * @function
   * @name send
   * @param  {WebSocket} ws
   * @param  {{type:TClientEvents; params:object; isBinary:boolean;}} options
   * @return void
   * @description Sending a message to the client
   */

  public send: TSendFunction = (ws, options) => {
    try {
      const msg = generateParams(options.type, options.params);
      ws.send(msg, options.isBinary);
    } catch (e) {
      logger.error(e);
    }
  };
}

export default Socket;
