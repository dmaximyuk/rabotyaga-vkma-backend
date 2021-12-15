import { User } from "../index";
import { mongodb } from "../../libs";

type TProps = {
  user: User;
};

const getTimeoutAdsBonus = async ({ user }: TProps) => {
  const { id, checkin } = user;

  const data: any = await mongodb({
    usr: { id: id, checkin: checkin },
    type: "GET",
  });

  return user.send(
    "ADS_TIMEOUT",
    Math.floor((data.bonus - Date.now()) / 1000 / 60)
  );
};

export default getTimeoutAdsBonus;
