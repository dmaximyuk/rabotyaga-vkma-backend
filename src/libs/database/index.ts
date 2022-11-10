import moment from "moment";
import "moment/locale/ru";

import { connectionDatabase } from "./modules";
import { userSchema } from "./scheme";
import { TUserDataHydratedDocument } from "@app/engine/types";

moment.locale("ru");

connectionDatabase("rabotyaga");

class Database {
  private maxBalance: number;
  private maxExp: number;
  private maxVersion: number;

  constructor() {
    this.maxBalance = 1_000_000_000_000;
    this.maxExp = 1_000_000;
    this.maxVersion = 1_000;
  }

  get() {
    return {
      user: async (id: number) => {
        return await userSchema.findOne({ id: id });
      },
      rating: async () => {
        return [{ id: 123, name: "Dmitriy" }];
      },
    };
  }

  set() {
    return {
      user: async (id: number, data: TUserDataHydratedDocument) => {
        const isVerificateData = this.dataVerification(data);
        return await userSchema.findOneAndUpdate({ id: id }, isVerificateData);
      },
    };
  }

  private dataVerification = (
    data: TUserDataHydratedDocument
  ): TUserDataHydratedDocument => {
    if (data.balance >= this.maxBalance) data.balance = this.maxBalance;
    if (data.exp >= this.maxExp) data.exp = this.maxExp;
    if (data.__v >= this.maxVersion) data.__v = this.maxVersion;

    ++data.__v;
    return data;
  };
}

export default Database;
