import WS from "uWebSockets.js";

export const sending = (socket: WS.WebSocket) => {
  return function (event: string, params: { [key: string]: number | string }) {
    return socket.send(JSON.stringify({ type: event, params }));
  };
};
