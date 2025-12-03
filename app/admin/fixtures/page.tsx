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
  date_time: string;
  venue: string;
  stage: string;
  overs: number | null;
  status: "upcoming" | "live" | "completed" | string;
};

type Team = {
  id: string;
  name: string;
  logo?: string | null;
};

function FixturesInner() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: fixturesData } = await supabase
      .from("fixtures")
      .select("*")
      .order("date_time", { ascending: true });

    const { data: teamsData } = await supabase
      .from("teams")
      .select("id,name,logo");

    setFixtures((fixturesData || []) as Fixture[]);
    setTeams((teamsData || []) as Team[]);
    setLoading(false);
  };

  const deleteFixture = async (id: string) => {
    if (!confirm("Delete this fixture?")) return;
    const { error } = await supabase.from("fixtures").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      alert("Fixture deleted");
      fetchData();
    }
  };

  const getTeam = (id: string | null) =>
    id ? teams.find((t) => t.id === id) : undefined;

  const statusColor = (status: string) => {
    if (status === "upcoming") return "bg-yellow-500/20 text-yellow-300";
    if (status === "live") return "bg-red-500/30 text-red-200";
    if (status === "completed") return "bg-green-500/20 text-green-300";
    return "bg-slate-500/20 text-slate-200";
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 text-white px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          Manage Fixtures
        </h1>
        <Button
          asChild
          className="bg-green-500 text-black hover:bg-green-400 px-5"
        >
          <a href="/admin/fixtures/add">+ Add Fixture</a>
        </Button>
      </div>

      {loading && (
        <p className="text-center text-gray-300 mt-10">Loading fixtures…</p>
      )}

      {!loading && fixtures.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No fixtures added yet.
        </p>
      )}

      <div className="space-y-4">
        {fixtures.map((f) => {
          const teamA = getTeam(f.team_a ?? null);
          const teamB = getTeam(f.team_b ?? null);

          return (
            <div
              key={f.id}
              className="p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left – Match Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-300">
                    Match #{f.match_no}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${statusColor(
                      f.status
                    )}`}
                  >
                    {f.status}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-cyan-200">
                    {f.stage} • {f.overs || 20} overs
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Team A */}
                  <div className="flex items-center gap-2">
                    {teamA?.logo && (
                      <img
                        src={teamA.logo}
                        alt={teamA.name}
                        className="h-10 w-10 object-contain"
                      />
                    )}
                    <span className="font-semibold">{teamA?.name}</span>
                  </div>

                  <span className="text-sm text-gray-300">vs</span>

                  {/* Team B */}
                  <div className="flex items-center gap-2">
                    {teamB?.logo && (
                      <img
                        src={teamB.logo}
                        alt={teamB.name}
                        className="h-10 w-10 object-contain"
                      />
                    )}
                    <span className="font-semibold">{teamB?.name}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mt-2">
                  {new Date(f.date_time).toLocaleString("en-AU")} • {f.venue}
                </p>
              </div>

              {/* Right – Actions */}
              <div className="flex gap-2 self-end md:self-auto">
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-400"
                >
                  <a href={`/admin/fixtures/edit/${f.id}`}>Edit</a>
                </Button>

                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => deleteFixture(f.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FixturesPage() {
  return (
    <AdminGuard>
      <FixturesInner />
    </AdminGuard>
  );
}
