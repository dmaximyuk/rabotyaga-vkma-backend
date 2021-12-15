import { User } from "../index";
import { mongodb, reduceNumber } from "../../libs";
import { sendExp, sendFallback, sendMessage, sendMoney } from ".";

type TProps = {
  user: User;
  exp?: number;
  money?: number;
  bonus?: boolean;
  type: "bonus" | "msg" | "success";
};

const giveUser = async (props: TProps) => {
  const { user, exp = undefined, money = undefined, bonus = false, type } = props;
  const { id, checkin } = user;
  const data: any = await mongodb({
    usr: { id: id, checkin: checkin },
    type: "GET",
  });

  data.balance += money || 0;
  data.exp += exp || 0;
  if ( bonus ) data.bonus = Date.now() + 1000 * 60 * 20;

  let save = await mongodb({
    usr: { id: id, checkin: checkin },
    newDate: data,
    type: "SAVE",
  });

  if (save === "SUCESSFUL") {
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
      const message = `Вы получили ${msgMoney}${msgExp}`;
      if ( bonus ) user.send("ADS_TIMEOUT", 20)
      return sendMessage(user, message, type);
    }
  }

  return sendFallback(user);
};

export default giveUser;
