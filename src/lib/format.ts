export function fmt(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined) return "—"
  return Number(n.toFixed(decimals)).toString()
}
