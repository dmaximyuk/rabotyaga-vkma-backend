import { ParsedUrlQuery } from "querystring";
import { ObjectId } from "mongoose";

export type TOptionsRoom = {
  id: string;
};

export type TMessage = {
  author: "my" | "you" | "admin";
  time: string;
  key: string;
  read: boolean;
  message: {
    value?: string;
    attach?: string;
  };
};

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

export type TOptionsUser = {
  id: number;
  exp: number;
  date: string;
  bonus: number;
  balance: number;
};

export type TMongoDB = {
  usr?: any;
  newDate?: any;
  checkin?: any;
  type: "GET" | "SEARCH" | "GET_RATING" | "SAVE";
};

export type TDebug = string | number;

export type TMethods = {
  debug: Function;
};

export type TUserJson = {
  _id: ObjectId;
  id: number;
  checkin: string;
  exp: number;
  balance: number;
  bonus: number;
  __v: number;
};

export type TLogTypes =
  | "GET_JOB_MONEY"
  | "GET_BUSINESS_MONEY"
  | "ENTERTAINMENT"
  | "PROMO"
  | "DONATE"
  | "BUY"
  | "SELL"
  | "TRANSFER_USER"
  | "TRANSFER_ME"
  | "SET_ADMIN"
  | "GET_USER"
  | "SET_USER"
  | undefined;

export type TItems = {};

export type TDatabase = {
  START_APP: { id: number; checkin: string };
  GET_USER: { id: number };
  SET_USER: { id: number; params: TUserJson };
  GET_ADMIN: { id: number };
  SET_ADMIN: { id: number };
  GET_INVENTORY: { id: number };
  SET_INVENTORY: { id: number; item: number };
  GET_PURCHASES: { id: number };
  SET_PURCHASES: { id: number; params: any };
  GET_LOG: { id: number };
  SET_LOG: { id: number; type: TLogTypes; payload: string };
  GET_PROMO: { id: number };
  SET_PROMO: { id: number; text: string; count: number };
  SET_BLOCK: {
    id: number;
    count: 1 | 2 | 3 | 6 | 12 | 24 | 48 | 72 | 168 | 8760;
  };
};

export type TDatabaseArguments<Data extends TDatabase> = {
  [K in keyof Data]: { type: K; data: Data[K] };
}[keyof Data];
export type TDatabaseVoid = <T extends keyof TDatabase>(
  type: T,
  data: TDatabase[T]
) => void;
