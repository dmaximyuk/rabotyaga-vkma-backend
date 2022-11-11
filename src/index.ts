require("dotenv").config(".env");

import { Server } from "@app/libs";

const PORT = process.env.PORT;
const wss = new Server("/");

if (!PORT) throw new Error("Port is undefined.");

wss.listen(+PORT);
