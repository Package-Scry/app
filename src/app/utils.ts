export const getPackageStatus = (
  current: string,
  wanted: string,
  latest: string
): string => {
  if (latest === current) return "up to date"
  else if (wanted !== latest && current !== latest) return "outdated"

  return "updatable"
}
