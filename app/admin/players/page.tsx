"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Player = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  team_id: string | null;
};

type Team = {
  id: string;
  name: string;
};

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");

    setPlayers(data as Player[] || []);
    setTeams(teamData as Team[] || []);
    setLoading(false);
  };

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return "Free Agent";
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const deletePlayer = async (id: string) => {
    if (!confirm("Delete this player?")) return;
    await supabase.from("players").delete().eq("id", id);
    fetchPlayers();
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto text-white mt-10 px-4">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-400">Manage Players</h1>
          <Button
            asChild
            className="bg-green-500 text-black hover:bg-green-400"
          >
            <a href="/admin/players/add">+ Add Player</a>
          </Button>
        </div>

        {loading && <p className="text-center text-gray-400">Loading…</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {players.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.photo || "/default-player.png"}
                  className="h-20 w-20 object-cover rounded-full border border-white/30"
                />
                <div>
                  <h2 className="text-xl font-bold text-green-300">{p.name}</h2>
                  <p className="text-gray-300 text-sm capitalize">
                    {p.role}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getTeamName(p.team_id)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  asChild
                  className="bg-blue-500 hover:bg-blue-400"
                  size="sm"
                >
                  <a href={`/admin/players/edit/${p.id}`}>Edit</a>
                </Button>

                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => deletePlayer(p.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No players added yet.
          </p>
        )}
      </div>
    </AdminGuard>
  );
}
