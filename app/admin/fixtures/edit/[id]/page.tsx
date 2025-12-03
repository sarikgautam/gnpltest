"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Team = {
  id: string;
  name: string;
};

type Fixture = {
  id: string;
  match_no: number;
  team_a: string | null;
  team_b: string | null;
  date_time: string;
  venue: string;
  stage: string;
  overs: number | null;
  status: string;
};

function EditFixtureInner() {
  const params = useParams();
  const router = useRouter();
  const fixtureId = params.id as string;

  const [teams, setTeams] = useState<Team[]>([]);
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data: teamsData } = await supabase
      .from("teams")
      .select("id,name")
      .order("name", { ascending: true });

    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .eq("id", fixtureId)
      .single();

    setTeams((teamsData || []) as Team[]);
    setFixture(fixtureData as Fixture);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const inputClass =
    "w-full rounded-lg bg-white/10 border border-white/25 px-3 py-2 text-sm text-white";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!fixture) return;
    setFixture({
      ...fixture,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    } as Fixture);
  };

  const saveFixture = async () => {
    if (!fixture) return;
    setSaving(true);

    const { error } = await supabase
      .from("fixtures")
      .update({
        match_no: fixture.match_no,
        team_a: fixture.team_a,
        team_b: fixture.team_b,
        date_time: fixture.date_time,
        venue: fixture.venue,
        stage: fixture.stage,
        overs: fixture.overs || 20,
        status: fixture.status,
      })
      .eq("id", fixtureId);

    setSaving(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Fixture updated");
      router.push("/admin/fixtures");
    }
  };

  if (!fixture) {
    return (
      <div className="text-center text-gray-300 mt-20">Loading…</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Edit Fixture #{fixture.match_no}
      </h1>

      <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg space-y-4">
        <div>
          <label className="text-sm text-gray-300">Match No</label>
          <input
            name="match_no"
            type="number"
            value={fixture.match_no}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Team A</label>
            <select
              name="team_a"
              value={fixture.team_a ?? ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Team A</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Team B</label>
            <select
              name="team_b"
              value={fixture.team_b ?? ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Team B</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300">Date & Time</label>
          <input
            name="date_time"
            type="datetime-local"
            value={fixture.date_time}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Venue</label>
          <input
            name="venue"
            value={fixture.venue}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-300">Stage</label>
            <select
              name="stage"
              value={fixture.stage}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Group">Group</option>
              <option value="Eliminator">Eliminator</option>
              <option value="Qualifier">Qualifier</option>
              <option value="Final">Final</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Overs</label>
            <select
              name="overs"
              value={fixture.overs ?? 20}
              onChange={handleChange}
              className={inputClass}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Status</label>
            <select
              name="status"
              value={fixture.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <Button
          disabled={saving}
          onClick={saveFixture}
          className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black"
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function EditFixturePage() {
  return (
    <AdminGuard>
      <EditFixtureInner />
    </AdminGuard>
  );
}
