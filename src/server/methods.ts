import WS, { HttpRequest, HttpResponse } from "uWebSockets.js";

import { logger } from "@app/libs";
import { send } from "@app/utils";

export class Methods {
  protected handshake(
    res: HttpResponse,
    req: HttpRequest,
    ctx: WS.us_socket_context_t
  ) {
    // ! TODO: add check token
    const token = req.getHeader("token");
    console.log(token);

    if (token === "1234") {
      const params = {
        id: 1,
        token: token,
      };

      res.upgrade(
        [params],
        req.getHeader("sec-websocket-key"),
        req.getHeader("sec-websocket-protocol"),
        req.getHeader("sec-websocket-extensions"),
        ctx
      );
    } else {
      res.writeStatus("403 Forbidden").end();
    }
  }

  protected connect(ws: WS.WebSocket): void {
    console.log(ws);
    logger.log(`New user connected`);
  }

  protected disconnect(_: WS.WebSocket): void {
    logger.log(`User disconected`);
  }

  protected events(socket: WS.WebSocket, msg: ArrayBuffer, _isBinary: boolean) {
    try {
      const event = Buffer.from(msg).toString();
      return send(socket, "MSG", JSON.parse(event));
    } catch (e) {
      return logger.error(e);
    }
  }
}
