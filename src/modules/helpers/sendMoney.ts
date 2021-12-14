import { User } from "../index";
import { reduceNumber } from "../../libs";

const sendMoney = async (user: User, money: number) =>
  user.send("BALANCE", reduceNumber(money));
export default sendMoney;
