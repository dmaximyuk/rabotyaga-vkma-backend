require('dotenv').config();
import { VK } from 'vk-io';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { TOptionsUser } from './types';
import {
  sign,
  mongodb,
  donut 
} from './libs'

const vk = new VK({
  token: "f8323d8a7225e9b28144a7a4b738e29ecb6cda0a322b9723807a4af13270d4466693fd33446cfc750f870"
});
const listDonut = new donut(vk);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['*'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket: Socket) => {
  const auth = sign(socket.handshake?.auth?.token);
  if (auth.auth) {
    const id = Number(auth.data.vk_user_id);
    const data = await mongodb({
      usr: { id: id },
      type: "GET"
    })
    const getUsers = await listDonut.get()
    const findDonut = getUsers.find((user: number) => user === id)
    data.donut = findDonut ? true : false;

    const options: TOptionsUser = {
      ...data,
    }

    console.log(options)
    // listUser.addUser(new User(socket, options));
  } else { 
    console.log("No user VKMA");
    socket.disconnect() 
  }
  socket.on('PONG', () => socket.emit('PING', {}));
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Im starting: ${process.env.PORT}`)
});
