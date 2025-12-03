import { supabase } from "@/lib/supabaseServer";
import Image from "next/image";

export default async function TeamPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id: teamId } = await props.params;

  // Fetch team
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Team not found
      </div>
    );
  }

  const theme = team.theme_color || "#16a34a"; // fallback: GNPL green

  // Fetch squad
  const { data: squad } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId);

  // Fetch last 5 results
  const { data: results } = await supabase
    .from("results")
    .select("*, fixtures(*)")
    .order("created_at", { ascending: false })
    .limit(5);

  // Stats — Most Runs
  const topRuns = squad
    ?.sort((a, b) => (b.runs || 0) - (a.runs || 0))
    .slice(0, 3);

  // Stats — Most Wickets
  const topWickets = squad
    ?.sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen text-white">

      {/* HERO SECTION */}
      <div
        className="relative h-[260px] w-full px-6 py-10 flex items-center"
        style={{
          background: `linear-gradient(90deg, ${theme}88, #000000aa)`,
        }}
      >
        {/* LOGO */}
        <div className="w-40 h-40 relative mr-6 hidden md:block drop-shadow-2xl">
          <Image
            src={team.logo || "/gnpl.jpg"}
            alt={team.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Team info */}
        <div>
          <h1
            className="text-5xl font-extrabold drop-shadow-xl"
            style={{ color: theme }}
          >
            {team.name}
          </h1>

          <p className="text-gray-200 text-sm max-w-xl mt-3">
            {team.description}
          </p>

          <div className="mt-4 text-gray-200 space-y-1">
            <p>
              <b style={{ color: theme }}>Captain:</b> {team.captain || "N/A"}
            </p>
            <p>
              <b style={{ color: theme }}>Owner:</b> {team.owner || "N/A"}
            </p>
            <p>
              <b style={{ color: theme }}>Manager:</b> {team.manager || "N/A"}
            </p>
            <p>
              <b style={{ color: theme }}>Last Season Rank:</b>{" "}
              {team.last_season_rank || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* TEAM STATS */}
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-bold mb-4" style={{ color: theme }}>
          Team Stats
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* MOST RUNS */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-xl backdrop-blur">
            <h3 className="text-xl font-semibold mb-3" style={{ color: theme }}>
              Most Runs
            </h3>

            {!topRuns?.length ? (
              <p className="text-gray-400">No stats available.</p>
            ) : (
              <div className="space-y-3">
                {topRuns.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className="flex justify-between bg-black/20 px-3 py-2 rounded-lg"
                  >
                    <span>{i + 1}. {p.name}</span>
                    <span style={{ color: theme }}>{p.runs} Runs</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MOST WICKETS */}
          <div className="bg-white/10 border border-white/20 p-5 rounded-xl backdrop-blur">
            <h3 className="text-xl font-semibold mb-3" style={{ color: theme }}>
              Most Wickets
            </h3>

            {!topWickets?.length ? (
              <p className="text-gray-400">No stats available.</p>
            ) : (
              <div className="space-y-3">
                {topWickets.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className="flex justify-between bg-black/20 px-3 py-2 rounded-lg"
                  >
                    <span>{i + 1}. {p.name}</span>
                    <span style={{ color: theme }}>{p.wickets} Wkts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SQUAD SECTION */}
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <h2 className="text-3xl font-bold mb-6" style={{ color: theme }}>
          Full Squad
        </h2>

        {!squad?.length ? (
          <p className="text-gray-400">No players assigned.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {squad.map((p: any) => (
              <div
                key={p.id}
                className="bg-white/10 p-5 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={p.photo || "/gnpl.jpg"}
                    alt={p.name}
                    width={70}
                    height={70}
                    className="rounded-full border border-white/20 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-xs text-gray-300">{p.role}</p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-300 space-y-1">
                  <p>Runs: {p.runs ?? 0}</p>
                  <p>Wickets: {p.wickets ?? 0}</p>
                  <p>Matches: {p.matches ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LAST 5 MATCHES */}
      <div className="max-w-6xl mx-auto mt-12 px-6 mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: theme }}>
          Last 5 Matches
        </h2>

        {!results?.length ? (
          <p className="text-gray-400">No matches played yet.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {results.map((r: any) => (
              <div
                key={r.id}
                className="min-w-[260px] bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md"
              >
                <p className="text-sm text-gray-300">
                  Match #{r.fixtures.match_no}
                </p>

                <p className="text-white font-semibold mt-1">
                  {r.score_summary}
                </p>

                <p className="text-xs mt-2" style={{ color: theme }}>
                  Winner: {r.winner}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
