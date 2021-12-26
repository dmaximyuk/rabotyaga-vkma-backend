import database from "../../database";
import { User } from "../index";

const sendFallback = async (user: User, text?: string, disconnect?: { isBan: boolean, count: 1 | 2 | 3 }) => {
  user.send("FALLBACK", text || "Произошла ошибка на сервере, уже исправляем!");
  if (disconnect?.isBan) {
    database("SET_BLOCK", { id: user.id, count: disconnect.count })
    setTimeout(() => user.disconnect(), 3000);
  }
  return;
}
export default sendFallback;
