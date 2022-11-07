import WS from "uWebSockets.js";
import chalk from "chalk";

import logger from "libs/logger";

type TWSFunction = (ws: WS.WebSocket) => void;
type TRouteType = "START_APP";
type TRouteMsg = { type: TRouteType; params: object };
enum EEvents {
  connection,
  disconnect,
}

class Server {
  private socket = WS.App();
  private connectFunction: TWSFunction;
  private disconnectFunction: TWSFunction;

  constructor(url: string) {
    this.connectFunction;
    this.disconnectFunction;
    this.socket.ws(url, {
      compression: WS.DEDICATED_COMPRESSOR_128KB,
      sendPingsAutomatically: true,
      maxPayloadLength: 1024,
      idleTimeout: 0,
      open: async (ws) => this.connectFunction(ws),
      message: async (ws, msg, isBinary) => this.route(ws, msg, isBinary),
      close: async (ws) => this.disconnectFunction(ws),
    });
  }

  private route = (
    ws: WS.WebSocket,
    msg: ArrayBuffer,
    isBinary: boolean
  ): void | Function => {
    try {
      const msgToString = Buffer.from(msg).toString();
      const { type, params }: TRouteMsg = JSON.parse(msgToString);

      switch (type) {
        case "START_APP":
          ws.send(JSON.stringify(params), isBinary);
          return logger(chalk.red("Start app params."));
        default:
          ws.send(JSON.stringify(params), isBinary);
          return logger("Socket route is not type.");
      }
    } catch (e) {}
  };

  on = (event: EEvents, callback: TWSFunction) => {
    switch (event) {
      case EEvents.connection:
        return (this.connectFunction = callback);
      case EEvents.disconnect:
        return (this.disconnectFunction = callback);
    }
  };

  listen = (PORT: number) =>
    this.socket.listen(PORT, (listenSocket) => {
      if (!listenSocket) {
        return console.error("The server failed to start due to an error");
      }

      console.log(chalk.black(`Server running on: localhost:${PORT}`));
    });
}

export { EEvents };
export default Server;
