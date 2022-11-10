import chalk from "chalk";

const logger = <T>(...args: Array<T>) =>
  process.env.NODE_ENV === "dev" ? console.log(...args) : () => {};

export default {
  server: <T>(...args: Array<T>) => logger(chalk.black(...args)),
  log: <T>(...args: Array<T>) => logger(chalk.blue(...args)),
  debug: <T>(...args: Array<T>) => logger(chalk.white(...args)),
  error: <T>(...args: Array<T>) => logger(chalk.red(...args)),
};
