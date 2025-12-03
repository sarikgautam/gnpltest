"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

function EditResultInner() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data: resData } = await supabase
      .from("results")
      .select("*")
      .eq("id", resultId)
      .single();

    setResult(resData as Result);

    const { data: fixturesData } = await supabase
      .from("fixtures")
      .select("*")
      .order("match_no", { ascending: true });

    const { data: teamsData } = await supabase
      .from("teams")
      .select("id,name");

    setFixtures((fixturesData || []) as Fixture[]);
    setTeams((teamsData || []) as Team[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const inputClass =
    "w-full rounded-lg bg-white/10 border border-white/25 px-3 py-2 text-sm text-white";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!result) return;
    setResult({ ...result, [e.target.name]: e.target.value } as Result);
  };

  const getFixture = (id: string) =>
    fixtures.find((f) => f.id === id);

  const getTeamName = (id: string | null) =>
    id ? teams.find((t) => t.id === id)?.name ?? "" : "";

  const saveResult = async () => {
    if (!result) return;

    setSaving(true);

    const { error } = await supabase
      .from("results")
      .update({
        match_id: result.match_id,
        winner: result.winner || null,
        score_summary: result.score_summary || null,
        team_a_runs: result.team_a_runs,
        team_a_wickets: result.team_a_wickets,
        team_a_overs: result.team_a_overs,
        team_b_runs: result.team_b_runs,
        team_b_wickets: result.team_b_wickets,
        team_b_overs: result.team_b_overs,
        player_of_match: result.player_of_match || null,
      })
      .eq("id", resultId);

    setSaving(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Result updated!");
      router.push("/admin/results");
    }
  };

  if (!result) {
    return (
      <div className="text-center text-gray-300 mt-20">Loading…</div>
    );
  }

  const selectedFixture = getFixture(result.match_id);

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Edit Result
      </h1>

      <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg space-y-4">
        <div>
          <label className="text-sm text-gray-300">Match</label>
          <select
            name="match_id"
            value={result.match_id}
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
          <label className="text-sm text-gray-300">Winner</label>
          <select
            name="winner"
            value={result.winner ?? ""}
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
            value={result.score_summary ?? ""}
            onChange={handleChange}
            className={`${inputClass} h-20`}
          />
        </div>

        {/* Team A stats */}
        <div className="border border-white/15 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-2">Team A Score</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-300">Runs</label>
              <input
                name="team_a_runs"
                value={result.team_a_runs ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Wickets</label>
              <input
                name="team_a_wickets"
                value={result.team_a_wickets ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Overs</label>
              <input
                name="team_a_overs"
                value={result.team_a_overs ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Team B stats */}
        <div className="border border-white/15 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-2">Team B Score</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-300">Runs</label>
              <input
                name="team_b_runs"
                value={result.team_b_runs ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Wickets</label>
              <input
                name="team_b_wickets"
                value={result.team_b_wickets ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Overs</label>
              <input
                name="team_b_overs"
                value={result.team_b_overs ?? ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300">Player of the Match</label>
          <input
            name="player_of_match"
            value={result.player_of_match ?? ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <Button
          disabled={saving}
          onClick={saveResult}
          className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black"
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function EditResultPage() {
  return (
    <AdminGuard>
      <EditResultInner />
    </AdminGuard>
  );
}
