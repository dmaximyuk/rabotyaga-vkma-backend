import chalk from "chalk";

const log = <T>(...args: Array<T>) =>
  process.env.NODE_ENV === "dev" ? console.log(...args) : () => {};

export const logger = {
  server: <T, K>(args1: K, ...args: Array<T>) =>
    log(chalk.black(args1, ...args)),
  log: <T, K>(args1: K, ...args: Array<T>) => log(chalk.blue(args1, ...args)),
  debug: <T, K>(args1: K, ...args: Array<T>) =>
    log(chalk.white(args1, ...args)),
  error: <T, K>(args1: K, ...args: Array<T>) => log(chalk.red(args1, ...args)),
};
