"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ScorecardModal from "@/components/results/ScorecardModal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const fetchEverything = async () => {
    const { data: teamsData } = await supabase.from("teams").select("*");
    const { data: fixturesData } = await supabase.from("fixtures").select("*");
    const { data: resultsData } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });

    setResults(resultsData || []);
    setFixtures(fixturesData || []);
    setTeams(teamsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEverything();
  }, []);

  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getFixture = (id: string) => fixtures.find((f) => f.id === id);

  if (loading) {
    return (
      <div className="text-center text-gray-300 py-20">
        Loading results…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-10 text-center drop-shadow-lg">
        Match Results
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {results.map((res) => {
          const fixture = getFixture(res.match_id);
          if (!fixture) return null;

          const teamA = getTeam(fixture.team_a);
          const teamB = getTeam(fixture.team_b);
          const winner = getTeam(res.winner);

          return (
            <div
              key={res.id}
              className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-xl shadow-lg hover:shadow-green-500/30 transition"
            >
              {/* HEADER */}
              <div className="text-center">
                <p className="text-xs text-gray-400">Match #{fixture.match_no}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {new Date(fixture.date_time).toLocaleString("en-AU")}
                </p>
                <p className="text-xs text-gray-400">{fixture.stage} • {fixture.overs || 20} overs</p>
              </div>

              {/* TEAMS */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col items-center">
                  <Image
                    src={teamA?.logo || "/no-logo.png"}
                    alt={teamA?.name}
                    width={60}
                    height={60}
                    className="rounded-full border object-cover"
                  />
                  <p className="text-sm mt-1">{teamA?.name}</p>
                </div>

                <p className="text-xl font-bold text-gray-300">VS</p>

                <div className="flex flex-col items-center">
                  <Image
                    src={teamB?.logo || "/no-logo.png"}
                    alt={teamB?.name}
                    width={60}
                    height={60}
                    className="rounded-full border object-cover"
                  />
                  <p className="text-sm mt-1">{teamB?.name}</p>
                </div>
              </div>

              {/* SUMMARY */}
              <p className="text-center text-sm text-gray-300 italic mt-4">
                {res.score_summary}
              </p>

              {/* WINNER */}
              <p className="text-center mt-3 font-semibold text-green-400">
                Winner: {winner?.name}
              </p>

              {/* Scorecard Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  className="bg-green-500 hover:bg-green-400 text-black"
                  onClick={() =>
                    setSelected({ fixture, result: res, teamA, teamB }) ||
                    setOpenModal(true)
                  }
                >
                  View Scorecard
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCORECARD MODAL */}
      {selected && (
        <ScorecardModal
          open={openModal}
          onClose={setOpenModal}
          result={selected.result}
          fixture={selected.fixture}
          teamA={selected.teamA}
          teamB={selected.teamB}
        />
      )}
    </div>
  );
}
