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
  status: string;
}

// ---------- PAGE ----------
export default function FixturesAdminPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [matchNo, setMatchNo] = useState<string>("");
  const [teamA, setTeamA] = useState<string>("");
  const [teamB, setTeamB] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const fetchFixtures = async (): Promise<void> => {
    const { data } = await supabase.from("fixtures").select("*").order("date_time");
    setFixtures((data as Fixture[]) ?? []);
  };

  const fetchTeams = async (): Promise<void> => {
    const { data } = await supabase.from("teams").select("*");
    setTeams((data as Team[]) ?? []);
  };

  useEffect(() => {
    fetchFixtures();
    fetchTeams();
  }, []);

  const addFixture = async (): Promise<void> => {
    if (!matchNo || !teamA || !teamB || !venue || !dateTime) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    await supabase.from("fixtures").insert([
      {
        match_no: matchNo,
        team_a: teamA,
        team_b: teamB,
        venue,
        date_time: dateTime,
        status: "upcoming",
      },
    ]);

    setLoading(false);

    setMatchNo("");
    setTeamA("");
    setTeamB("");
    setVenue("");
    setDateTime("");

    fetchFixtures();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Manage Fixtures</h1>

      <div className="glass-card p-6 rounded-xl mb-12 border border-white/20 bg-black/30">
        <h2 className="text-xl font-semibold mb-4">Add Fixture</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Match No"
            value={matchNo}
            onChange={(e) => setMatchNo(e.target.value)}
          />

          <select className="input" value={teamA} onChange={(e) => setTeamA(e.target.value)}>
            <option value="">Team A</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select className="input" value={teamB} onChange={(e) => setTeamB(e.target.value)}>
            <option value="">Team B</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <input
            className="input"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        <Button
          onClick={addFixture}
          className="w-full mt-4 bg-green-400 text-black hover:bg-green-300"
        >
          {loading ? "Saving..." : "Add Fixture"}
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-green-300">Existing Fixtures</h2>

      {fixtures.length === 0 && <p className="text-gray-400">No fixtures added yet.</p>}

      <div className="space-y-4">
        {fixtures.map((f) => (
          <div
            key={f.id}
            className="backdrop-blur-xl bg-black/20 border border-white/20 p-4 rounded-xl shadow-xl"
          >
            <p className="font-semibold text-lg">Match #{f.match_no}</p>
            <p className="text-sm">{f.venue}</p>
            <p className="text-sm text-gray-400">
              {new Date(f.date_time).toLocaleString("en-AU")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
