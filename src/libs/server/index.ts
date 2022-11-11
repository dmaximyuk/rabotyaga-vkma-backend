import WS from "uWebSockets.js";

import { logger } from "@app/libs";
import { User } from "@app/modules";

class Server extends User {
  private socket = WS.App();

  constructor(url: string) {
    super();
    this.socket.ws(url, {
      compression: WS.DEDICATED_COMPRESSOR_128KB,
      sendPingsAutomatically: true,
      maxPayloadLength: 1024,
      idleTimeout: 0,
      open: async (ws) => this.connect(ws),
      message: async (ws, msg, isBinary) => this.events(ws, msg, isBinary),
      close: async (ws) => this.disconnect(ws),
    });
  }

  listen = (PORT: number) => {
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
