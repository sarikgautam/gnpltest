export function calculateStandings(teams: any[], fixtures: any[], results: any[]) {
  const table: any = {};

  // Initialize table for each team
  teams.forEach((team) => {
    table[team.id] = {
      team_id: team.id,
      team_name: team.name,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      nr: 0,
      points: 0,
      runs_scored: 0,
      overs_faced: 0,
      runs_conceded: 0,
      overs_bowled: 0,
      nrr: 0,
    };
  });

  // Process each result
  results.forEach((result) => {
    const fixture = fixtures.find((f) => f.id === result.match_id);
    if (!fixture) return;

    const teamA = fixture.team_a;
    const teamB = fixture.team_b;

    const rw = result.runs_wickets;

    // Increase played count
    table[teamA].played += 1;
    table[teamB].played += 1;

    // Extract runs and overs
    const aRuns = rw.team_a.runs;
    const aOvers = rw.team_a.overs;
    const bRuns = rw.team_b.runs;
    const bOvers = rw.team_b.overs;

    // Team A stats
    table[teamA].runs_scored += aRuns;
    table[teamA].overs_faced += aOvers;
    table[teamA].runs_conceded += bRuns;
    table[teamA].overs_bowled += bOvers;

    // Team B stats
    table[teamB].runs_scored += bRuns;
    table[teamB].overs_faced += bOvers;
    table[teamB].runs_conceded += aRuns;
    table[teamB].overs_bowled += aOvers;

    // Win/Loss/Tie
    if (result.winner === teamA) {
      table[teamA].won += 1;
      table[teamA].points += 2;
      table[teamB].lost += 1;
    } else if (result.winner === teamB) {
      table[teamB].won += 1;
      table[teamB].points += 2;
      table[teamA].lost += 1;
    }
  });

  // Calculate NRR
  Object.values(table).forEach((row: any) => {
    const scoredRate = row.overs_faced > 0 ? row.runs_scored / row.overs_faced : 0;
    const concededRate = row.overs_bowled > 0 ? row.runs_conceded / row.overs_bowled : 0;
    row.nrr = parseFloat((scoredRate - concededRate).toFixed(3));
  });

  // Convert object → sorted array
  return Object.values(table).sort((a: any, b: any) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });
}
