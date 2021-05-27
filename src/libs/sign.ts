import crypto from 'crypto'
import { TVKSign } from 'types';

export default (token: string): TVKSign => {
  if (!token) return { auth: false, data: undefined }
  const qs = require('querystring');
  let dataSign = Buffer.from(token.replace(/[a-z]/gi, char => /[a-z]/.test(char) ? char.toUpperCase() : char.toLowerCase()), 'base64').toString('utf8');
  let urlParams = qs.parse(dataSign);
  let ordered: { [key: string]: string } = {};
  urlParams && Object.keys(urlParams).sort().forEach((key) => {
    if (key.slice(0, 3) === 'vk_') {
      ordered[key] = urlParams[key];
    }
  });
  const stringParams = qs.stringify(ordered);
  const paramsHash = crypto
    .createHmac('sha256', `${process.env.SECRET_KEY_VKMA}`)
    .update(stringParams)
    .digest()
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=$/, '');

  let check = paramsHash == urlParams.sign;
  const result = {
    auth: check,
    data: check ? urlParams : undefined,
  }

  return result;
}