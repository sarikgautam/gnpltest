"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function EditFixturePage() {
  const params = useParams();
  const router = useRouter();
  const fixtureId = params.id;

  const [teams, setTeams] = useState<any[]>([]);
  const [fixture, setFixture] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch teams for dropdowns
  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*");
    if (data) setTeams(data);
  };

  // Fetch fixture data
  const fetchFixture = async () => {
    const { data, error } = await supabase
      .from("fixtures")
      .select("*")
      .eq("id", fixtureId)
      .single();

    if (!error && data) {
      // Format the datetime for input datetime-local
      const formattedDate = new Date(data.date_time)
        .toISOString()
        .slice(0, 16);

      setFixture({
        ...data,
        date_time: formattedDate,
      });
    }

    setInitialLoading(false);
  };

  useEffect(() => {
    fetchTeams();
    fetchFixture();
  }, []);

  const saveChanges = async () => {
    setLoading(true);

    const updatedFixture = {
      match_no: Number(fixture.match_no),
      date_time: fixture.date_time,
      venue: fixture.venue,
      team_a: fixture.team_a,
      team_b: fixture.team_b,
      umpires: fixture.umpires,
      status: fixture.status,
    };

    const { error } = await supabase
      .from("fixtures")
      .update(updatedFixture)
      .eq("id", fixtureId);

    setLoading(false);

    if (!error) {
      alert("Fixture updated successfully!");
      router.push("/admin/fixtures");
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <p>Loading fixture…</p>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <p className="text-red-500">Fixture not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Fixture #{fixture.match_no}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* MATCH NUMBER */}
          <Input
            type="number"
            placeholder="Match Number"
            value={fixture.match_no}
            onChange={(e) =>
              setFixture({ ...fixture, match_no: e.target.value })
            }
          />

          {/* DATE TIME */}
          <Input
            type="datetime-local"
            value={fixture.date_time}
            onChange={(e) =>
              setFixture({ ...fixture, date_time: e.target.value })
            }
          />

          {/* VENUE */}
          <Input
            placeholder="Venue"
            value={fixture.venue}
            onChange={(e) =>
              setFixture({ ...fixture, venue: e.target.value })
            }
          />

          {/* TEAM A */}
          <div>
            <label className="text-sm font-medium">Team A</label>
            <select
              className="border rounded p-2 w-full"
              value={fixture.team_a}
              onChange={(e) =>
                setFixture({ ...fixture, team_a: e.target.value })
              }
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* TEAM B */}
          <div>
            <label className="text-sm font-medium">Team B</label>
            <select
              className="border rounded p-2 w-full"
              value={fixture.team_b}
              onChange={(e) =>
                setFixture({ ...fixture, team_b: e.target.value })
              }
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* UMPIRES */}
          <Input
            placeholder="Umpires"
            value={fixture.umpires}
            onChange={(e) =>
              setFixture({ ...fixture, umpires: e.target.value })
            }
          />

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">Match Status</label>
            <select
              className="border rounded p-2 w-full"
              value={fixture.status}
              onChange={(e) =>
                setFixture({ ...fixture, status: e.target.value })
              }
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/fixtures")}
            >
              Cancel
            </Button>

            <Button onClick={saveChanges} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
