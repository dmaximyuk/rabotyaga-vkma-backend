import WS from "uWebSockets.js";

export const send = (
  socket: WS.WebSocket,
  event: string,
  params: { [key: string]: number | string }
) => {
  return socket.send(JSON.stringify({ event, params }));
};
