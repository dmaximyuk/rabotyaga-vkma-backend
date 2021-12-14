import { Socket } from "socket.io";
import { TOptionsUser } from 'types';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import ListUser from "./ListUsers";
import config from '../libs/data/config.json';
import 'moment/locale/ru'
import moment from 'moment'
moment.locale('ru');

import { 
  expFormatting, 
  reduceNumber,
  timeFormatting,
  Markups
} from '../libs';
import { getSubscribeBonus } from "./events";
import { giveUser } from "./helpers";

const eForm = new expFormatting;
const tFormatting = new timeFormatting;

const rateLimiter = new RateLimiterMemory(
  {
    points: 6,
    duration: 1,
  });

class User {
  private _Markups: Markups;
  private _Socket: Socket;
  private _ListUser: ListUser;
  private _Blocked: number;
  private _Id: number;
  private _Checkin: string;
  private _Ping: number;
  private _Exp: number;
  private _Bonus: number;
  private _Balance: number;

  constructor(socket: Socket, options: TOptionsUser, newMarkups: any) {
    this._Socket = socket;
    this._Id = options.id;
    this._Checkin = options.date;
    this._Ping = Date.now();
    this._Blocked = 1;
    this._ListUser = options.listUsers;
    this._Markups = newMarkups({tFormatting: tFormatting, id: this._Id, checkin: this._Checkin});
    this._Exp = options.exp;
    this._Bonus = options.bonus;
    this._Balance = options.balance;

    this.event();
    this.startApp();
  }

  get id() { return this._Id }
  get checkin() { return this._Checkin }
  get ping() { return this._Ping }
  get getLevel() { return eForm.getLevel(this._Exp).back.level }

  set = {
    id: (data: number) => { this._Id = data },
    ping: () => { this._Ping = Date.now() }
  }

  private event = () => {
    this._Socket.onAny(async (event, options) => {
      rateLimiter.consume(this._Id)
        .then(() => this._Blocked = 1)
        .catch(() => this._Blocked = Date.now());

    const bonus = {
      money: (config.restrictions.bonusMoney * config.restrictions.bonusFactory) * this.getLevel,
      exp: (config.restrictions.bonusExp * config.restrictions.bonusFactory) * this.getLevel,
    }

    if (this._Blocked === 1) {
      switch (event) {
        case "ADS_BONUS": giveUser({user: this, money: bonus.money, exp: bonus.exp, type: "bonus"}); return this.send("ADS_TIMEOUT", 20 * 60);
        case "PING": return this.set.ping();
        case "GET_ITEMS": return this.send("SHOP", await this._Markups.getBusinesses());
        case "SUBSCRIBE_GROUP": return await getSubscribeBonus({user: this, params: options});
        case "GET_JOBS": return this.send("GET_JOBS", await this._Markups.getJobs());
        default: return console.log("INCORRECT_ACTION:", event);
      }
    } else {
      this.disconnect();
    }
    })
  }
  
  startApp = async () => {
    this.send("START_APP", {
      subscribe: false,
      checkin: this.checkin,
      online: reduceNumber(this._ListUser.length),
      balance: reduceNumber(this._Balance),
      exp: eForm.getLevel(this._Exp).front,
      bonus: this._Bonus,
      donut: false,
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