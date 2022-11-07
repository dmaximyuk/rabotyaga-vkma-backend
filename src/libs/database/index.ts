// Vendor
import mongoose from "mongoose";
import moment from "moment";
import "moment/locale/ru";

// Modules
import methods from "./methods";

// Schame
import { UserSchema, UserJson } from "./scheme";

// Locale
moment.locale("ru");

// Types
import {
  TDatabase,
  TDatabaseArguments,
  TDatabaseVoid,
} from "../../engine/types";

mongoose.connect("mongodb://127.0.0.1:27017/HardWorker", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

const database: TDatabaseVoid = async (type, data) => {
  const options = { type, data } as TDatabaseArguments<TDatabase>;
  const { id } = options.data;

  switch (options.type) {
    case "START_APP":
      return (
        (await UserSchema.findOne({ id: id })) ||
        (await new UserSchema(
          UserJson(id, { checkin: options.data.checkin })
        ).save())
      );
    case "GET_USER":
      return await UserSchema.findOne({ id: id });
    case "SET_USER":
      ++options.data.params.__v;
      return await UserSchema.findOneAndUpdate({ id: id }, options.data.params);
    case "GET_ADMIN":
      return methods.debug(id);
    case "SET_ADMIN":
      return methods.debug(id);
    case "GET_INVENTORY":
      return methods.debug(id);
    case "SET_INVENTORY":
      return methods.debug(id, options.data.item);
    case "GET_PURCHASES":
      return methods.debug(id);
    case "SET_PURCHASES":
      return methods.debug(id, options.data.params);
    case "GET_LOG":
      return methods.debug(id, options.data.id);
    case "SET_LOG":
      return methods.debug(id, options.data.type, options.data.payload);
    case "GET_PROMO":
      return methods.debug(id);
    case "SET_PROMO":
      return methods.debug(id, options.data.text, options.data.count);
    case "SET_BLOCK":
      return await UserSchema.findOneAndUpdate(
        { id: id },
        { ban: Date.now() + options.data.count * 1000 * 60 * 60 }
      );
  }
};

export default database;
