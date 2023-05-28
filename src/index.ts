require("dotenv").config(".env");

import { Server } from "@app/server";
import { ListUsers } from "@app/modules";

new ListUsers();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Port is undefined.");
}

new Server("/").listen(+PORT);
