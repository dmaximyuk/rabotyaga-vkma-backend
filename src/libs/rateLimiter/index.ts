const rateLimit = (interval: number): Function => {
  let date: number | undefined = undefined;

  setInterval(() => {
    date = undefined;
  }, interval);

  return (): boolean => {
    const newDate = Date.now() + interval;

    if (date && newDate >= date) {
      return true;
    }

    date = newDate;
    return false;
  };
};

export default rateLimit;
