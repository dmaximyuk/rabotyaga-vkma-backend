import WS, { HttpRequest, HttpResponse } from "uWebSockets.js";

import { logger } from "@app/libs";
import { User } from "@app/modules";

export class Methods extends User {
  constructor() {
    super();
  }

  protected handshake(
    res: HttpResponse,
    req: HttpRequest,
    ctx: WS.us_socket_context_t
  ) {
    // ! TODO: add check token
    const token = req.getHeader("token");
    console.log(token);

    if (token === "1234") {
      this.userId = +token;

      res.upgrade(
        [{ uniqueKey: req.getHeader("sec-websocket-key") }],
        req.getHeader("sec-websocket-key"),
        req.getHeader("sec-websocket-protocol"),
        req.getHeader("sec-websocket-extensions"),
        ctx
      );
    } else {
      res.writeStatus("403 Forbidden").end();
    }
  }

  protected connect(_: WS.WebSocket): void {
    logger.log(`New user connected`);
  }

  protected disconnect(_: WS.WebSocket): void {
    logger.log(`User disconected`);
  }
}
