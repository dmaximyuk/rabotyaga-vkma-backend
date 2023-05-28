import { START_APP } from "@app/constants";

export function startApp(send: Function) {
  const params = {
    userId: 0,
    balance: 0,
  };

  return function () {
    send(START_APP, params);
  };
}
