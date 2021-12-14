import { User } from "../index";
import { mongodb, reduceNumber } from "../../libs";
import { sendExp, sendFallback, sendMessage, sendMoney } from ".";

type TProps = {
  user: User;
  exp?: number;
  money?: number;
  type: "bonus" | "msg" | "success";
};

const giveUser = async (props: TProps) => {
  const { user, exp = undefined, money = undefined, type } = props;
  const { id, checkin } = user;
  const data: any = await mongodb({
    usr: { id: id, checkin: checkin },
    type: "GET",
  });

  data.balance += money || 0;
  data.exp += exp || 0;

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
      return sendMessage(user, message, type);
    }
  }

  return sendFallback(user, "Произошла ошибка на сервере, уже исправляем!");
};

export default giveUser;
