const rateLimit = (interval: number): Function => {
  let date: number | undefined = undefined;

  setInterval(() => (date = undefined), interval);

  return (): boolean => {
    if (date && Date.now() + interval >= date) return true;

    date = Date.now() + interval;
    return false;
  };
};

export default rateLimit;
