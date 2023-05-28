export function startApp(send: Function) {
  const params = {
    userId: 0,
    balance: 0,
  };

  send("START_APP", params);
}
