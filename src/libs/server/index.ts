import WS from "uWebSockets.js";

enum EEvents {
  connection,
  disconnect,
}

type TFunc = () => never;

class Server {
  private socket = WS.App();

  constructor(url: string) {
    this.socket.ws(url, {
      compression: WS.DEDICATED_COMPRESSOR_128KB,
      sendPingsAutomatically: true,
      maxPayloadLength: 16 * 1024,
      idleTimeout: 0,
      // open(ws) {},
      // message(ws, message, isBinary) {},
      // close(ws, code, message) {},
    });
  }

  on = (event: EEvents, callback: TFunc): TFunc => {
    switch (event) {
      case EEvents.connection:
        return (() => callback)();
      case EEvents.disconnect:
        return (() => callback)();
    }
  };

  listen = (PORT: number) =>
    this.socket.listen(PORT, (listenSocket) =>
      listenSocket
        ? console.log(`Server running on: localhost:${PORT}`)
        : console.error("The server failed to start due to an error")
    );
}

export { EEvents };
export default Server;
