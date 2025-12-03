"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Team = {
  id: string;
  name: string;
  logo: string;
  captain: string;
  owner: string;
  last_season_rank: string;
  description: string | null;
};

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) setTeams(data as Team[]);
    setLoading(false);
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team?")) return;

    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) alert(error.message);
    else {
      alert("Team deleted!");
      fetchTeams();
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto text-white mt-10 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Manage Teams</h1>

          <Button
            asChild
            className="bg-green-500 text-black hover:bg-green-400 px-5 py-2 rounded-lg"
          >
            <a href="/admin/teams/add">+ Add Team</a>
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-300 mt-10">Loading teams…</p>
        )}

        {/* No teams */}
        {!loading && teams.length === 0 && (
          <p className="text-center text-gray-400">No teams created yet.</p>
        )}

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="p-5 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg shadow-md"
            >
              {/* Logo + Name */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="h-20 w-20 object-contain"
                />
                <div>
                  <h2 className="text-2xl font-bold text-green-300">
                    {team.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {team.description || "No description"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-gray-300 mb-5">
                <p>
                  <span className="font-semibold text-white">Captain:</span>{" "}
                  {team.captain}
                </p>
                <p>
                  <span className="font-semibold text-white">Owner:</span>{" "}
                  {team.owner}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-white">
                    Last Season Rank:
                  </span>{" "}
                  {team.last_season_rank || "-"}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                {/* Edit */}
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-400"
                >
                  <a href={`/admin/teams/edit/${team.id}`}>Edit</a>
                </Button>

                {/* Manage Squad */}
                <Button
                  asChild
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-400"
                >
                  <a href={`/admin/teams/squad/${team.id}`}>Squad</a>
                </Button>

                {/* Delete */}
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => deleteTeam(team.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
