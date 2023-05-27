require("dotenv").config(".env");

import { Server } from "@app/libs";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Port is undefined.");
} else {
  const wss = new Server("/");

  wss.listen(+PORT);
}
