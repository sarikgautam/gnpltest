"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");

    if (!error) setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button asChild>
          <a href="/admin/teams/add">Add Team</a>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {teams.map((team: any) => (
          <Card key={team.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <img src={team.logo} className="w-16 h-16 rounded-lg object-cover" />

              <div className="flex-1">
                <h2 className="font-bold">{team.name}</h2>
                <p className="text-sm text-gray-500">
                  Captain: {team.captain || "N/A"}
                </p>
              </div>

              <Button asChild variant="outline">
                <a href={`/admin/teams/${team.id}/edit`}>Edit</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
