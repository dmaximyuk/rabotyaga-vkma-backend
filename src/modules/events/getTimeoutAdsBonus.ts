import { User } from "../index";
import database from "../../database";
type TProps = {
  user: User;
  date?: number;
};

const getTimeoutAdsBonus = async ({ user, date }: TProps) => {
  try {
    const { id } = user;
    const type = "ADS_TIMEOUT";

    if (!date) {
      const data: any = await database("GET_USER", { id: id });

      return user.send(type, Math.floor((data.bonus - Date.now()) / 1000));
    }

    return user.send(type, Math.floor((date - Date.now()) / 1000));
  } catch (err) {}
  return;
};

export default getTimeoutAdsBonus;
