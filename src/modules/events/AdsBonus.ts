import { User } from "../index";
import database from "../../database";
import { sendFallback } from "../helpers";
import config from "../../libs/data/config.json";
import { getTimeoutAdsBonus } from ".";

type TProps = {
  user: User;
};

const AdsBonus = async ({ user }: TProps) => {
  const { id } = user;
  const data: any = await database("GET_USER", { id: id });

  if (Date.now() - data.bonus > 1){
    await database("SET_USER", { id: id, params: data })
    return sendFallback(user, "Вы уже получали бонус за просмотр рекламы, ваш аккаунт заморожен за подозрительные действия на 1 час.", { isBan: true, count: 1 });
  }

  data.bonus = Date.now() + config.restrictions.adRollback * 60 * 1000;

  const save: any = await database("SET_USER", { id: id, params: data });
  if (save) return await getTimeoutAdsBonus({ user: user });

  return sendFallback(user);
};

export default AdsBonus;
