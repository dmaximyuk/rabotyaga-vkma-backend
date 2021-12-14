import { User } from "../index";

const sendMessage = async (
  user: User,
  text: string,
  type: "bonus" | "success" | "msg"
) => user.send("MESSAGE", { text: text, type: type });
export default sendMessage;
