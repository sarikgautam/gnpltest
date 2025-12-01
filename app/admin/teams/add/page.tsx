"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddTeamPage() {
  const [team, setTeam] = useState({
    name: "",
    captain: "",
    owner: "",
    logo: "",
    description: "",
  });

  const handleAdd = async () => {
    const { error } = await supabase.from("teams").insert({
      name: team.name,
      captain: team.captain,
      owner: team.owner,
      logo: team.logo,
      description: team.description,
    });

    if (error) alert(error.message);
    else alert("Team added!");
  };

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Add Team</h1>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Team Name"
          onChange={(e) => setTeam({ ...team, name: e.target.value })}
        />
        <Input
          placeholder="Captain"
          onChange={(e) => setTeam({ ...team, captain: e.target.value })}
        />
        <Input
          placeholder="Owner"
          onChange={(e) => setTeam({ ...team, owner: e.target.value })}
        />
        <Input
          placeholder="Logo URL"
          onChange={(e) => setTeam({ ...team, logo: e.target.value })}
        />
        <Input
          placeholder="Short Description"
          onChange={(e) => setTeam({ ...team, description: e.target.value })}
        />

        <Button onClick={handleAdd} className="bg-green-500 text-black">
          Save Team
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AddTeamPage />
    </AdminGuard>
  );
}
