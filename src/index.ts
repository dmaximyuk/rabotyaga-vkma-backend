require("dotenv").config();
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { TOptionsUser } from "./types";
import { sign, Markups } from "./libs";
import { User, ListUsers } from "./modules";
import database from "./database";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: ["*"], methods: ["GET", "POST"] },
});
const listUsers = new ListUsers();

io.on("connection", async (socket: Socket) => {
  const auth = sign(socket.handshake?.auth?.token);
  if (auth.auth) {
    const newMarkups = (props: any) => new Markups(props);
    const id = Number(auth?.data?.vk_user_id) || 123124;
    const checkin = socket.handshake?.auth?.date;
    const data: any = await database("START_APP", { id: id, checkin: checkin });
    const isBaned = Math.floor((data.ban - Date.now()) / 1000 / 60);
    
    if (isBaned >= 1) {
      socket.emit("BANED", isBaned);
      return socket.disconnect();
    }

    const options: TOptionsUser = {
      id: id,
      exp: data.exp,
      date: data.checkin,
      bonus: data.bonus,
      balance: data.balance,
      listUsers,
    };

    return listUsers.addUser(new User(socket, options, newMarkups));
  } else {
    console.log("No user VKMA");
    socket.disconnect();
  }
  return socket.on("PONG", () => socket.emit("PING", {}));
});

httpServer.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Im starting: ${process.env.PORT}`);
});
