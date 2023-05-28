require("dotenv").config(".env");

import { Server } from "@app/server";
import { ListUsers } from "@app/modules";
import { Database } from "@app/libs";

new ListUsers();
new Database();

const PORT = process.env.PORT;

if (!process.env?.APP_KEY) {
  throw new Error("APP_KEY is undefined.");
}

if (!PORT) {
  throw new Error("Port is undefined.");
}

new Server("/").listen(+PORT);
