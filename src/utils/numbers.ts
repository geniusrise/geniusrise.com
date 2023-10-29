export function shortNum(num: number): string {
  let ret = "----"
  let sign = num < 0 ? "-" : ""
  num = Math.abs(num)

  if (num >= 10000000) ret = (num / 10000000).toFixed(2) + "Cr"
  else if (num >= 100000) ret = (num / 100000).toFixed(2) + "L"
  else if (num >= 1000) ret = (num / 1000).toFixed(2) + "K"
  else ret = num.toFixed(2).toString()

  return (sign + ret).toString()
}
