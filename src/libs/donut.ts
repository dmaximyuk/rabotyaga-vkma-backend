import { VK } from 'vk-io';
import TimeFormatting from './timeFormatting';
const tForm = new TimeFormatting();

class Donut {
  private _DateLastFetching: number;
  private _vk: VK;
  private _list: number[];

  constructor(vk: VK) {
    this._DateLastFetching = 1;
    this._vk = vk;
    this._list = [];
    
    this.get();
  }

  get = () => {
    if (this._DateLastFetching === 1 || tForm.minutes(this._DateLastFetching)  >= 10) return this.fetchingDonuts();
    return this._list
  };

  fetchingDonuts = () => this.getDonuts().then((data: any) => {
    const arr: number[] = [];
    const factory = Math.floor(data.count / 1000);

    if (data.count <= 1000) {
      arr.push(...data.items)
      this._DateLastFetching = Date.now();
      this._list = arr;
      return this._list
    }

    for (let i = 0; i < factory; i++) {
      this.getDonuts(i).then((data: any) => {
        if (data.items.length < 1000) {
          arr.push(...data.items)
        }
        arr.push(...data.items)
      });
    }

    this._DateLastFetching = Date.now();
    this._list = arr;
    return this._list
  });

  getDonuts = (offset?: number) => this._vk.api.groups.getMembers({
    group_id: "204463745",
    // filter: "donut",
    offset: offset || 0
  })
}

export default Donut;