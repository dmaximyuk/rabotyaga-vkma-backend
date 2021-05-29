import { Socket } from "socket.io";
import { TOptionsUser } from 'types';
import { RateLimiterMemory } from 'rate-limiter-flexible';
// import {
// } from "./events";

import { mongodb } from '../libs';

const rateLimiter = new RateLimiterMemory(
  {
    points: 6,
    duration: 1,
  });

class User {
  private _Socket: Socket;
  private _Blocked: number;
  private _Id: number;
  private _Ping: number;
  private _Img: string;
  private _FirstName: string;
  private _LastName: string;
  private _Donut: boolean;

  constructor(socket: Socket, options: TOptionsUser) {
    this._Socket = socket;
    this._Id = options.id;
    this._Ping = Date.now();
    this._Blocked = 1;
    this._Img = options.img;
    this._FirstName = options.first_name;
    this._LastName = options.last_name;
    this._Donut = options.donut;

    this.event();
  }

  get id() { return this._Id }
  get ping() { return this._Ping }

  set = {
    id: (data: number) => { this._Id = data },
    ping: (data: number) => { this._Ping = data }
  }

  private event = () => {
    this._Socket.onAny(async (event, params) => {
      rateLimiter.consume(this._Id)
        .then(() => this._Blocked = 1)
        .catch(() => this._Blocked = Date.now());

      if (this._Blocked === 1) {
        const data = await mongodb({ usr: { id: this._Id }, type: "GET" })
        params = data;
        this.send("START_APP", {
          img: this._Img,
          first_name: this._FirstName,
          last_name: this._LastName,
          uid: this._Id,
          balance: params.balance,
          exp: '0/100 exp',
          bonus: false,
          donut: this._Donut,
          transfer: {
            lock: false,
            level: 25,
          },
          business: {
            name: 'Шаурма',
            balance: 12000,
          },
          job: {
            name: 'Дворник',
            balance: 12000,
          }
        });

        switch (event) {
          case "PING": return this.set.ping(Date.now());
          default: return console.log("INCORRECT_ACTION:", event);
        }
      } else {
        this.disconnect();
      }
    })
  }

  disconnect = () => this._Socket.disconnect();
  send = (action: string, message: any) => this._Socket.emit(action, message);
}

export default User;