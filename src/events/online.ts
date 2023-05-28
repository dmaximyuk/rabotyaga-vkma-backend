import { ONLINE } from "@app/constants";

export function online(send: Function) {
  const params = {
    size: listUsers.size,
  };

  return function () {
    send(ONLINE, params);
  };
}
