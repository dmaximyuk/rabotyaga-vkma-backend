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
  Markups,
} from '../libs';
import { adsBonus, getSubscribeBonus, getTimeoutAdsBonus } from "./events";
import { giveUser } from "./helpers";
import database from "../database";

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
    this._ListUser = options.listUsers;
    this._Markups = newMarkups({tFormatting: tFormatting, id: this._Id, checkin: this._Checkin});
    this._Exp = options.exp;
    this._Bonus = options.bonus - Date.now() || 0 ;
    this._Balance = options.balance;

    this.event();
    this.startApp();
  }

  get id() { return this._Id }
  get checkin() { return this._Checkin }
  get ping() { return this._Ping }
  get getLevel() { return eForm.getLevel(this._Exp).back.level }
  get bonus() { return this._Bonus < 0 ? 0 : this._Bonus }

  set = {
    id: (data: number) => { this._Id = data },
    ping: () => { this._Ping = Date.now() }
  }

  private event = () => {
    this._Socket.onAny(async (event, options) => {
      rateLimiter.consume(this._Id)
        .then(() => {})
        .catch(() => { 
          database("SET_BLOCK", { id: this._Id, count: 6 });
          this.disconnect();
        });

      const bonus = {
        money: (config.restrictions.bonusMoney * config.restrictions.bonusFactory) * this.getLevel,
        exp: (config.restrictions.bonusExp * config.restrictions.bonusFactory) * this.getLevel,
      }

      switch (event) {
        case "ADS_BONUS": await giveUser({user: this, money: bonus.money, exp: bonus.exp, type: "bonus", per: " за просмотр рекламы"}); return await adsBonus({user: this});
        case "PING": this.set.ping(); return await getTimeoutAdsBonus({user: this});
        case "ADS_TIMEOUT": return await getTimeoutAdsBonus({user: this});
        case "GET_ITEMS": return this.send("SHOP", await this._Markups.getBusinesses());
        case "SUBSCRIBE_GROUP": return await getSubscribeBonus({user: this, params: options});
        case "GET_JOBS": return this.send("GET_JOBS", await this._Markups.getJobs());
        default: return console.log("INCORRECT_ACTION:", event);
      }
    })
  }
  
  startApp = async () => {
    const dataStartApp = {
      checkin: this.checkin,
      online: reduceNumber(this._ListUser.length),
      balance: reduceNumber(this._Balance),
      exp: eForm.getLevel(this._Exp).front,
      adRollback: config.restrictions.adRollback * 60,
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
    }

    this.send("START_APP", dataStartApp);
    // return await getTimeoutAdsBonus({ user: this }); 
  }

  disconnect = () => this._Socket.disconnect();
  send = (action: string, message: any) => this._Socket.emit(action, message);
}

export default User;