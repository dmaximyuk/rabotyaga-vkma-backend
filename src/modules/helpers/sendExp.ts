import { User } from "../index";
import { expFormatting } from "../../libs";
const eForm = new expFormatting();

const sendExp = async (user: User, exp: number) =>
  user.send("EXP", eForm.getLevel(exp).front);
export default sendExp;
