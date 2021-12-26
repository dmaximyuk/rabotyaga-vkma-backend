import { User } from "../index";
import { VK } from "vk-io";

const vk = new VK({ token: process.env.TOKEN || "" });

import { reduceNumber } from "../../libs";
import database from "../../database";

type TProps = {
  user: User;
  params?: any;
};

const SubscribeBonus = async ({ user }: TProps) => {
  const id = user.id;
  const checkUser: number = await vk.api.groups.isMember({
    group_id: "204463745",
    user_id: user.id,
  });

  if (checkUser === 1) {
    const data: any = await database("GET_USER", { id: id });

    data.subscribe = true;
    data.balance += 15000;

    let save: any = await database("SET_USER", { id: id, params: data });
    if (save) {
      user.send("SUBSCRIBE_GROUP", true);
      return user.send("BALANCE", reduceNumber(data.balance));
    }
  }
  return user.send("SUBSCRIBE_GROUP", false);
};

export default SubscribeBonus;
