import { User } from '../index'
import { VK } from 'vk-io';

const vk = new VK({ token: process.env.TOKEN || "" });

import {
  mongodb,
  reduceNumber
} from '../../libs';

type TProps = {
  user: User;
  params?: any;
}

const SubscribeBonus = async ({ user }: TProps) => {
  const id = user.id
  const checkin = user.checkin
  const checkUser: number = await vk.api.groups.isMember({ group_id: '204463745', user_id: user.id })

  if (checkUser === 1) {
    const data: any = await mongodb({ 
      usr: { id: id, checkin: checkin }, 
      type: "GET" 
    });
    
    data.subscribe = true;
    data.balance += 15000;

    let save = await mongodb({
      usr: { id: id, checkin: checkin },
      newDate: data,
      type: "SAVE"
    })
    
    console.log(save)

    if ( save === "SUCESSFUL" ) {
      user.send("SUBSCRIBE_GROUP", true)
      return user.send("BALANCE", reduceNumber(data.balance))
    }
  }
  return user.send("SUBSCRIBE_GROUP", false)
}

export default SubscribeBonus