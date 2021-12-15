import { User } from "../index";

const sendFallback = async (user: User, text?: string) =>
  user.send("FALLBACK", text || "Произошла ошибка на сервере, уже исправляем!");
export default sendFallback;
