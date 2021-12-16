import { User } from "../index";
import { mongodb } from "../../libs";
import { sendFallback } from "../helpers";
import config from "../../libs/data/config.json";
import { getTimeoutAdsBonus } from ".";

type TProps = {
  user: User;
};

const AdsBonus = async ({ user }: TProps) => {
  const { id, checkin } = user;

  const data: any = await mongodb({
    usr: { id: id, checkin: checkin },
    type: "GET",
  });

  data.bonus =
    Date.now() + config.restrictions.adRollback * 60 * 1000;

  let save = await mongodb({
    usr: { id: id, checkin: checkin },
    newDate: data,
    type: "SAVE",
  });

  if (save === "SUCESSFUL") return await getTimeoutAdsBonus({ user: user });

  return sendFallback(user);
};

export default AdsBonus;
