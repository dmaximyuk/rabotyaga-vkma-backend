import fetch from 'node-fetch';
import shop from './data/shop.json';
import config from './data/config.json'

class Markup {
  private _Usd: number;

  constructor() {
    this._Usd = 80;
  }

  private updateCourse = async () => {
    let fetchingCourses = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    let courses: any = await fetchingCourses.json();
    this._Usd = courses.Valute['USD'].Value;
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
        cost: Math.floor(cost),
        earnings: Math.floor((cost / 100) * config.business.earnings),
        maxEarnings: Math.floor(Math.floor((cost / 100) * config.business.earnings) * config.business.factory),
        tax: Math.floor((cost / 100) * config.business.tax),
        exp: Math.floor(this.randomNum(10, 100))
      }
    })
    return newArr;
  }

  getJobs = async () => {
    await this.updateCourse()
    const jobs = shop.job;
    const newArr = jobs.map((item) => {
      let earnings = item.earnings * this._Usd
      return {
        id: item.id,
        level: item.level,
        earnings: Math.floor(earnings),
        maxEarnings: Math.floor(Math.floor(earnings) * config.job.factory),
        exp: Math.floor(this.randomNum(10, 100))
      }
    })
    return newArr;
  }
}

export default Markup;