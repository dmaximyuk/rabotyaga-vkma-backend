import WS, { HttpRequest, HttpResponse } from "uWebSockets.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { logger } from "@app/libs";
import { User } from "@app/modules";
import { vkSign } from "@app/middleware";

const rateLimiter = new RateLimiterMemory({ points: 1, duration: 2 });

export class Methods {
  protected handshake(res: HttpResponse, req: HttpRequest, ctx: WS.us_socket_context_t) {
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
        ctx,
      );
    } else {
      res.writeStatus("403 Forbidden").end();
    }
  }

  protected messages(ws: WS.WebSocket, msg: ArrayBuffer, isBinary: boolean): void {
    const id: number | undefined = ws["0"]?.userId;
    if (!id) return ws.close();

    const user = listUsers.get(id);
    if (!user) return ws.close();

    rateLimiter
      .consume(id)
      .then(() => {
        user.events(ws, msg, isBinary);
      })
      .catch(() => {
        // TODO: Add fallback limit
        console.log("Limit");
      });
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
