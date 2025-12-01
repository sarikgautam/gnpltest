"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddTeam() {
  const [team, setTeam] = useState({
    name: "",
    captain: "",
    owner: "",
    manager: "",
    last_season_rank: "",
    description: "",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadLogo = async () => {
    if (!logoFile) return null;

    const filePath = `${Date.now()}-${logoFile.name}`;
    const { data, error } = await supabase.storage
      .from("team-logos")
      .upload(filePath, logoFile, { upsert: true });

    if (!error) {
      return supabase.storage
        .from("team-logos")
        .getPublicUrl(filePath).data.publicUrl;
    }

    return null;
  };

  const saveTeam = async () => {
    setLoading(true);

    let uploadedLogo = team.logo;
    if (logoFile) uploadedLogo = await uploadLogo();

    const { error } = await supabase.from("teams").insert({
      name: team.name,
      captain: team.captain,
      owner: team.owner,
      manager: team.manager,
      last_season_rank: Number(team.last_season_rank),
      description: team.description,
      logo: uploadedLogo,
    });

    setLoading(false);

    if (!error) {
      alert("Team added!");
      window.location.href = "/admin/teams";
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Team</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <Input
            placeholder="Team Name"
            value={team.name}
            onChange={(e) => setTeam({ ...team, name: e.target.value })}
          />

          <Input
            placeholder="Captain"
            value={team.captain}
            onChange={(e) => setTeam({ ...team, captain: e.target.value })}
          />

          <Input
            placeholder="Owner"
            value={team.owner}
            onChange={(e) => setTeam({ ...team, owner: e.target.value })}
          />

          <Input
            placeholder="Manager"
            value={team.manager}
            onChange={(e) => setTeam({ ...team, manager: e.target.value })}
          />

          <Input
            placeholder="Last Season Rank"
            type="number"
            value={team.last_season_rank}
            onChange={(e) =>
              setTeam({ ...team, last_season_rank: e.target.value })
            }
          />

          <Textarea
            placeholder="Short Description"
            value={team.description}
            onChange={(e) =>
              setTeam({ ...team, description: e.target.value })
            }
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e: any) => setLogoFile(e.target.files[0])}
          />

          {logoFile && (
            <p className="text-sm text-green-600">
              Selected: {logoFile.name}
            </p>
          )}

          <Button onClick={saveTeam} disabled={loading}>
            {loading ? "Saving..." : "Save Team"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
