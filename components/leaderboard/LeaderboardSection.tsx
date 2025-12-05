import { supabase } from "@/lib/supabaseServer";
import { calculateNRR, toOversDecimal } from "@/lib/calcNRR";

export default async function HomePage() {
  // Fetch teams
  const { data: teams } = await supabase.from("teams").select("id, name, logo");

  // Fetch fixtures (only group stage)
  const { data: fixtures } = await supabase
    .from("fixtures")
    .select("id, team_a, team_b, stage")
    .eq("stage", "Group");

  // Fetch results
  const { data: results } = await supabase.from("results").select("*");

  // Build stats
  const ladder: any = {};

  teams?.forEach((t) => {
    ladder[t.id] = {
      team_id: t.id,
      name: t.name,
      logo: t.logo,
      matches: 0,
      wins: 0,
      losses: 0,
      points: 0,
      runs_for: 0,
      overs_faced: 0,
      runs_against: 0,
      overs_bowled: 0,
      nrr: 0,
    };
  });

  results?.forEach((r) => {
    const fixture = fixtures?.find((f) => f.id === r.match_id);
    if (!fixture) return; // ignore non-group matches

    const teamA = ladder[fixture.team_a];
    const teamB = ladder[fixture.team_b];

    if (!teamA || !teamB) return;

    // Matches increased
    teamA.matches++;
    teamB.matches++;

    // ----- Team A -----
    if (r.team_a_runs != null) {
      teamA.runs_for += r.team_a_runs;
      teamA.overs_faced += toOversDecimal(r.team_a_overs);
    }
    if (r.team_b_runs != null) {
      teamA.runs_against += r.team_b_runs;
      teamA.overs_bowled += toOversDecimal(r.team_b_overs);
    }

    // ----- Team B -----
    if (r.team_b_runs != null) {
      teamB.runs_for += r.team_b_runs;
      teamB.overs_faced += toOversDecimal(r.team_b_overs);
    }
    if (r.team_a_runs != null) {
      teamB.runs_against += r.team_a_runs;
      teamB.overs_bowled += toOversDecimal(r.team_a_overs);
    }

    // Wins / Loss / Points
    if (r.winner === fixture.team_a) {
      teamA.wins++;
      teamB.losses++;
      teamA.points += 2;
    } else if (r.winner === fixture.team_b) {
      teamB.wins++;
      teamA.losses++;
      teamB.points += 2;
    } else {
      // DRAW / TIE
      teamA.points += 1;
      teamB.points += 1;
    }
  });

  // Compute NRR
  Object.values(ladder).forEach((team: any) => {
    team.nrr = calculateNRR(team);
  });

  // Sorted table
  const sorted = Object.values(ladder).sort((a: any, b: any) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  return (
    <div>
      {/* Other homepage sections */}

{/* PREMIUM LADDERBOARD */}
<div className="max-w-6xl mx-auto mt-20 px-4">

  {/* Heading */}
  <h2 className="text-4xl font-extrabold tracking-wide mb-6 text-center">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300 drop-shadow-[0_0_8px_rgba(0,255,100,0.5)]">
      GNPL Points Table
    </span>
  </h2>

  {/* Table Wrapper */}
  <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">

    <table className="w-full text-sm text-white">
      <thead className="sticky top-0 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md border-b border-white/20">
        <tr>
          <th className="p-4 text-left font-semibold">Rank</th>
          <th className="p-4 text-left font-semibold">Team</th>
          <th className="p-4 text-center font-semibold">M</th>
          <th className="p-4 text-center font-semibold">W</th>
          <th className="p-4 text-center font-semibold">L</th>
          <th className="p-4 text-center font-semibold">Points</th>
          <th className="p-4 text-center font-semibold">NRR</th>
        </tr>
      </thead>

      <tbody>
        {sorted.map((t: any, i: number) => (
          <tr
            key={t.team_id}
            className={`
              transition-all duration-300 
              ${i === 0 ? "bg-gradient-to-r from-yellow-500/20 to-yellow-200/10" : "bg-white/5"} 
              border-b border-white/10 
              hover:bg-white/20 hover:scale-[1.01]
            `}
          >
            {/* RANK */}
            <td className="p-4 font-bold text-center">
              <div
                className={`
                  mx-auto w-10 h-10 flex items-center justify-center rounded-full 
                  text-black font-bold shadow-lg 
                  ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-300" : i === 2 ? "bg-amber-700" : "bg-white"}
                `}
              >
                {i + 1}
              </div>
            </td>

            {/* TEAM LOGO + NAME */}
            <td className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={t.logo}
                  className="w-12 h-12 object-contain rounded-lg shadow-md bg-white/10 backdrop-blur-md p-1"
                />

                <span className="font-semibold text-lg bg-gradient-to-r from-green-300 to-lime-200 bg-clip-text text-transparent drop-shadow">
                  {t.name}
                </span>
              </div>
            </td>

            {/* MATCHES */}
            <td className="p-4 text-center font-medium">{t.matches}</td>

            {/* WINS */}
            <td className="p-4 text-center font-medium text-green-300">{t.wins}</td>

            {/* LOSSES */}
            <td className="p-4 text-center font-medium text-red-300">{t.losses}</td>

            {/* POINTS */}
            <td className="p-4 text-center font-extrabold text-green-400 drop-shadow-[0_0_5px_rgba(0,255,0,0.3)]">
              {t.points}
            </td>

            {/* NRR */}
            <td className="p-4 text-center">
              <span className="text-lime-300 font-semibold drop-shadow">
                {t.nrr}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
</div>

      {/* Footer or next sections */}
    </div>
  );
}
