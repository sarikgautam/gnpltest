"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: teamData } = await supabase.from("teams").select("*");

    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .order("match_no", { ascending: true });

    const { data: resultData } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });

    setTeams(teamData || []);
    setFixtures(fixtureData || []);
    setResults(resultData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getFixture = (id: string) => fixtures.find((f) => f.id === id);

  if (loading) {
    return (
      <div className="text-center text-white mt-20">Loading results…</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-20">
      <h1 className="text-4xl font-bold text-green-400 text-center mb-10">
        Match Results
      </h1>

      {results.length === 0 ? (
        <p className="text-center text-gray-300">No results added yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {results.map((res) => {
            const fixture = getFixture(res.match_id);
            if (!fixture) return null;

            const teamA = getTeam(fixture.team_a);
            const teamB = getTeam(fixture.team_b);
            const winner = getTeam(res.winner);

            return (
              <Card
                key={res.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl"
              >
                {/* Header */}
                <p className="text-gray-300 text-sm mb-1">
                  Match #{fixture.match_no} • {fixture.stage} •{" "}
                  {fixture.overs || 20} overs
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  {new Date(fixture.date_time).toLocaleString("en-AU")}
                  <br />
                  {fixture.venue}
                </p>

                {/* Teams Row */}
                <div className="flex items-center justify-between mb-6">
                  {/* Team A */}
                  <div className="flex flex-col items-center">
                    <img
                      src={teamA?.logo}
                      className="w-16 h-16 object-contain"
                      alt={teamA?.name}
                    />
                    <p className="text-white mt-2">{teamA?.name}</p>
                  </div>

                  <span className="text-white font-semibold text-xl">VS</span>

                  {/* Team B */}
                  <div className="flex flex-col items-center">
                    <img
                      src={teamB?.logo}
                      className="w-16 h-16 object-contain"
                      alt={teamB?.name}
                    />
                    <p className="text-white mt-2">{teamB?.name}</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-center text-white">
                  <div className="bg-white/5 border border-white/15 rounded-lg p-3">
                    <p className="text-green-300 text-sm mb-1">
                      {teamA?.name}
                    </p>
                    <p className="text-lg font-bold">
                      {res.team_a_runs}/{res.team_a_wickets}
                    </p>
                    <p className="text-gray-300 text-xs">
                      Overs: {res.team_a_overs}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/15 rounded-lg p-3">
                    <p className="text-green-300 text-sm mb-1">
                      {teamB?.name}
                    </p>
                    <p className="text-lg font-bold">
                      {res.team_b_runs}/{res.team_b_wickets}
                    </p>
                    <p className="text-gray-300 text-xs">
                      Overs: {res.team_b_overs}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <p className="mt-4 text-center text-green-400 font-semibold">
                  Winner: {winner?.name}
                </p>

                {res.score_summary && (
                  <p className="text-center text-gray-300 text-sm mt-2 italic">
                    {res.score_summary}
                  </p>
                )}

                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full bg-green-500 hover:bg-green-400 text-black"
                  >
                    <a href={`/fixtures/${fixture.id}`}>View Scorecard</a>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
