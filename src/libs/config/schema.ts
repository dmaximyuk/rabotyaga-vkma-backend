export default () => {
  return {
    id: Number,
    exp: Number,
    donut: Boolean,
    balance: Number,
    donate: Number,
    bonus: Number,
    transfer: Number,
    business: {
      payback: Number,
      business: Number,
    },
    job: {
      jobparttime: Number,
      job: Number,
      payback: Number,
    },
  };
};
