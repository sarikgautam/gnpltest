"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  logo: string;
};

export default function SquadEditorPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // Fetch team
    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    setTeam(teamData as Team);

    // Fetch players in this team
    const { data: squadData } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId);

    setPlayers(squadData as Player[]);

    // Fetch players without team
    const { data: freePlayers } = await supabase
      .from("players")
      .select("*")
      .is("team_id", null);

    setAvailablePlayers(freePlayers as Player[]);

    setLoading(false);
  };

  const addPlayer = async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .update({ team_id: teamId })
      .eq("id", playerId);

    if (error) alert(error.message);
    else fetchData();
  };

  const removePlayer = async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .update({ team_id: null })
      .eq("id", playerId);

    if (error) alert(error.message);
    else fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !team) {
    return (
      <AdminGuard>
        <div className="text-center text-gray-300 mt-20">Loading squad…</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto mt-10 text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Manage Squad — {team.name}
        </h1>

        {/* Team header */}
        <div className="flex items-center gap-4 mb-8 bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-lg">
          <img
            src={team.logo}
            className="h-16 w-16 object-contain"
          />
          <h2 className="text-xl font-bold">{team.name}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Current Squad */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg">
            <h3 className="text-green-300 font-bold text-lg mb-3">
              Current Squad
            </h3>

            {players.length === 0 && (
              <p className="text-gray-400">No players yet.</p>
            )}

            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.role}</p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-400"
                    onClick={() => removePlayer(player.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Players */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg">
            <h3 className="text-green-300 font-bold text-lg mb-3">
              Add Players to Team
            </h3>

            {availablePlayers.length === 0 && (
              <p className="text-gray-400">No free players available.</p>
            )}

            <div className="space-y-3">
              {availablePlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.role}</p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-400 text-black"
                    onClick={() => addPlayer(player.id)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminGuard>
  );
}
