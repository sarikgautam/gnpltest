"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
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
      .order("created_at", { ascending: false });

    setTeams(teamsData || []);
    setFixtures(fixtureData || []);
    setResults(resultData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getFixture = (id: string) => fixtures.find((f) => f.id === id);

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12 text-green-400">
        Results
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading results…</p>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        {results.map((res) => {
          const fixture = getFixture(res.match_id);
          const A = getTeam(fixture?.team_a);
          const B = getTeam(fixture?.team_b);
          const winner = getTeam(res.winner);

          return (
            <div
              key={res.id}
              className="
                backdrop-blur-xl bg-black/20 border border-white/30 
                rounded-2xl shadow-xl p-8 
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
              <div className="flex items-center justify-between px-6">
                <div className="flex flex-col items-center">
                  <img src={A?.logo} className="w-24 h-24 object-contain" />
                  <p className="text-white font-semibold mt-2">{A?.name}</p>
                </div>

                <p className="text-green-400 font-bold text-2xl">VS</p>

                <div className="flex flex-col items-center">
                  <img src={B?.logo} className="w-24 h-24 object-contain" />
                  <p className="text-white font-semibold mt-2">{B?.name}</p>
                </div>
              </div>

              {/* Score Summary */}
              <p className="text-center text-gray-300 italic mt-4">
                {res.score_summary}
              </p>

              {/* Winner Badge */}
              <p className="text-center mt-2 font-semibold text-green-300">
                Winner: {winner?.name}
              </p>

              {/* CTA */}
              <div className="text-center mt-6">
                <Link href={`/fixtures/${fixture.id}`}>
                  <Button className="bg-green-400 text-black hover:bg-green-300">
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
