import WS from "uWebSockets.js";

import { logger } from "@app/libs";
import { Methods } from "@app/server/methods";

export class Server extends Methods {
  private socket = WS.App();

  constructor(url: string) {
    super();

    this.socket.ws(url, {
      compression: WS.DEDICATED_COMPRESSOR_128KB,
      sendPingsAutomatically: true,
      maxPayloadLength: 1024 / 4,
      idleTimeout: 60,
      upgrade: this.handshake,
      open: this.connect,
      message: this.messages,
      close: this.disconnect,
    });
  }

  public listen(PORT: number): void {
    try {
      this.socket.listen(PORT, (listenSocket) => {
        if (!listenSocket) {
          return logger.error("The server failed to start due to an error");
        }

        logger.server(`Server running on: localhost:${PORT}`);
      });
    } catch (e) {}
  }
}
