"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddFixture() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [fixture, setFixture] = useState({
    match_no: "",
    date_time: "",
    venue: "",
    team_a: "",
    team_b: "",
    umpires: "",
    status: "upcoming",
  });

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*");
    if (data) setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const saveFixture = async () => {
    setLoading(true);

    const { error } = await supabase.from("fixtures").insert({
      match_no: Number(fixture.match_no),
      date_time: fixture.date_time,
      venue: fixture.venue,
      team_a: fixture.team_a,
      team_b: fixture.team_b,
      umpires: fixture.umpires,
      status: fixture.status,
    });

    setLoading(false);

    if (!error) {
      alert("Fixture added!");
      window.location.href = "/admin/fixtures";
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Fixture</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <Input
            placeholder="Match Number"
            type="number"
            onChange={(e) => setFixture({ ...fixture, match_no: e.target.value })}
          />

          <Input
            type="datetime-local"
            onChange={(e) => setFixture({ ...fixture, date_time: e.target.value })}
          />

          <Input
            placeholder="Venue"
            onChange={(e) => setFixture({ ...fixture, venue: e.target.value })}
          />

          <div>
            <label>Team A</label>
            <select
              className="border rounded p-2 w-full"
              onChange={(e) => setFixture({ ...fixture, team_a: e.target.value })}
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Team B</label>
            <select
              className="border rounded p-2 w-full"
              onChange={(e) => setFixture({ ...fixture, team_b: e.target.value })}
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            placeholder="Umpires"
            onChange={(e) => setFixture({ ...fixture, umpires: e.target.value })}
          />

          <Button onClick={saveFixture} disabled={loading}>
            {loading ? "Saving..." : "Save Fixture"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
