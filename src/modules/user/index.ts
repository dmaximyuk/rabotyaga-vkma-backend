import WS from "uWebSockets.js";

import { logger } from "@app/libs";
import { sending } from "@app/utils";

export class User {
  public id: undefined | number;

  constructor() {
    this.id = 123;
  }

  get() {
    return {
      id: this.id,
    };
  }

  set() {
    return {
      id: (id: number): void => {
        this.id = id;
      },
    };
  }

  public events(
    socket: WS.WebSocket,
    msg: ArrayBuffer,
    _isBinary: boolean
  ): void {
    const event = Buffer.from(msg).toString();
    const send = sending(socket);

    try {
      // switch (event) {
      // }
      send("MSG", JSON.parse(event));
    } catch (e) {
      logger.error(e);
    }
  }
}
