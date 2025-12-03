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
  const [saving, setSaving] = useState(false);

  const [scorecardFile, setScorecardFile] = useState<File | null>(null);
  const [scorecardFile2, setScorecardFile2] = useState<File | null>(null);
  const [scorecardFile3, setScorecardFile3] = useState<File | null>(null);
  const [scorecardFile4, setScorecardFile4] = useState<File | null>(null);

  const [form, setForm] = useState({
    match_id: "",
    winner: "",
    summary: "",
  });

  const fetchData = async () => {
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

  const uploadImage = async (file: File | null) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("gnpl")
      .upload(`scorecards/${fileName}`, file);

    if (error) return null;

    const { data: url } = supabase.storage
      .from("gnpl")
      .getPublicUrl(`scorecards/${fileName}`);

    return url.publicUrl;
  };

  const saveResult = async () => {
    if (!form.match_id) return alert("Select a match first.");

    setSaving(true);

    const scorecardUrl = await uploadImage(scorecardFile);
    const scorecardUrl2 = await uploadImage(scorecardFile2);

    const { error } = await supabase.from("results").insert({
      match_id: form.match_id,
      winner: form.winner || null,
      score_summary: form.summary || null,
      scorecard_img: scorecardUrl,
      scorecard_img2: scorecardUrl2,
    });

    setSaving(false);

    if (error) alert(error.message);
    else {
      alert("Result added!");
      window.location.href = "/admin/results";
    }
  };

  const getTeamName = (id: string | null) =>
    id ? teams.find((t) => t.id === id)?.name ?? "" : "";

  const selectedFixture = fixtures.find((f) => f.id === form.match_id);

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Add Result</h1>

      <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg space-y-4">

        {/* MATCH SELECTION */}
        <div>
          <label className="text-sm text-gray-300">Match</label>
          <select
            name="match_id"
            value={form.match_id}
            onChange={(e) => setForm({ ...form, match_id: e.target.value })}
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

        {/* WINNER */}
        <div>
          <label className="text-sm text-gray-300">Winner</label>
          <select
            name="winner"
            value={form.winner}
            onChange={(e) => setForm({ ...form, winner: e.target.value })}
            className={inputClass}
          >
            <option value="">Select winner</option>
            {selectedFixture?.team_a && (
              <option value={selectedFixture.team_a}>
                {getTeamName(selectedFixture.team_a)}
              </option>
            )}
            {selectedFixture?.team_b && (
              <option value={selectedFixture.team_b}>
                {getTeamName(selectedFixture.team_b)}
              </option>
            )}
          </select>
        </div>

        {/* SUMMARY */}
        <div>
          <label className="text-sm text-gray-300">Short Summary</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className={`${inputClass} h-24`}
            placeholder="Example: Himalayan Heat won by 22 runs."
          />
        </div>

        {/* SCORECARD IMAGE 1 */}
        <div>
          <label className="text-sm text-gray-300">Scorecard Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScorecardFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-300"
          />
        </div>

        {/* SCORECARD IMAGE 2 (optional) */}
        <div>
          <label className="text-sm text-gray-300">Additional Screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScorecardFile2(e.target.files?.[0] || null)}
            className="text-sm text-gray-300"
          />
        </div>
        {/* SCORECARD IMAGE 2 (optional) */}
        <div>
          <label className="text-sm text-gray-300">Additional Screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScorecardFile3(e.target.files?.[0] || null)}
            className="text-sm text-gray-300"
          />
        </div>

{/* SCORECARD IMAGE 2 (optional) */}
        <div>
          <label className="text-sm text-gray-300">Additional Screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScorecardFile4(e.target.files?.[0] || null)}
            className="text-sm text-gray-300"
          />
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
