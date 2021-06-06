require('dotenv').config();
import { VK } from 'vk-io';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { TOptionsUser } from './types';
import {
  sign,
  donut 
} from './libs'
import { 
  User,
  ListUsers
 } from "./modules";

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: ['*'], methods: ['GET', 'POST'] } });
const vk = new VK({ token: process.env.TOKEN || "" });
const listDonut = new donut(vk);
const listUsers = new ListUsers();

io.on('connection', async (socket: Socket) => {
  const auth = sign(socket.handshake?.auth?.token);
  if (auth.auth) {
    const id = Number(auth?.data?.vk_user_id) || 123124;
    const getUsers = await listDonut.get()
    const findDonut = getUsers.find((user: number) => user === id)

    const options: TOptionsUser = {
      id: id,
      donut: findDonut ? true : false,
      listUsers,
    }
    listUsers.addUser(new User(socket, options));
  } else { 
    console.log("No user VKMA");
    socket.disconnect() 
  }
  socket.on('PONG', () => socket.emit('PING', {}));
});

httpServer.listen(process.env.PORT, () => {
  console.clear()
  console.log(`Im starting: ${process.env.PORT}`)
});