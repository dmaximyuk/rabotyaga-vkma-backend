import mongoose from 'mongoose';
import Config from './data/config.json';
import { jsonUser, SavedUser } from './config/index';
import { TMongoDB } from '../types'

mongoose.connect('mongodb://127.0.0.1:27017/getRich', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

export default async ({ usr, newDate, type }: TMongoDB) => {
  const saveUser = await SavedUser.findOne({ id: newDate?.id, __v: newDate?.__v });
  const getUser = await SavedUser.findOne({ id: usr.id });
  const data = await SavedUser.find({}).limit(20).sort('-balance');

  switch (type) {
    case "SAVE":
      if (!saveUser) return 'ERR_CODE_1';
      const limit: number = Config.restrictions.maxMoney;
      const balance:any = newDate.balance;
      if ( balance >= limit) newDate.balance = limit;
      if ( balance < 1) newDate.balance = 0;
      newDate.__v = Number(newDate.__v) + 1;
      console.log('saveUser', saveUser);
      console.log('newDate', newDate);
      const save = await SavedUser.updateOne(saveUser, newDate);
      console.log('status save:', save);
      return 'SUCESSFUL';
    case "GET_RATING": return data.map((user: any) => { return { id: user.id, balance: user.balance } });
    case "GET":
      if (getUser) return getUser._doc;
      const user = jsonUser(usr.id, usr.checkin);
      const dataUser = await new SavedUser(user).save();
      return dataUser;
    default: return console.log("MongoDB: not type");
  }
};
