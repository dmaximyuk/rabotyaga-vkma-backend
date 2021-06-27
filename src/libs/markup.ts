import fetch from 'node-fetch';
import Intl from 'intl';
import shop from './data/shop.json';
import config from './data/config.json'
import {
  mongodb,
  timeFormatting
} from './'

type TProps = {
  tFormatting: timeFormatting
  id: number
  checkin: string
}

class Markup {
  private _Id: number;
  private _Checkin: string;
  private _Usd: number;
  private _LastFetching: number;
  private _TimeFormatting: timeFormatting;
  private _User: any;
  
  constructor(props: TProps) {
    this._Id = props.id;
    this._Checkin = props.checkin;
    this._Usd = 80;
    this._LastFetching = 1;
    this._TimeFormatting = props.tFormatting
    this._User = {};
}

  private updateCourse = async () => {
    const getLastFetchingMinutes = this._TimeFormatting.minutes(this._LastFetching)
    this._User = await mongodb({ usr: { id: this._Id, checkin: this._Checkin }, type: "GET" })

    if (getLastFetchingMinutes >= 10 || this._LastFetching === 1) {
      let fetchingCourses = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      if (fetchingCourses) this._LastFetching = Date.now();
      let courses: any = await fetchingCourses.json();
      this._Usd = courses.Valute['USD'].Value;
    }
  }

  private randomNum = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getBusinesses = async () => {
    await this.updateCourse()
    const businesses = shop.business;
    const newArr = businesses.map((item) => {
      let cost = Math.floor(item.cost * this._Usd);
      let earnings = Math.floor(((cost / 100) * config.business.earnings) / 24)
      let maxEarnings = Math.floor(earnings) * config.business.factory
      let tax = Math.floor((earnings / 100) * config.business.tax)
      let disable = !(this._User.balance >= cost)

      return {
        id: item.id,
        img: item.img,
        type: item.type,
        disable: disable,
        title: item.name,
        cost: cost,
        costString: new Intl.NumberFormat('ru').format(cost),
        earnings: earnings,
        earningsString: new Intl.NumberFormat('ru').format(earnings),
        maxEarnings: maxEarnings,
        maxEarningsString: new Intl.NumberFormat('ru').format(maxEarnings),
        tax: tax,
        taxString: new Intl.NumberFormat('ru').format(tax),
        exp: this.randomNum(50, 100)
      }
    })

    console.log(newArr)
    return newArr;
  }

  getJobs = async () => {
    await this.updateCourse()
    const jobs = shop.job;
    const newArr = jobs.map((item) => {
      let earnings = Math.floor((item.earnings * this._Usd) / 24)
      return {
        id: item.id,
        img: 'https://img.delo-vcusa.ru/2019/11/arabskaja-shaurma.jpg',
        type: item.type,
        title: item.name,
        level: item.level,
        earnings: earnings,
        earningsString: new Intl.NumberFormat('ru').format(earnings),
        maxEarnings: Math.floor(earnings * config.job.factory),
        maxEarningsString: new Intl.NumberFormat('ru').format(Math.floor(earnings * config.job.factory)),
        exp: this.randomNum(10, 100)
      }
    })

    return newArr;
  }
}

export default Markup;