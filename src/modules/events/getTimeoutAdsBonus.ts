import { User } from "../index";
import { mongodb } from "../../libs";

type TProps = {
  user: User;
  date?: number;
};

const getTimeoutAdsBonus = async ({ user, date }: TProps) => {
  const { id, checkin } = user;
  const type = "ADS_TIMEOUT";

  if (!date) {
    const data: any = await mongodb({
      usr: { id: id, checkin: checkin },
      type: "GET",
    });

    return user.send(type, Math.floor((data.bonus - Date.now()) / 1000 / 60));
  }

  return user.send(type, Math.floor((date - Date.now()) / 1000 / 60));
};

export default getTimeoutAdsBonus;
