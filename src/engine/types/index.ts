import type { ParsedUrlQuery } from "querystring";
import type { HydratedDocument } from "mongoose";
import type { WebSocket } from "uWebSockets.js";

export type TVKSign =
  | {
      auth: true;
      data: ParsedUrlQuery & {
        vk_access_token_settings: string;
        vk_app_id: string;
        vk_are_notifications_enabled: string;
        vk_is_app_user: string;
        vk_is_favorite: string;
        vk_language: string;
        vk_platform: string;
        vk_ref: string;
        vk_ts: string;
        vk_user_id: string;
        sign: string;
      };
    }
  | {
      auth: false;
      data: undefined;
    };

export interface IUserData {
  id: number;
  checkin: string;
  exp: number;
  balance: number;
  ban: {
    date: number;
    time: number;
    status: boolean;
  };
}

export type TOperationType = "JOB" | "BUSINESS" | "";
export type TOperationVarian = "GET" | "SET" | "TRANSFER" | "TRANSFER" | "";
export type TUserDataHydratedDocument = HydratedDocument<IUserData>;
export type TLog = HydratedDocument<{
  user_id: number;
  type: TOperationType;
  value: "GET" | "SELL" | "BUY" | "";
}>;
export type TEvents = "START_APP" | "TOKEN";
export type TClientEvents = "START_APP" | "TOKEN" | "LIMITER" | "SERVER_ERR";
export type TSender = {
  ws: WebSocket;
  sender: Function;
};
export type TSendFunction = (
  ws: WebSocket,
  options: {
    type: TClientEvents;
    params: object;
    isBinary: boolean;
  }
) => void;
export interface IActions {
  ({
    socket,
    send,
    event,
    isBinary,
  }: {
    socket: WebSocket;
    send: TSendFunction;
    event: TEvents;
    isBinary: boolean;
  }): void;
}
