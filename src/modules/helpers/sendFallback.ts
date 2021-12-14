import { User } from "../index";

const sendFallback = async (user: User, text: string) =>
  user.send("FALLBACK", text);
export default sendFallback;
