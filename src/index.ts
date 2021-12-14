require('dotenv').config();
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { TOptionsUser } from './types';
import {
  sign,
  Markups, 
  mongodb
} from './libs'
import { 
  User,
  ListUsers
 } from "./modules";

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: ['*'], methods: ['GET', 'POST'] } });
const listUsers = new ListUsers();

io.on('connection', async (socket: Socket) => {
  const auth = sign(socket.handshake?.auth?.token);
  if (auth.auth) {
    const newMarkups = (props: any) => new Markups(props)
    const id = Number(auth?.data?.vk_user_id) || 123124;
    const data = await mongodb({ usr: { id: id, checkin: socket.handshake?.auth?.date }, type: "GET" })

    const options: TOptionsUser = {
      id: id,
      exp: data.exp,
      date: data.checkin,
      bonus: data.bonus,
      balance: data.balance,
      listUsers,
    }

    listUsers.addUser(new User(socket, options, newMarkups));
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