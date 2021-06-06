import Intl from 'intl';

type TGenerate = {
  maxLevel?: number;
} 

class expFormatting {
  private _Levels: number[];
  private _Exp: number;

  constructor() {
    this._Levels = [];
    this._Exp = 0;
  }

  private generate = ({maxLevel = 100}: TGenerate) => {
    const lvls: number[] = [];
    let num: number = 0;

    for (let i = 0; i <= maxLevel; i++) {
      num += 200 * i;
      lvls.push(Math.floor(num));
    }

    return this._Levels = lvls;
  }

  private getIndex = () => this._Levels.findIndex((number) => (number > this._Exp));

  getLevel = (exp: number) => {
    this._Exp = exp;
    this.generate({});

    let index = this.getIndex();
    let myExp = this._Exp;
    
    if (this._Exp >= this._Levels[this._Levels.length - 1]) {
      myExp = this._Levels[this._Levels.length - 1];
      index = this._Levels.length - 1;
    }

    return {
      back: { level: index, myExp: myExp, maxExp: this._Levels[index] },
      front: `${index} (${new Intl.NumberFormat('ru-RU').format(myExp)}/${new Intl.NumberFormat('ru-RU').format(this._Levels[index])} exp)`
    }
  }
}

export default expFormatting;