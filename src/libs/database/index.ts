import moment from "moment";
import "moment/locale/ru";

import { connectionDatabase } from "./modules";
import { UserSchema } from "./scheme";

moment.locale("ru");
connectionDatabase("rabotyaga");

type TUserData = any;

class Database {
  private maxBalance: number;

  constructor() {
    this.maxBalance = 1000000000000;
  }

  get() {
    return {
      user: async (id: number) => {
        return await UserSchema.findOne({ id: id });
      },
      rating: async () => {
        return [{ id: 123, name: "Dmitriy" }];
      },
    };
  }

  set() {
    return {
      user: async (id: number, data: TUserData) => {
        const verificatedData = this.userVerification(data);
        return await UserSchema.findOneAndUpdate({ id: id }, verificatedData);
      },
    };
  }

  private userVerification = (data: TUserData) => {
    if (data.balance >= this.maxBalance) data.balance = this.maxBalance;
    ++data.params.__v;
    return data;
  };
}

export default Database;
