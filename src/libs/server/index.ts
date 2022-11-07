import WS from "uWebSockets.js";
import chalk from "chalk";

enum EEvents {
  connection,
  disconnect,
}

type TRouteType = "START_APP";
type TWSFunction = (ws: WS.WebSocket) => void;

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
      maxPayloadLength: 16 * 1024,
      idleTimeout: 0,
      open: async (ws) => this.connectFunction(ws),
      // message: async (ws, msg, isBinary) => console.log(ws, msg, isBinary),
      message: async (_ws, msg, _isBinary) => this.route(msg),
      close: async (ws) => this.disconnectFunction(ws),
    });
  }

  private route = (msg: ArrayBuffer) => {
    const type = Buffer.from(msg).toString() as TRouteType;

    switch (type) {
      case "START_APP":
        return console.log(chalk.red("Start app params."));
      default:
        return console.warn("Socket route is not type.");
    }
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
