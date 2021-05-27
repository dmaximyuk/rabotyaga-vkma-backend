import { VK } from 'vk-io';
import TimeFormatting from './timeFormatting';
const tForm = new TimeFormatting();

class Donut {
  private _DateLastFetching: number;
  private _vk: VK;
  private _list: number[];

  constructor(vk: VK) {
    this._DateLastFetching = Date.now();
    this._vk = vk;
    this._list = [];
    
    this.get("FIRST_START");
  }

  get = (type?: string) => {
    if (type === "FIRST_START" || tForm.minutes(this._DateLastFetching)  >= 10) return this.fetchingDonuts();
    return this._list
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
    this._list = arr;
    return this._list;
  };

  getDonuts = (offset?: number) => this._vk.api.groups.getMembers({
    group_id: "204463745",
    // filter: "donut",
    offset: offset || 0
  })
}

export default Donut;