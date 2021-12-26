import { User } from "../index";
import { reduceNumber } from "../../libs";
import database from "../../database";
import { sendExp, sendFallback, sendMessage, sendMoney } from ".";

type TProps = {
  user: User;
  exp?: number;
  money?: number;
  bonus?: boolean;
  type: "bonus" | "msg" | "success";
  per?: string;
};

const giveUser = async (props: TProps) => {
  const { user, exp = undefined, money = undefined, bonus = false, type, per = ''} = props;
  const { id } = user;
  const data: any = await database("GET_USER", { id: id });

  data.balance += money || 0;
  data.exp += exp || 0;
  if ( bonus ) data.bonus = Date.now() + 1000 * 60 * 20;

  let save: any= await database("SET_USER", { id: id, params: data });

  if (save ) {
    for (let key in props) {
      switch (key) {
        case "money":
          sendMoney(user, data.balance);
          break;
        case "exp":
          sendExp(user, data.exp);
          break;
      }
    }

    if (money || exp) {
      const msgMoney = money ? `+${reduceNumber(money)} ₽ ` : "";
      const msgAnd = money ? "и " : " ";
      const msgExp = exp ? `${msgAnd}+${reduceNumber(exp)} exp` : "";
      const message = `Вы получили ${msgMoney}${msgExp}` + per;
      if ( bonus ) user.send("ADS_TIMEOUT", 20)
      return sendMessage(user, message, type);
    }
  }

  return sendFallback(user);
};

export default giveUser;
