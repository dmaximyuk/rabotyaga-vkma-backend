require("dotenv").config(".env");
import uWS from "uWebSockets.js";

import { logger } from "@app/libs";

const server = uWS.App();
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Port is undefined.");
}

server
  .ws("/", {
    upgrade: (res, req, ctx) => {
      const token = req.getHeader("token");
      console.log(token);

      if (token === "1234") {
        res.upgrade(
          [],
          req.getHeader("sec-websocket-key"),
          req.getHeader("sec-websocket-protocol"),
          req.getHeader("sec-websocket-extensions"),
          ctx
        );
      } else {
        res.writeStatus("403 Forbidden").end();
      }
    },
    open: (_) => {
      console.log("Соединение установлено");
    },
    message: (ws, message, _) => {
      try {
        const msg = Buffer.from(message).toString();
        const data = JSON.parse(msg);
        ws.send(data.test);
      } catch (e) {
        logger.error(e);
      }
    },
    close: (_) => {
      console.log("Соединение закрыто");
    },
  })
  .listen(+PORT, (listenSocket) => {
    if (!listenSocket) {
      return logger.error("The server failed to start due to an error");
    }

    logger.server(`Server running on: localhost:${PORT}`);
  });
