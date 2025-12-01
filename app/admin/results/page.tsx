"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// ---------- TYPES ----------
interface Team {
  id: string;
  name: string;
}

interface Fixture {
  id: string;
  match_no: string;
  team_a: string;
  team_b: string;
  venue: string;
  date_time: string;
}

interface Result {
  id: string;
  match_id: string;
  winner: string;
  score_summary: string;
  created_at: string;
}

// ---------- PAGE ----------
export default function ResultsAdminPage() {
  // FIXED — explicit types
  const [completedMatches, setCompletedMatches] = useState<Result[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [matchId, setMatchId] = useState<string>("");
  const [winner, setWinner] = useState<string>("");
  const [scoreSummary, setScoreSummary] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  // ---------- FETCH FIXTURES ----------
  const fetchFixtures = async () => {
    const { data } = await supabase
      .from("fixtures")
      .select("*")
      .order("date_time", { ascending: false });

    setFixtures((data as Fixture[]) ?? []);
  };

  // ---------- FETCH TEAMS ----------
  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*");
    setTeams((data as Team[]) ?? []);
  };

  // ---------- FETCH RESULTS ----------
  const fetchResults = async () => {
    const { data } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });

    setCompletedMatches((data as Result[]) ?? []);
  };

  useEffect(() => {
    fetchFixtures();
    fetchTeams();
    fetchResults();
  }, []);

  // ---------- ADD RESULT ----------
  const addResult = async () => {
    if (!matchId || !winner || !scoreSummary) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    await supabase.from("results").insert([
      {
        match_id: matchId,
        winner,
        score_summary: scoreSummary,
      },
    ]);

    setLoading(false);

    setMatchId("");
    setWinner("");
    setScoreSummary("");

    fetchResults();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Manage Results</h1>

      {/* ADD RESULT FORM */}
      <div className="glass-card p-6 rounded-xl mb-12 border border-white/20 bg-black/30">
        <h2 className="text-xl font-semibold mb-4">Add Match Result</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="input"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
          >
            <option value="">Select Match</option>
            {fixtures.map((f) => (
              <option key={f.id} value={f.id}>
                Match #{f.match_no}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
          >
            <option value="">Winner Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            className="input col-span-2"
            placeholder="Score summary (e.g. HH 160/4 beat GSK 158/9)"
            value={scoreSummary}
            onChange={(e) => setScoreSummary(e.target.value)}
          />
        </div>

        <Button
          onClick={addResult}
          className="w-full mt-4 bg-green-400 text-black hover:bg-green-300"
        >
          {loading ? "Saving..." : "Add Result"}
        </Button>
      </div>

      {/* LIST RESULTS */}
      <h2 className="text-xl font-semibold mb-4 text-green-300">Completed Matches</h2>

      {completedMatches.length === 0 && (
        <p className="text-gray-400">No results added yet.</p>
      )}

      <div className="space-y-4">
        {completedMatches.map((r) => (
          <div
            key={r.id}
            className="backdrop-blur-xl bg-black/20 border border-white/20 p-4 rounded-xl shadow-xl"
          >
            <p className="font-semibold text-lg">
              {r.score_summary}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(r.created_at).toLocaleString("en-AU")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
