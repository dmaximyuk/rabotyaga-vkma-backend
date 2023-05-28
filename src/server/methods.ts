import WS, { HttpRequest, HttpResponse } from "uWebSockets.js";

import { logger, vkSign } from "@app/libs";
import { User } from "@app/modules";

export class Methods {
  protected messages(
    ws: WS.WebSocket,
    msg: ArrayBuffer,
    isBinary: boolean
  ): void {
    const id = ws["0"].userId;
    const user = listUsers.get(id);

    if (!user) return;
    console.log(user);

    user.events(ws, msg, isBinary);
    ws.userId;
  }

  protected handshake(
    res: HttpResponse,
    req: HttpRequest,
    ctx: WS.us_socket_context_t
  ) {
    const token = req.getHeader("token");
    const isUserAuthenticated = vkSign(String(process.env.APP_KEY), token);

    console.log(isUserAuthenticated);

    // ! TODO: add isUserAuthenticated check in auth
    if (token === "1234" || token === "4321") {
      res.upgrade(
        [{ userId: +token, uniqueKey: req.getHeader("sec-websocket-key") }],
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
    const id = ws["0"].userId;
    const user = new User(id);

    listUsers.set(id, user);
    logger.log(`New user connected`);
  }

  protected disconnect(ws: WS.WebSocket): void {
    const id = ws["0"].userId;

    listUsers.delete(id);
    logger.log(`User disconected`);
  }
}
