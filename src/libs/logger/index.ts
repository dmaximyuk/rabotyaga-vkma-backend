const logger = (...args: any) => {
  if (process.env.NODE_ENV === "dev") {
    console.log(...args);
  }

  return () => {};
};

export default logger;
