import { VK } from 'vk-io';
import TimeFormatting from './timeFormatting';
const tForm = new TimeFormatting();

class Donut {
  private _DateLastFetching: number;
  vk: VK;
  private _Vk: VK;
  private _List: number[];

  constructor(vk: VK) {
    this._DateLastFetching = 1;
    this.vk = vk;
    this._Vk = vk;
    this._List = [];
  }

  get = async () => {
    if (this._DateLastFetching === 1 || tForm.minutes(this._DateLastFetching)  >= 3) return await this.fetchingDonuts();
    return this._List
  };

  fetchingDonuts = async () => {
    const arr: number[] = [];
    let firstFetching: any = await this.getDonuts();
    const factory = Math.floor(firstFetching.count / 1000) <= 1 ? 1 : Math.floor(firstFetching.count / 1000);

    for (let i = 0; i < factory; i++) {
      let fetching:any = await this.getDonuts(i);
      arr.push(...fetching.items);
    }

    this._DateLastFetching = Date.now();
    this._List = arr;
    return arr;
  };

  getDonuts = (offset?: number) => this._Vk.api.groups.getMembers({
    group_id: "204463745",
    filter: "donut",
    offset: offset || 0
  })
}

export default Donut;