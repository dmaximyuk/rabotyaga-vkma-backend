import { Socket } from "socket.io";
import { TOptionsUser } from 'types';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import 'moment/locale/ru'
import moment from 'moment'
moment.locale('ru');

import { 
  expFormatting, 
  mongodb, 
  reduceNumber,
} from '../libs';

import ListUser from "./ListUsers";
import Markup from "../libs/markup";

const eForm = new expFormatting;
const Markups = new Markup;

const rateLimiter = new RateLimiterMemory(
  {
    points: 6,
    duration: 1,
  });

class User {
  private _Socket: Socket;
  private _ListUser: ListUser;
  private _Blocked: number;
  private _Id: number;
  private _Checkin: string;
  private _Ping: number;
  private _Donut: boolean;

  constructor(socket: Socket, options: TOptionsUser) {
    this._Socket = socket;
    this._Id = options.id;
    this._Checkin = options.date;
    this._Ping = Date.now();
    this._Blocked = 1;
    this._Donut = options.donut;
    this._ListUser = options.listUsers;

    this.event();
    this.startApp();
  }

  get id() { return this._Id }
  get ping() { return this._Ping }

  set = {
    id: (data: number) => { this._Id = data },
    ping: () => { this._Ping = Date.now() }
  }

  private event = () => {
    this._Socket.onAny(async (event) => {
      rateLimiter.consume(this._Id)
        .then(() => this._Blocked = 1)
        .catch(() => this._Blocked = Date.now());

      if (this._Blocked === 1) {
        switch (event) {
          case "PING": return this.set.ping();
          default: return console.log("INCORRECT_ACTION:", event);
        }
      } else {
        this.disconnect();
      }
    })
  }
  
  startApp = async () => {
    console.log("Send start params")
    console.log(await Markups.getJobs())
    
    const data = await mongodb({ usr: { id: this._Id, checkin: this._Checkin }, type: "GET" })
    this.send("START_APP", {
      checkin: data.checkin,
      online: reduceNumber(this._ListUser.length),
      balance: reduceNumber(data.balance),
      exp: eForm.getLevel(data.exp).front,
      bonus: false,
      donut: this._Donut,
      blocked: this._Blocked !== 1,
      rating: 1,
      transfer: {
        lock: false,
        level: 25,
      },
      business: {
        name: 'Шаурма',
        balance: reduceNumber(12000),
      },
      job: {
        name: 'Дворник',
        balance: reduceNumber(12000),
      }
    });
  }

  disconnect = () => this._Socket.disconnect();
  send = (action: string, message: any) => this._Socket.emit(action, message);
}

export default User;