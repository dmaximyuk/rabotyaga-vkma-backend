import fetch from 'node-fetch';
import shop from './data/shop.json';
import config from './data/config.json'
import {
  timeFormatting
} from './'

type TProps = {
  tFormatting: timeFormatting
}

class Markup {
  private _Usd: number;
  private _LastFetching: number;
  private _TimeFormatting: timeFormatting;

  constructor(props: TProps) {
    this._Usd = 80;
    this._LastFetching = 1;
    this._TimeFormatting = props.tFormatting
  }

  private updateCourse = async () => {
    const getLastFetchingMinutes = this._TimeFormatting.minutes(this._LastFetching)
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
      let cost = item.cost * this._Usd; 
      return {
        id: item.id,
        img: 'https://img.delo-vcusa.ru/2019/11/arabskaja-shaurma.jpg',
        type: item.type,
        title: item.name,
        cost: Math.floor(cost),
        earnings: Math.floor((cost / 100) * config.business.earnings),
        earningsString: Math.floor((cost / 100) * config.business.earnings),
        maxEarnings: Math.floor(Math.floor((cost / 100) * config.business.earnings) * config.business.factory),
        tax: Math.floor((cost / 100) * config.business.tax),
        exp: this.randomNum(10, 100)
      }
    })
    return newArr;
  }

  getJobs = async () => {
    await this.updateCourse()
    const jobs = shop.job;
    const newArr = jobs.map((item) => {
      let earnings = Math.floor(item.earnings * this._Usd)
      return {
        id: item.id,
        img: 'https://img.delo-vcusa.ru/2019/11/arabskaja-shaurma.jpg',
        type: item.type,
        title: item.name,
        level: item.level,
        earnings: earnings,
        earningsString: earnings,
        maxEarnings: Math.floor(earnings * config.job.factory),
        exp: this.randomNum(10, 100)
      }
    })
    return newArr;
  }
}

export default Markup;