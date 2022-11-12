import { TClientEvents } from "@app/engine/types";

const generateParams = (type: TClientEvents, params: object) =>
  JSON.stringify({
    type: type,
    params: params,
  });

export default generateParams;
