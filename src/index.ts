require("dotenv").config(".env");

import { Server, EEvents } from "@app/libs";

const PORT = process.env.PORT;
const wss = new Server("/");

if (!PORT) throw new Error("Port is undefined.");

wss.on(EEvents.connection, async (ws) => {
  console.log("connect:", ws);
});

wss.on(EEvents.disconnect, async (ws) => {
  console.log("disconnect:", ws);
});

wss.listen(+PORT);
