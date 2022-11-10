require("dotenv").config(".env");

import { Server, EEvents, logger } from "@app/libs";

const PORT = process.env.PORT;
const wss = new Server("/");

if (!PORT) throw new Error("Port is undefined.");

wss.on(EEvents.connection, async (ws) => {
  // console.log(Buffer.from().toString());
  console.log(ws.getBufferedAmount());
  logger.server("uWS: The user has connected to the server.");
});

wss.on(EEvents.disconnect, async () => {
  logger.server("uWS: The user has disconnected from the server.");
});

wss.listen(+PORT);
