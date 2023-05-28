import { createHmac } from "node:crypto";
import { queryParam } from "@app/libs";

export function vkSign(appKey: string, secret: string): boolean {
  const index = appKey.lastIndexOf("&");
  const query = appKey.substring(0, index);
  const sign = appKey.substring(appKey.length, index + 6);

  const appId = queryParam("vk_app_id", appKey);
  if (!appId) return false;

  const digest = createHmac("sha256", secret).update(query).digest("base64url");

  return sign === digest;
}
