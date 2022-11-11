import chalk from "chalk";

const logger = <T>(...args: Array<T>) =>
  process.env.NODE_ENV === "dev" ? console.log(...args) : () => {};

export default {
  server: <T, K>(args1: K, ...args: Array<T>) =>
    logger(chalk.black(args1, ...args)),
  log: <T, K>(args1: K, ...args: Array<T>) =>
    logger(chalk.blue(args1, ...args)),
  debug: <T, K>(args1: K, ...args: Array<T>) =>
    logger(chalk.white(args1, ...args)),
  error: <T, K>(args1: K, ...args: Array<T>) =>
    logger(chalk.red(args1, ...args)),
};
