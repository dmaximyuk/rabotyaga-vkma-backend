import WS from "uWebSockets.js";

import { ERROR_EVENT } from "@app/constants";

export function errorEvent(send: Function, socket: WS.WebSocket) {
  const params = {
    msg: "Error",
  };

  return function () {
    if (process.env?.NODE_ENV !== "production") {
      send(ERROR_EVENT, params);
    } else {
      socket.end(Number(process.env?.CODE_ERROR_EVENT), params.msg);
    }
  };
}
