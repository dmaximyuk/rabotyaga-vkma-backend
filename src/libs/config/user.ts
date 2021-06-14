export default (id: number, date: string) => {
  return {
    id: id,
    checkin: date, 
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
