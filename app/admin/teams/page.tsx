"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function TeamsAdminPage() {
  const [teams, setTeams] = useState<any[]>([]);

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*");
    setTeams(data || []);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Teams</h1>

      <a
        href="/admin/teams/add"
        className="px-4 py-2 bg-green-500 text-black rounded-md mb-6 inline-block"
      >
        Add Team
      </a>

      <div className="grid gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20"
          >
            <h3 className="text-xl font-bold">{team.name}</h3>
            <p className="text-gray-300">{team.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <TeamsAdminPage />
    </AdminGuard>
  );
}
