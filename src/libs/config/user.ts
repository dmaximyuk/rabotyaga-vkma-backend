export default (id: number) => {
  return {
    id: id,
    exp: 0,
    balance: 1000,
    bonus: 0,
    transfer: 0,
    business: {
      payback: 0,
      business: 0,
    },
    job: {
      jobparttime: 0,
      job: 0,
      payback: 0,
    },
  };
};
