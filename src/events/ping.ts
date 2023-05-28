import { PONG } from "@app/constants";

export function ping(send: Function) {
  const params = {};

  return function () {
    send(PONG, params);
  };
}
