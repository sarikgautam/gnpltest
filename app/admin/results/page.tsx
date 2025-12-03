"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Fixture = {
  id: string;
  match_no: number;
  team_a: string | null;
  team_b: string | null;
  stage: string;
  overs: number | null;
};

type Team = {
  id: string;
  name: string;
  logo?: string | null;
};

type Result = {
  id: string;
  match_id: string;
  winner: string | null;
  score_summary: string | null;
  team_a_runs: number | null;
  team_a_wickets: number | null;
  team_a_overs: string | number | null;
  team_b_runs: number | null;
  team_b_wickets: number | null;
  team_b_overs: string | number | null;
  player_of_match: string | null;
};

function ResultsInner() {
  const [results, setResults] = useState<Result[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: resData } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: fixData } = await supabase
      .from("fixtures")
      .select("id,match_no,team_a,team_b,stage,overs");

    const { data: teamData } = await supabase
      .from("teams")
      .select("id,name,logo");

    setResults((resData || []) as Result[]);
    setFixtures((fixData || []) as Fixture[]);
    setTeams((teamData || []) as Team[]);
    setLoading(false);
  };

  const deleteResult = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    const { error } = await supabase.from("results").delete().eq("id", id);
    if (error) alert(error.message);
    else {
      alert("Result deleted");
      fetchData();
    }
  };

  const getFixture = (id: string) => fixtures.find((f) => f.id === id);
  const getTeam = (id: string | null) =>
    id ? teams.find((t) => t.id === id) : undefined;

  const ov = (value: string | number | null) => {
    if (value === null || value === undefined || value === "") return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(num)) return "";
    return num.toFixed(1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 text-white px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          Manage Results
        </h1>
        <Button
          asChild
          className="bg-green-500 text-black hover:bg-green-400 px-5"
        >
          <a href="/admin/results/add">+ Add Result</a>
        </Button>
      </div>

      {loading && (
        <p className="text-center text-gray-300 mt-10">Loading results…</p>
      )}

      {!loading && results.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No results added yet.
        </p>
      )}

      <div className="space-y-4">
        {results.map((r) => {
          const fixture = getFixture(r.match_id);
          const teamA = getTeam(fixture?.team_a ?? null);
          const teamB = getTeam(fixture?.team_b ?? null);
          const winnerTeam = getTeam(r.winner);

          const scoreA =
            r.team_a_runs !== null && r.team_a_wickets !== null
              ? `${r.team_a_runs}/${r.team_a_wickets} ${
                  ov(r.team_a_overs) ? `(${ov(r.team_a_overs)})` : ""
                }`
              : "";

          const scoreB =
            r.team_b_runs !== null && r.team_b_wickets !== null
              ? `${r.team_b_runs}/${r.team_b_wickets} ${
                  ov(r.team_b_overs) ? `(${ov(r.team_b_overs)})` : ""
                }`
              : "";

          return (
            <div
              key={r.id}
              className="p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg flex flex-col gap-4"
            >
              {/* Top Row: Match meta */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">
                    Match #{fixture?.match_no}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-cyan-200">
                    {fixture?.stage} • {fixture?.overs || 20} overs
                  </span>
                </div>

                {r.score_summary && (
                  <p className="text-sm italic text-gray-200">
                    {r.score_summary}
                  </p>
                )}
              </div>

              {/* Middle Row: Teams & Scores */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Team A */}
                <div className="flex items-center gap-3">
                  {teamA?.logo && (
                    <img
                      src={teamA.logo}
                      alt={teamA.name}
                      className="h-10 w-10 object-contain"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{teamA?.name}</p>
                    {scoreA && (
                      <p className="text-sm text-gray-200">{scoreA}</p>
                    )}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-400">vs</div>

                {/* Team B */}
                <div className="flex items-center gap-3">
                  {teamB?.logo && (
                    <img
                      src={teamB.logo}
                      alt={teamB.name}
                      className="h-10 w-10 object-contain"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{teamB?.name}</p>
                    {scoreB && (
                      <p className="text-sm text-gray-200">{scoreB}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Winner + Player of Match + Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  {winnerTeam && (
                    <p className="text-sm">
                      <span className="font-semibold text-green-300">
                        Winner:
                      </span>{" "}
                      {winnerTeam.name}
                    </p>
                  )}
                  {r.player_of_match && (
                    <p className="text-sm text-gray-200">
                      <span className="font-semibold">Player of the match:</span>{" "}
                      {r.player_of_match}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 self-end md:self-auto">
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-400"
                  >
                    <a href={`/admin/results/edit/${r.id}`}>Edit</a>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-400"
                    onClick={() => deleteResult(r.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <AdminGuard>
      <ResultsInner />
    </AdminGuard>
  );
}
