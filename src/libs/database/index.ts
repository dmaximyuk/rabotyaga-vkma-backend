import moment from "moment";
import "moment/locale/ru";

import { connectionDatabase } from "./modules";
import { userSchema } from "./scheme";
// import { UserModelHydratedDocument } from "@app/engine/types";

moment.locale("ru");

connectionDatabase("rabotyaga");

declare global {
  var database: Database;
}

export class Database {
  // private maxBalance: number;
  // private maxExp: number;
  // private maxVersion: number;

  constructor() {
    // this.maxBalance = 1_000_000_000_000;
    // this.maxExp = 1_000_000;
    // this.maxVersion = 1_000;
  }

  public async getUser(id: number) {
    // ! TODO: Add create user
    const user = await userSchema.findOne({ id: id });

    if (!user) {
      const data = await userSchema.create({ id: id });

      console.log(data);
    }
  }

  public async updateUser(
    id: number,
    data: { [key: string]: number | string }
  ) {
    return await userSchema.findOneAndUpdate({ id: id }, data);
  }

  // private dataVerification = (
  //   data: UserModelHydratedDocument
  // ): UserModelHydratedDocument => {
  //   if (data.balance >= this.maxBalance) data.balance = this.maxBalance;
  //   if (data.exp >= this.maxExp) data.exp = this.maxExp;
  //   if (data.__v >= this.maxVersion) data.__v = this.maxVersion;

  //   ++data.__v;
  //   return data;
  // };
}
