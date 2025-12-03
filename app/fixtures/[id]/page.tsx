import { supabase } from "@/lib/supabaseServer";
import Image from "next/image";

export default async function ScorecardPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id: fixtureId } = await props.params;

  console.log("🔍 SCORECARD FIXTURE ID:", fixtureId);

  // 1) Load fixture
  const { data: fixture, error: fixtureErr } = await supabase
    .from("fixtures")
    .select("*")
    .eq("id", fixtureId)
    .single();

  console.log("📘 FIXTURE:", fixture);

  if (!fixture) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Match not found
      </div>
    );
  }

  // 2) Load result
  const { data: result, error: resultErr } = await supabase
    .from("results")
    .select("*")
    .eq("match_id", fixtureId)
    .single();

  console.log("📙 RESULT:", result);

  // 3) Load teams
  const { data: teams } = await supabase
    .from("teams")
    .select("id,name,logo");

  const teamA = teams?.find((t) => t.id === fixture.team_a);
  const teamB = teams?.find((t) => t.id === fixture.team_b);

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-green-400 mb-6">
          Match #{fixture.match_no} Scorecard
        </h1>

        {/* MATCH INFO */}
        <div className="bg-white/10 p-6 rounded-xl backdrop-blur border border-white/20">

          {/* TEAMS */}
          <div className="flex items-center justify-between mb-6">
            {/* TEAM A */}
            <div className="flex items-center gap-3">
              <Image
                src={teamA?.logo || "/no-logo.png"}
                alt={teamA?.name || "Team A"}
                width={50}
                height={50}
                className="object-contain"
              />
              <h2 className="text-xl font-semibold">{teamA?.name}</h2>
            </div>

            <span className="text-gray-400">vs</span>

            {/* TEAM B */}
            <div className="flex items-center gap-3">
              <Image
                src={teamB?.logo || "/no-logo.png"}
                alt={teamB?.name || "Team B"}
                width={50}
                height={50}
                className="object-contain"
              />
              <h2 className="text-xl font-semibold">{teamB?.name}</h2>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-3">
            Stage: <span className="text-green-300">{fixture.stage}</span> •{" "}
            Overs: <span className="text-green-300">{fixture.overs}</span>
          </p>

          <hr className="border-white/20 my-4" />

          {/* RESULT SUMMARY */}
          {result ? (
            <>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Result</h2>
              <p className="text-lg mb-4">{result.score_summary}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* TEAM A SCORE */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/20">
                  <h3 className="text-green-300 font-semibold mb-2">
                    {teamA?.name}
                  </h3>

                  <p>Runs: {result.team_a_runs}</p>
                  <p>Wickets: {result.team_a_wickets}</p>
                  <p>Overs: {result.team_a_overs}</p>
                </div>

                {/* TEAM B SCORE */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/20">
                  <h3 className="text-green-300 font-semibold mb-2">
                    {teamB?.name}
                  </h3>

                  <p>Runs: {result.team_b_runs}</p>
                  <p>Wickets: {result.team_b_wickets}</p>
                  <p>Overs: {result.team_b_overs}</p>
                </div>
              </div>

              {/* PLAYER OF MATCH */}
              <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20">
                <h3 className="font-bold text-green-300 mb-2">
                  Player of the Match
                </h3>
                <p>{result.player_of_match || "Not recorded"}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-400 mt-6">
              No result added yet. Match not completed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
