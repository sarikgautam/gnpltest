import { supabase } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function PublicPlayerStatsPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  // ----------------------------
  // 1️⃣ FETCH RESULT
  // ----------------------------
  const { data: result } = await supabase
    .from("results")
    .select("*")
    .eq("match_id", matchId)
    .single();

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Result not found
      </div>
    );
  }

  // ----------------------------
  // 2️⃣ FETCH FIXTURE
  // ----------------------------
  const { data: fixture } = await supabase
    .from("fixtures")
    .select("*")
    .eq("id", matchId)
    .single();

  // ----------------------------
  // 3️⃣ FETCH TEAM PLAYERS
  // ----------------------------
  const { data: teamAplayers } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", fixture?.team_a || "");

  const { data: teamBplayers } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", fixture?.team_b || "");

  // ----------------------------
  // 4️⃣ PLAYER OF THE MATCH
  // ----------------------------
  let playerOfMatchName: string | null = null;

  if (result.player_of_match) {
    const { data: pomPlayer } = await supabase
      .from("players")
      .select("name")
      .eq("id", result.player_of_match)
      .single();

    playerOfMatchName = pomPlayer?.name || null;
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Player Stats – Match #{fixture?.match_no}
      </h1>

      {/* PLAYER OF MATCH */}
      <p className="text-gray-300 mb-6">
        Player of the Match:{" "}
        <span className="text-green-400">{playerOfMatchName || "N/A"}</span>
      </p>

      {/* PLAYER STATS CARD */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* TEAM A */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">
            {fixture?.team_a_name || "Team A"}
          </h2>

          {!teamAplayers?.length ? (
            <p className="text-gray-400">No players found.</p>
          ) : (
            <ul className="space-y-3">
              {teamAplayers.map((p: any) => (
                <li
                  key={p.id}
                  className="flex justify-between bg-black/20 px-3 py-2 rounded-lg"
                >
                  <span>{p.name}</span>
                  <span className="text-green-300">
                    {p.runs} runs • {p.wickets} wkts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* TEAM B */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">
            {fixture?.team_b_name || "Team B"}
          </h2>

          {!teamBplayers?.length ? (
            <p className="text-gray-400">No players found.</p>
          ) : (
            <ul className="space-y-3">
              {teamBplayers.map((p: any) => (
                <li
                  key={p.id}
                  className="flex justify-between bg-black/20 px-3 py-2 rounded-lg"
                >
                  <span>{p.name}</span>
                  <span className="text-green-300">
                    {p.runs} runs • {p.wickets} wkts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* BACK */}
      <div className="mt-10">
        <Link
          href="/results"
          className="px-5 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400"
        >
          Back to Results
        </Link>
      </div>
    </div>
  );
}
