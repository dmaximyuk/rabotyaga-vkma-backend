export default (id: number, params?: { checkin?: string }) => {
  return {
    id: id,
    checkin: params?.checkin || "0",
    ban: 0,
    exp: 0,
    balance: 1000,
    bonus: 0,
  };
};
