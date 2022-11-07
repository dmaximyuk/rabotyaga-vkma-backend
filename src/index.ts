require("dotenv").config(".env");

import { Server, EEvents, logger } from "@app/libs";

const PORT = process.env.PORT;
const wss = new Server("/");

if (!PORT) throw new Error("Port is undefined.");

wss.on(EEvents.connection, async (ws) => {
  logger("connect:", ws);
});

wss.on(EEvents.disconnect, async (ws) => {
  logger("disconnect:", ws);
});

wss.listen(+PORT);
