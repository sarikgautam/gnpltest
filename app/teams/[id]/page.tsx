import { supabase } from "@/lib/supabaseServer";
import Image from "next/image";

export default async function TeamPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id: teamId } = await props.params;

  // -------------------------------
  // FETCH TEAM
  // -------------------------------
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

  const theme = team.theme_color || "#16a34a"; // fallback GNPL green

  // -------------------------------
  // FETCH SQUAD
  // -------------------------------
  const { data: squad } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId);

  // -------------------------------
  // FETCH ALL TEAMS (needed for naming)
  // -------------------------------
  const { data: allTeams } = await supabase
    .from("teams")
    .select("id, name");

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return "";
    return allTeams?.find((t) => t.id === teamId)?.name || "Unknown Team";
  };

  // -------------------------------
  // FETCH FIXTURES FOR MATCH LOOKUP
  // -------------------------------
  const { data: fixtures } = await supabase
    .from("fixtures")
    .select("*");

  // -------------------------------
  // LAST 5 MATCH RESULTS
  // -------------------------------
    const { data: lastFive } = await supabase
    .from("results")
    .select("*, fixtures(*)")
    .order("created_at", { ascending: false });

  // Filter only matches where this team played
  const filteredMatches = lastFive?.filter((m) => {
    const f = m.fixtures;
    return f?.team_a === teamId || f?.team_b === teamId;
  }).slice(0, 5);


  // -------------------------------
  // TOP RUNS / WICKETS
  // -------------------------------
  const topRuns = squad
    ?.sort((a, b) => (b.runs || 0) - (a.runs || 0))
    .slice(0, 3);

  const topWickets = squad
    ?.sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
    .slice(0, 3);
    // Fetch all results
const { data: allResults } = await supabase.from("results").select("*");

// Compute Points per team
const standings: Record<string, number> = {};

allResults?.forEach((r) => {
  if (!r.winner) return;
  standings[r.winner] = (standings[r.winner] || 0) + 2; // 2 points per win
});

// Rank teams
const sortedTeams = Object.entries(standings).sort((a, b) => b[1] - a[1]);

// Find this team's ladder position
const ladderPosition =
  sortedTeams.findIndex(([tid]) => tid === teamId) + 1 || null;


  return (
    <div className="min-h-screen text-white">

      {/* HERO SECTION */}
{/* TEAM HEADER – PREMIUM LEAGUE UI */}
<div
  className="relative w-full py-14 px-6 overflow-hidden"
  style={{
    background: `linear-gradient(125deg, #000, ${theme}88 40%, #000 90%)`,
  }}
>
  {/* BACKGROUND LIGHTS */}
  <div className="absolute inset-0 opacity-30">
    <div
      className="absolute w-80 h-80 rounded-full blur-[140px]"
      style={{ top: "-80px", left: "-50px", background: theme }}
    />
    <div
      className="absolute w-96 h-96 rounded-full blur-[160px]"
      style={{ bottom: "-120px", right: "-90px", background: theme }}
    />
  </div>

  {/* FLOATING PARTICLES */}
  {[...Array(14)].map((_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        animationDelay: `${Math.random() * 5}s`,
        background: theme,
        opacity: 0.4,
      }}
    />
  ))}

  {/* MAIN CONTENT */}
  <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

    {/* TEAM LOGO FRAME */}
    <div
      className="relative w-48 h-48 rounded-2xl bg-black/30 backdrop-blur-xl flex items-center justify-center border shadow-2xl"
      style={{
        borderColor: `${theme}aa`,
        boxShadow: `0 0 30px ${theme}70`,
      }}
    >
      <Image
        src={team.logo || "/gnpl.jpg"}
        alt={team.name}
        fill
        className="object-contain p-5 drop-shadow-2xl"
      />
    </div>

    {/* TEAM INFO */}
    <div className="text-white w-full">
      
      {/* NAME + LADDER */}
      <div className="flex items-center gap-4 flex-wrap">
        <h1
          className="text-5xl font-extrabold tracking-tight drop-shadow-2xl"
          style={{ color: theme }}
        >
          {team.name}
        </h1>

        {/* LADDER POSITION */}
        {ladderPosition && (
          <div
            className="px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
            style={{
              background: `${theme}22`,
              border: `1px solid ${theme}`,
              color: theme,
            }}
          >
            #{ladderPosition} in Ladder
          </div>
        )}
      </div>

      {/* SLOGAN */}
      <p
        className="text-lg italic mt-1 drop-shadow-lg"
        style={{ color: `${theme}cc` }}
      >
        {team.slogan || ""}
      </p>

      {/* DESCRIPTION */}
      <p className="text-gray-200 mt-4 text-sm max-w-xl leading-relaxed">
        {team.description}
      </p>

      {/* TEAM DETAILS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">

        {[
          ["Captain", team.captain],
          ["Owner", team.owner],
          ["Manager", team.manager],
          ["Last Season Rank", team.last_season_rank],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white/10 backdrop-blur-lg p-3 rounded-lg border border-white/20"
          >
            <p className="text-gray-300 text-xs">{label}</p>
            <p className="font-semibold" style={{ color: theme }}>
              {value || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* BOTTOM EDGE GLOW */}
  <div
    className="absolute bottom-0 left-0 w-full h-[6px]"
    style={{
      background: `linear-gradient(90deg, ${theme}, transparent)`,
      boxShadow: `0 0 25px ${theme}`,
    }}
  />
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
                  <div key={p.id} className="flex justify-between bg-black/20 px-3 py-2 rounded-lg">
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
                  <div key={p.id} className="flex justify-between bg-black/20 px-3 py-2 rounded-lg">
                    <span>{i + 1}. {p.name}</span>
                    <span style={{ color: theme }}>{p.wickets} Wkts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SQUAD */}
{/* FULL SQUAD — PREMIUM LEAGUE UI */}
<div className="max-w-6xl mx-auto mt-16 px-6">
  <h2
    className="text-4xl font-extrabold mb-8 drop-shadow-lg"
    style={{ color: theme }}
  >
    Full Squad
  </h2>

  {!squad?.length ? (
    <p className="text-gray-400">No players assigned.</p>
  ) : (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {squad.map((p: any) => {
        const roleColor =
          p.role === "batsman"
            ? "#facc15" // yellow
            : p.role === "bowler"
            ? "#38bdf8" // sky blue
            : p.role === "all-rounder"
            ? "#34d399" // green
            : "#e5e7eb"; // fallback

        return (
          <div
            key={p.id}
            className="relative group bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]"
          >
            {/* Glow Behind Card */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-25 transition duration-300"
              style={{
                background: theme,
                filter: "blur(40px)",
              }}
            />

            {/* Player Row */}
            <div className="relative flex items-center gap-4">
              <Image
                src={p.photo || "/player.png"}
                alt={p.name}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-white/30 shadow-lg"
              />

              <div>
                <p className="text-lg font-semibold">{p.name}</p>
                <span
                  className="text-xs px-2 py-[2px] rounded-full font-medium"
                  style={{
                    background: `${roleColor}22`,
                    color: roleColor,
                    border: `1px solid ${roleColor}55`,
                  }}
                >
                  {p.role?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 flex items-center justify-between text-xs text-gray-300">
              <div className="flex flex-col items-center">
                <span className="text-gray-400">Runs</span>
                <span className="font-bold" style={{ color: theme }}>
                  {p.runs ?? 0}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-gray-400">Wickets</span>
                <span className="font-bold" style={{ color: theme }}>
                  {p.wickets ?? 0}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-gray-400">Matches</span>
                <span className="font-bold" style={{ color: theme }}>
                  {p.matches ?? 0}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>


    {/* LAST 5 MATCHES */}
<div className="max-w-6xl mx-auto mt-16 px-6">
{/* LAST 5 MATCHES HEADER */}
<div className="flex items-center gap-4 mb-8 select-none">

  {/* Team Logo Box */}
  <div
    className="w-16 h-16 rounded-xl shadow-2xl p-2 flex items-center justify-center border backdrop-blur-xl"
    style={{
      background: `${theme}22`,
      borderColor: theme,
      boxShadow: `0 0 25px ${theme}55`,
    }}
  >
    <Image
      src={team.logo || "/gnpl.jpg"}
      alt={team.name}
      width={55}
      height={55}
      className="object-contain drop-shadow-xl"
    />
  </div>

  {/* Title Text */}
  <div>
    <h3
      className="text-3xl font-extrabold tracking-wide drop-shadow-lg"
      style={{ color: theme }}
    >
      Last 5 Matches
    </h3>
    <p className="text-xs text-gray-300 -mt-1">
      Recent performance of {team.name}
    </p>
  </div>

  {/* Accent Glow Bar */}
  <div
    className="flex-1 h-1 ml-4 rounded-full"
    style={{
      background: `linear-gradient(90deg, ${theme}aa, transparent)`,
      boxShadow: `0 0 15px ${theme}55`,
    }}
  />
</div>

  {!filteredMatches?.length ? (
    <p className="text-gray-400">No recent matches.</p>
  ) : (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 snap-x snap-mandatory">

        {filteredMatches.map((m: any) => {
          const fixture = m.fixtures;

          const opponent =
            fixture.team_a === teamId
              ? getTeamName(fixture.team_b)
              : getTeamName(fixture.team_a);

          // This team’s result
          const teamWon = m.winner === teamId;

          return (
            <div
              key={m.id}
              className="min-w-[280px] snap-start bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-lg shadow-xl"
              style={{ borderColor: theme }}
            >

              {/* W / L Badge */}
              <div className="flex justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    teamWon
                      ? "bg-green-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                  style={{
                    boxShadow: teamWon
                      ? "0 0 10px #22c55e88"
                      : "0 0 10px #ef444488",
                  }}
                >
                  {teamWon ? "W" : "L"}
                </span>
              </div>

              {/* Match Title */}
              <p className="text-sm font-semibold">
                Match #{fixture.match_no}
              </p>

              {/* Opponent */}
              <p className="text-gray-300 text-xs mt-1">
                vs {opponent}
              </p>

              {/* Winner */}
              <p
                className="text-sm font-bold mt-2"
                style={{ color: teamWon ? "#22c55e" : "#ef4444" }}
              >
                {teamWon ? "You Won" : "You Lost"}
              </p>

              {/* Summary */}
              <p className="text-gray-300 text-xs mt-1">
                {m.score_summary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>


    </div>
  );
}
