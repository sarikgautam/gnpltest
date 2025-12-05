export function toOversDecimal(value: string | number | null): number {
  if (!value) return 0;

  const str = value.toString();
  if (!str.includes(".")) return Number(str);

  const [overs, balls] = str.split(".");
  const o = Number(overs);
  const b = Number(balls);

  return o + b / 6;
}

export function calculateNRR(stats: any) {
  const { runs_for, overs_faced, runs_against, overs_bowled } = stats;

  const forRate =
    overs_faced > 0 ? runs_for / overs_faced : 0;

  const againstRate =
    overs_bowled > 0 ? runs_against / overs_bowled : 0;

  return Number((forRate - againstRate).toFixed(3));
}
