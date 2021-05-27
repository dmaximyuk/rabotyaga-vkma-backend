import cron from 'node-cron';
import { VK } from 'vk-io';

class Donut {
  list: number[];
  vk: VK;

  constructor(vk: VK) {
    this.vk = vk;
    this.list = [];
    this.startWatch();
  }

  startWatch = () => {
    this.getDonut();
    cron.schedule('*/1 * * * *', () => {
      this.getDonut()
    });
  };

  getDonut = () => this.getMembersVK().then((data: any) => {
    const arr: number[] = [];
    const factory = Math.floor(data.count / 1000);

    if (data.count <= 1000) {
      arr.push(...data.items)
      return this.list = arr;
    }

    for (let i = 0; i < factory; i++) {
      this.getMembersVK(i).then((data: any) => {
        if (data.items.length < 1000) {
          arr.push(...data.items)
        }
        arr.push(...data.items)
      });
    }

    return this.list = arr;
  });

  getMembersVK = (offset?: number) => this.vk.api.groups.getMembers({
    group_id: "204463745",
    // filter: "donut",
    offset: offset || 0
  })
}

export default Donut;