/* eslint-disable max-len */
const mongoose = require('mongoose');
import Config from './data/config.json';
const { jsonUser, schema } = require('./config/index');

mongoose.connect('mongodb://127.0.0.1:27017/getRich', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

const SaveUser = new mongoose.Schema(schema, {
  collection: 'Users',
  minimize: false,
});

const SavedUser = mongoose.model('UserReg', SaveUser);

type TMongoDB = {
  usr?: any;
  newDate?: any;
  type: "GET" | "SEARCH" | "GET_RATING" | "SAVE";
}

export default async ({ usr, newDate, type }: TMongoDB) => {
  const saveUser = await SavedUser.findOne({ id: newDate?.id, __v: newDate?.__v });
  const getUser = await SavedUser.findOne({ id: usr.id });
  const data = await SavedUser.find({}).limit(20).sort('-balance');

  switch (type) {
    case "SAVE":
      if (saveUser) return 'ERR_CODE_1';
        const limit: number = Config.restrictions.maxMoney;
        const balance:any = newDate.balance;
        if ( balance >= limit) newDate.balance = limit;
        if ( balance < 1) newDate.balance = 0;
        let num = Number(newDate.__v);
        num++;
        newDate.__v = num;
        await SavedUser.updateOne(saveUser, newDate);
        return 'SUCESSFUL';
    case "GET_RATING": return data.map((user: any) => { return { id: user.id, balance: user.balance } });
    case "GET":
      if (getUser) return getUser._doc;
      const user = jsonUser(usr);
      return await new SavedUser(user).save();
    default: return console.log("MongoDB: not type");
  }
};
