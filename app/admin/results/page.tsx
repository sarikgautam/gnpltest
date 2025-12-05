"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ScorecardModal from "@/components/results/ScorecardModal";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const fetchAll = async () => {
    const { data: resultsData } = await supabase
      .from("results")
      .select("*")
      .order("id", { ascending: false });

    const { data: fixturesData } = await supabase
      .from("fixtures")
      .select("*")
      .order("match_no", { ascending: true });

    const { data: teamsData } = await supabase.from("teams").select("*");

    setResults(resultsData || []);
    setFixtures(fixturesData || []);
    setTeams(teamsData || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getFixture = (id: string) => fixtures.find((f) => f.id === id);
  const getTeam = (id: string | null) =>
    id ? teams.find((t) => t.id === id) : null;

  const ov = (o: any) => (o ? o : "");

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold text-green-400 text-center mb-8">
        Match Results
      </h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {results.map((r) => {
          const fixture = getFixture(r.match_id);
          if (!fixture) return null;

          const teamA = getTeam(fixture.team_a);
          const teamB = getTeam(fixture.team_b);
          const winner = getTeam(r.winner);

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
              className="bg-white/10 border border-white/20 rounded-xl p-5 backdrop-blur-lg shadow-md"
            ><a
  href={`/admin/results/${fixture.id}/scorecard`}
  className="px-3 py-1 text-xs bg-white/10 border border-white/25 rounded-lg hover:bg-white/20"
>
  Edit Scorecard
</a>

              {/* Header */}
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Match #{fixture.match_no} • {fixture.stage} •{" "}
                  {fixture.overs || 20} overs
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(fixture.date_time).toLocaleString("en-AU")}
                </p>
              </div>

              {/* Teams & score */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col items-center">
                  <img
                    src={teamA?.logo || "/no-logo.png"}
                    className="w-14 h-14 rounded-full border object-cover"
                  />
                  <p className="mt-1">{teamA?.name}</p>
                  <p className="text-xs text-gray-300">{scoreA}</p>
                </div>

                <span className="text-xl font-bold text-gray-300">VS</span>

                <div className="flex flex-col items-center">
                  <img
                    src={teamB?.logo || "/no-logo.png"}
                    className="w-14 h-14 rounded-full border object-cover"
                  />
                  <p className="mt-1">{teamB?.name}</p>
                  <p className="text-xs text-gray-300">{scoreB}</p>
                </div>
              </div>

              {/* Winner */}
              <p className="text-center mt-3 text-green-400 font-semibold">
                Winner: {winner?.name}
              </p>

              {/* Summary */}
              <p className="text-center text-xs text-gray-400 italic mt-2">
                {r.score_summary}
              </p>

              {/* Buttons */}
              <div className="mt-5 flex justify-center gap-3">
                {/* View Scorecard */}
                <Button
                  className="bg-green-500 text-black hover:bg-green-400"
                  onClick={() => {
                    setSelected({ result: r, fixture, teamA, teamB });
                    setOpenModal(true);
                  }}
                >
                  View Scorecard
                </Button>

                {/* Edit Player Stats */}
                <a
                  href={`/admin/results/${fixture.id}/players`}
                  className="px-4 py-2 text-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition"
                >
                  Edit Player Stats
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {openModal && selected && (
        <ScorecardModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          result={selected.result}
          fixture={selected.fixture}
          teamA={selected.teamA}
          teamB={selected.teamB}
        />
      )}
    </div>
  );
}
