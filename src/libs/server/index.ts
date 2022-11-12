import WS from "uWebSockets.js";

import { logger } from "@app/libs";
// ! import is error, fix later
import Socket from "@app/libs/socket/index";

class Server extends Socket {
  private socket = WS.App();

  /**
   * @constructor
   * @param  {string} url
   */

  constructor(url: string) {
    super();

    this.socket.ws(url, {
      compression: WS.DEDICATED_COMPRESSOR_128KB,
      sendPingsAutomatically: true,
      maxPayloadLength: 1024 / 4,
      idleTimeout: 60,
      open: async (ws) => this.connect(ws),
      message: async (ws, msg, isBinary) => this.events(ws, msg, isBinary),
      close: async (ws) => this.disconnect(ws),
    });
  }

  /**
   * @function
   * @name listen
   * @param  {number} PORT
   * @returns void
   * @description Launching the listener
   */

  listen = (PORT: number): void => {
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

export default Server;
