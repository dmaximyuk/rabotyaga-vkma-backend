// import { Socket } from "socket.io";
// import { TOptionsUser, TSearchParam } from 'types';
// import { RateLimiterMemory } from 'rate-limiter-flexible';
// import {
// } from "./events";

// const rateLimiter = new RateLimiterMemory(
//     {
//         points: 6,
//         duration: 1,
//     });

// class User {
//     private _Socket: Socket;
//     private _Blocked: boolean;
//     private _Id: number;
//     private _Donut: boolean;
//     private _Balance: number;
//     private _Exp: number;
//     // private _Online: string;
//     private _Bonus: string;
//     private _Id: string;
//     private _Id: string;
//     constructor(socket: Socket, options: TOptionsUser) {
//         this._Id = options.id;
//         this._Blocked = false;
//         this._Donut = options?.donut;

//         this.reconnect();
//         this.event();
//     }

//     get blocked() { return this._Blocked }
//     get donut() { return this._Donut }
//     get id() { return this._Id }
//     get listRoom() { return this._ListRoom }
//     get listSearch() { return this._ListSearch }
//     get listUser() { return this._ListUser }
//     get mysql() { return this._Mysql }
//     get online() { return this._Online }
//     get room() { return this._Room }
//     get search() { return this._Search }
//     get ping() { return this._Ping }
//     get searchParam() { return this._SearchParam }

//     set = {
//         blocked: (data: boolean) => { this._Blocked = data },
//         donut: (data: boolean) => { this._Donut = data },
//         id: (data: string) => { this._Id = data },
//         online: (data: boolean) => { this._Online = data },
//         room: (data: Room | false) => { this._Room = data },
//         search: (data: boolean) => { this._Search = data },
//         searchParam: (data: TSearchParam) => { this._SearchParam = data },
//         ping: (data: number) => { this._Ping = data }
//     }

//     private event = () => {
//         this._Socket.onAny(async (event, params) => {
//             rateLimiter.consume(this._Id)
//                 .then(() => this._Blocked = false)
//                 .catch(() => this._Blocked = true);

//             if (!this._Blocked) {
//                 switch (event) {
//                     case "MESSAGE_READ": return MESSAGE_READ(this, params);
//                     default: this.send("INCORRECT_ACTION", { event: event, params: params })
//                 }
//             }
//         })

//         this._Socket.on("disconnect", () => this.bridge("USER_OFFLINE", {}, "him"));

//         this.send("START_APP", {
//             id: this._Id,
//             donut: this._Donut,
//             balance: this._Balance,
//         });
//     }

//     disconnect = () => this._Socket.disconnect();
//     send = (action: string, message: any) => this._Socket.emit(action, message);
// }

// export default User;