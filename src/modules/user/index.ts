import { logger } from "@app/libs";

import { IActions } from "@app/engine/types/index";

class User {
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

  public actions: IActions = ({ socket, send, event, isBinary }) => {
    try {
      switch (event) {
        // ? maybe is not need?
        // ? case "TOKEN":
        // ?  return send(socket, {
        // ?   type: event,
        // ?    params: { id: 123, name: "Dmitriy" },
        // ?    isBinary,
        // ?  });
        case "START_APP":
          return send(socket, {
            type: event,
            params: { id: 123 },
            isBinary,
          });
        default:
          return send(socket, {
            type: "SERVER_ERR",
            params: { id: 123 },
            isBinary,
          });
      }
    } catch (e) {
      logger.error(e);
    }
  };
}

export default User;
