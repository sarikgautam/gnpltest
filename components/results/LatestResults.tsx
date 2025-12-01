"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function LatestResults() {
  const [results, setResults] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: teamsData } = await supabase.from("teams").select("*");
    const { data: fixtureData } = await supabase.from("fixtures").select("*");
    const { data: resultData } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    setTeams(teamsData || []);
    setFixtures(fixtureData || []);
    setResults(resultData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getFixture = (id: string) => fixtures.find((f) => f.id === id);
  const getTeam = (id: string) => teams.find((t) => t.id === id);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-24">
      <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
        Latest Results
      </h2>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading results…</p>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && (
        <p className="text-center text-gray-400">No completed matches yet.</p>
      )}

      {/* Results Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {results.map((res) => {
          const fixture = getFixture(res.match_id);
          const teamA = getTeam(fixture?.team_a);
          const teamB = getTeam(fixture?.team_b);
          const winner = getTeam(res.winner);

          return (
            <div
              key={res.id}
              className="
                backdrop-blur-xl bg-black/20 border border-white/30 
                rounded-2xl shadow-xl p-6 
                transition-all hover:-translate-y-2 hover:shadow-2xl
              "
            >
              {/* Header */}
              <div className="text-center mb-6">
                <p className="text-green-300 font-bold">
                  Match #{fixture.match_no}
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  {new Date(fixture.date_time).toLocaleString("en-AU")}
                </p>
                <p className="text-sm text-gray-400">{fixture.venue}</p>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col items-center">
                  <img
                    src={teamA?.logo}
                    className="w-20 h-20 object-contain drop-shadow-lg"
                  />
                  <p className="text-sm text-white mt-2">{teamA?.name}</p>
                </div>

                <p className="text-green-400 font-bold text-xl">VS</p>

                <div className="flex flex-col items-center">
                  <img
                    src={teamB?.logo}
                    className="w-20 h-20 object-contain drop-shadow-lg"
                  />
                  <p className="text-sm text-white mt-2">{teamB?.name}</p>
                </div>
              </div>

              {/* Result Summary */}
              <p className="text-center text-gray-300 italic mt-4">
                {res.score_summary}
              </p>

              {/* Winner */}
              <p className="text-center mt-2 font-semibold text-green-300">
                Winner: {winner?.name}
              </p>

              {/* CTA */}
              <div className="text-center mt-6">
                <Link href={`/fixtures/${fixture.id}`}>
                  <Button size="sm" className="bg-green-400 text-black hover:bg-green-300">
                    View Scorecard
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
