const logger = (...args: any) => {
  if (process.env.NODE_ENV === "prod") {
    console.log(...args);
  }

  return () => {};
};

export default logger;
