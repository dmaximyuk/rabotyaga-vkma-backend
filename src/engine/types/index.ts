import type { ParsedUrlQuery } from "querystring";
import type { HydratedDocument } from "mongoose";

export type VKSignModel =
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

export interface UserModel {
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

export type UserModelHydratedDocument = HydratedDocument<UserModel>;
export type LogModel = HydratedDocument<{
  user_id: number;
  type: string;
  value: "GET" | "SELL" | "BUY" | "";
}>;
