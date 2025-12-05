import { supabase } from "@/lib/supabaseServer";
import Image from "next/image";

export default async function ScorecardPage({ params }: any) {
  const matchId = (await params).id;

  // ---- FETCH FIXTURE ----
  const { data: fixture, error: fixtureErr } = await supabase
    .from("fixtures")
    .select("*")
    .eq("id", matchId)
    .single();

  if (!fixture || fixtureErr) {
    return (
      <div className="p-10 text-center text-white">
        <h1 className="text-3xl font-bold text-red-400">Match not found</h1>
      </div>
    );
  }

  // ---- FETCH RESULT ----
  const { data: result } = await supabase
    .from("results")
    .select("*")
    .eq("match_id", matchId)
    .single();

  // ---- FETCH TEAMS ----
  const { data: teams } = await supabase.from("teams").select("*");

  const teamA = teams?.find((t) => t.id === fixture.team_a);
  const teamB = teams?.find((t) => t.id === fixture.team_b);

  // ---- FETCH PLAYER STATS ----
  const { data: stats } = await supabase
    .from("player_match_stats")
    .select("*, players(*)")
    .eq("match_id", matchId);

  const battingA = stats?.filter((s) => s.players.team_id === teamA?.id) || [];
  const battingB = stats?.filter((s) => s.players.team_id === teamB?.id) || [];
  // ---- FETCH PLAYER OF THE MATCH ----
let playerOfMatchName = null;

if (result?.player_of_match) {
  const { data: pomPlayer } = await supabase
    .from("players")
    .select("name")
    .eq("id", result.player_of_match)
    .single();

  playerOfMatchName = pomPlayer?.name || null;
}


  // helpers
  const formatOvers = (o: any) => (o ? o.toString() : "-");

  const scoreA = result
    ? `${result.team_a_runs}/${result.team_a_wickets} (${formatOvers(result.team_a_overs)})`
    : "—";

  const scoreB = result
    ? `${result.team_b_runs}/${result.team_b_wickets} (${formatOvers(result.team_b_overs)})`
    : "—";

  return (
    <div className="min-h-screen p-6 text-white bg-[#060b0a]">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg">
          <h1 className="text-3xl font-bold text-green-400">
            Match #{fixture.match_no} – Scorecard
          </h1>
          <p className="text-gray-300 mt-1">
            {fixture.stage} • {fixture.overs} overs
          </p>
        </div>

        {/* TEAM SCORES */}
        <div className="grid md:grid-cols-2 gap-6">
          {[{ team: teamA, score: scoreA }, { team: teamB, score: scoreB }].map(
            ({ team, score }, idx) => (
              <div
                key={idx}
                className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg flex items-center gap-4"
              >
                <Image
                  src={team?.logo || "/no-logo.png"}
                  alt={team?.name || ""}
                  width={80}
                  height={80}
                  className="object-contain rounded-lg"
                />
                <div>
                  <p className="text-xl font-bold text-green-300">{team?.name}</p>
                  <p className="text-2xl font-extrabold mt-1">{score}</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* WINNER */}
        {result && (
          <div className="bg-green-500/20 text-green-300 p-4 rounded-lg border border-green-500/40">
            <p className="text-lg font-semibold">
              Winner: {teams?.find((t) => t.id === result.winner)?.name}
            </p>
            {result.score_summary && (
              <p className="text-sm text-gray-300 mt-1">{result.score_summary}</p>
            )}
          </div>
        )}

        {/* PLAYER OF THE MATCH */}
{playerOfMatchName && (
  <div className="bg-yellow-500/10 text-yellow-300 p-4 rounded-lg border border-yellow-500/40">
    <p className="text-lg font-semibold">
      Player of the Match: {playerOfMatchName}
    </p>
  </div>
)}

        {/* BATTING TABLES */}
        {[{ label: teamA?.name, list: battingA }, { label: teamB?.name, list: battingB }].map(
          ({ label, list }, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg"
            >
              <h2 className="text-2xl text-green-400 font-bold mb-4">{label} Batting</h2>

              <table className="w-full text-left text-sm">
                <thead className="text-gray-300 border-b border-white/20">
                  <tr>
                    <th className="py-2">Player</th>
                    <th>R</th>
                    <th>B</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>SR</th>
                  </tr>
                </thead>

                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-gray-500 py-3">
                        No batting data
                      </td>
                    </tr>
                  ) : (
                    list.map((s: any) => (
                      <tr key={s.id} className="border-b border-white/10">
                        <td className="py-2">{s.players.name}</td>
                        <td>{s.runs}</td>
                        <td>{s.balls}</td>
                        <td>{s.fours}</td>
                        <td>{s.sixes}</td>
                        <td>
                          {s.balls > 0
                            ? ((s.runs / s.balls) * 100).toFixed(1)
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* BOWLING TABLES */}
        {[{ label: teamA?.name, list: battingB }, { label: teamB?.name, list: battingA }].map(
          ({ label, list }, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg"
            >
              <h2 className="text-2xl text-green-400 font-bold mb-4">{label} Bowling</h2>

              <table className="w-full text-left text-sm">
                <thead className="text-gray-300 border-b border-white/20">
                  <tr>
                    <th className="py-2">Player</th>
                    <th>O</th>
                    <th>R</th>
                    <th>W</th>
                    <th>Econ</th>
                  </tr>
                </thead>

                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-gray-500 py-3">
                        No bowling data
                      </td>
                    </tr>
                  ) : (
                    list.map((s: any) => (
                      <tr key={s.id} className="border-b border-white/10">
                        <td className="py-2">{s.players.name}</td>
                        <td>{s.overs}</td>
                        <td>{s.runs}</td>
                        <td>{s.wickets}</td>
                        <td>
                          {s.overs && Number(s.overs) > 0
                            ? (s.runs / Number(s.overs)).toFixed(1)
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>
    </div>
  );
}
