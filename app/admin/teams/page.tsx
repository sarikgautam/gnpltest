"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// TEAM TYPE
interface Team {
  id: string;
  name: string;
  captain: string;
  owner: string;
  manager: string;
  last_ranking: string | null;
  description: string | null;
  logo: string | null;
}

export default function TeamsAdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");

    if (!error && data) {
      setTeams(data as Team[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">All Teams</h1>

      {loading && <p className="text-gray-400">Loading teams...</p>}

      {!loading && teams.length === 0 && (
        <p className="text-gray-400">No teams added yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="glass-card border border-white/20 bg-black/30 p-5 rounded-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              {team.logo ? (
                <img
                  src={team.logo}
                  className="w-20 h-20 object-cover rounded-lg"
                  alt={team.name}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300">
                  No Logo
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-green-300">{team.name}</h2>
                <p className="text-sm text-gray-400">
                  Captain: {team.captain || "—"}
                </p>
                <p className="text-sm text-gray-400">
                  Owner: {team.owner || "—"}
                </p>
                <p className="text-sm text-gray-400">
                  Manager: {team.manager || "—"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                className="bg-green-500 hover:bg-green-400 text-black"
                asChild
              >
                <a href={`/teams/${team.id}`}>View Team</a>
              </Button>

              <Button
                className="bg-blue-500 hover:bg-blue-400 text-black"
                asChild
              >
                <a href={`/admin/teams/edit/${team.id}`}>Edit</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
