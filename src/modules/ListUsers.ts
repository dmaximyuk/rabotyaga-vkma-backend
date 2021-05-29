import cron from 'node-cron';

class ListUser {
  private _list: Map<string, any>;
  constructor() {
    this._list = new Map();
    cron.schedule('*/1 * * * *', () => this.controllActive());
  }

  controllActive = () => {
    this._list.forEach((item) => {
      if (Date.now() > (item.ping + 120000)) {
        item.disconnect();
        this.removeUser(item);
      }
    })
  }

  get length() { return this._list.size };
  get list() { return this._list };

  addUser = (user: any) => this._list.set(user.id, user);

  removeUser = (user: any) => this._list.delete(user.id);
}

export default ListUser;