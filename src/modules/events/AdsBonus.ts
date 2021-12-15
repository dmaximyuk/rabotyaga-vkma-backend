import { User } from "../index";
import { mongodb } from "../../libs";
import { sendFallback } from "../helpers";

type TProps = {
  user: User;
};

const AdsBonus = async ({ user }: TProps) => {
  const { id, checkin } = user;

  const data: any = await mongodb({
    usr: { id: id, checkin: checkin },
    type: "GET",
  });

  data.bonus = Date.now() + 20 * 60 * 1000;

  let save = await mongodb({
    usr: { id: id, checkin: checkin },
    newDate: data,
    type: "SAVE",
  });

  if (save === "SUCESSFUL") return user.send("ADS_TIMEOUT", 20);

  return sendFallback(user);
};

export default AdsBonus;
