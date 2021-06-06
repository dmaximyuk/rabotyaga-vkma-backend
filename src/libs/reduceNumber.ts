const ReduceNumber = (num: number) => {
  const SI_SYMBOL = ["", "тыс.", "млн.", "млрд.", "трлн.", "квдрлн."]
  const tier = Math.log10(num) / 3 | 0
  if (tier === 0) return `${num}`
  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = num / scale;
  return `${scaled.toFixed(1)} ${suffix}`.replace(".0", "")
}

export default ReduceNumber;