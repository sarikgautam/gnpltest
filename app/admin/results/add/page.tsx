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
};

function AddResultInner() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    match_id: "",
    winner: "",
    score_summary: "",
    team_a_runs: "",
    team_a_wickets: "",
    team_a_overs: "",
    team_b_runs: "",
    team_b_wickets: "",
    team_b_overs: "",
    player_of_match: "",
  });

  const fetchData = async () => {
  const { data: fixturesData } = await supabase
    .from("fixtures")
    .select("*")
    .order("match_no", { ascending: true });

  const { data: teamsData } = await supabase
    .from("teams")
    .select("id,name");

  const { data: playersData } = await supabase
    .from("players")
    .select("id, name, team_id");

  setFixtures((fixturesData || []) as Fixture[]);
  setTeams((teamsData || []) as Team[]);
  setPlayers(playersData || []);
};


  useEffect(() => {
    fetchData();
  }, []);

  const inputClass =
    "w-full rounded-lg bg-white/10 border border-white/25 px-3 py-2 text-sm text-white";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getFixture = (id: string) =>
    fixtures.find((f) => f.id === id);

  const getTeamName = (id: string | null) =>
    id ? teams.find((t) => t.id === id)?.name ?? "" : "";

  const saveResult = async () => {
    if (!form.match_id) {
      alert("Please select a match.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("results").insert({
      match_id: form.match_id,
      winner: form.winner || null,
      score_summary: form.score_summary || null,
      team_a_runs: form.team_a_runs ? Number(form.team_a_runs) : null,
      team_a_wickets: form.team_a_wickets ? Number(form.team_a_wickets) : null,
      team_a_overs: form.team_a_overs || null,
      team_b_runs: form.team_b_runs ? Number(form.team_b_runs) : null,
      team_b_wickets: form.team_b_wickets ? Number(form.team_b_wickets) : null,
      team_b_overs: form.team_b_overs || null,
      player_of_match: form.player_of_match || null,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Result added!");
      window.location.href = "/admin/results";
    }
  };

  const selectedFixture = form.match_id
    ? getFixture(form.match_id)
    : undefined;

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Add Result
      </h1>

      <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg space-y-4">
        <div>
          <label className="text-sm text-gray-300">Match</label>
          <select
            name="match_id"
            value={form.match_id}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select match</option>
            {fixtures.map((f) => (
              <option key={f.id} value={f.id}>
                Match #{f.match_no} – {getTeamName(f.team_a)} vs{" "}
                {getTeamName(f.team_b)} ({f.stage}, {f.overs || 20} overs)
              </option>
            ))}
          </select>
        </div>

        {selectedFixture && (
          <div className="text-xs text-gray-300">
            Stage: {selectedFixture.stage} • Overs: {selectedFixture.overs || 20}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-300">Winner (Team ID)</label>
          <select
            name="winner"
            value={form.winner}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select winner</option>
            {selectedFixture && (
              <>
                {selectedFixture.team_a && (
                  <option value={selectedFixture.team_a}>
                    {getTeamName(selectedFixture.team_a)}
                  </option>
                )}
                {selectedFixture.team_b && (
                  <option value={selectedFixture.team_b}>
                    {getTeamName(selectedFixture.team_b)}
                  </option>
                )}
              </>
            )}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Score Summary</label>
          <textarea
            name="score_summary"
            value={form.score_summary}
            onChange={handleChange}
            className={`${inputClass} h-20`}
            placeholder="Example: GNPL Warriors won by 15 runs"
          />
        </div>

        {/* Team A stats */}
        <div className="border border-white/15 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-2">
            Team A Score (first innings)
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-300">Runs</label>
              <input
                name="team_a_runs"
                value={form.team_a_runs}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Wickets</label>
              <input
                name="team_a_wickets"
                value={form.team_a_wickets}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Overs</label>
              <input
                name="team_a_overs"
                value={form.team_a_overs}
                onChange={handleChange}
                className={inputClass}
                placeholder="20.0"
              />
            </div>
          </div>
        </div>

        {/* Team B stats */}
        <div className="border border-white/15 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-2">
            Team B Score (second innings)
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-300">Runs</label>
              <input
                name="team_b_runs"
                value={form.team_b_runs}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Wickets</label>
              <input
                name="team_b_wickets"
                value={form.team_b_wickets}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Overs</label>
              <input
                name="team_b_overs"
                value={form.team_b_overs}
                onChange={handleChange}
                className={inputClass}
                placeholder="19.4"
              />
            </div>
          </div>
        </div>
        {/* Player of the Match */}
<div className="border border-white/15 rounded-lg p-3">
  <p className="text-sm text-green-300 mb-2">Player of the Match</p>

  <select
  name="player_of_match"
  value={form.player_of_match}
  onChange={handleChange}
  className={inputClass}
>
  <option value="">Select player</option>
  {players.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>

</div>

        <Button
          disabled={saving}
          onClick={saveResult}
          className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black"
        >
          {saving ? "Saving…" : "Save Result"}
        </Button>
      </div>
    </div>
  );
}

export default function AddResultPage() {
  return (
    <AdminGuard>
      <AddResultInner />
    </AdminGuard>
  );
}
