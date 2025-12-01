"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// TEAM TYPE
interface TeamForm {
  name: string;
  captain: string;
  owner: string;
  manager: string;
  ranking: string;
  description: string;
  logo: string; // ALWAYS string
}

export default function AddTeamPage() {
  const [team, setTeam] = useState<TeamForm>({
    name: "",
    captain: "",
    owner: "",
    manager: "",
    ranking: "",
    description: "",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // --------- UPLOAD LOGO ---------
  const uploadLogo = async (): Promise<string> => {
    if (!logoFile) return team.logo || "";

    const fileExt = logoFile.name.split(".").pop();
    const fileName = `team-${Date.now()}.${fileExt}`;
    const filePath = `team-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(filePath, logoFile);

    if (uploadError) {
      console.error(uploadError);
      throw new Error("Logo upload failed!");
    }

    const { data: publicURL } = supabase.storage
      .from("logos")
      .getPublicUrl(filePath);

    return publicURL.publicUrl;
  };

  // --------- SAVE TEAM ---------
  const saveTeam = async () => {
    if (!team.name) {
      alert("Team name is required");
      return;
    }

    setLoading(true);

    // FIX: uploadedLogo always string
    let uploadedLogo: string = team.logo || "";

    if (logoFile) {
      uploadedLogo = await uploadLogo();
    }

    const { error } = await supabase.from("teams").insert({
      name: team.name,
      captain: team.captain,
      owner: team.owner,
      manager: team.manager,
      last_ranking: team.ranking,
      description: team.description,
      logo: uploadedLogo,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error saving team");
    } else {
      alert("Team added successfully!");
      setTeam({
        name: "",
        captain: "",
        owner: "",
        manager: "",
        ranking: "",
        description: "",
        logo: "",
      });
      setLogoFile(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Add Team</h1>

      <div className="glass-card p-6 rounded-xl border border-white/20 bg-black/30 space-y-4">
        <input
          className="input"
          placeholder="Team Name"
          value={team.name}
          onChange={(e) => setTeam({ ...team, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Captain"
          value={team.captain}
          onChange={(e) => setTeam({ ...team, captain: e.target.value })}
        />

        <input
          className="input"
          placeholder="Owner"
          value={team.owner}
          onChange={(e) => setTeam({ ...team, owner: e.target.value })}
        />

        <input
          className="input"
          placeholder="Manager"
          value={team.manager}
          onChange={(e) => setTeam({ ...team, manager: e.target.value })}
        />

        <input
          className="input"
          placeholder="Last Season Ranking"
          value={team.ranking}
          onChange={(e) => setTeam({ ...team, ranking: e.target.value })}
        />

        <textarea
          className="input h-28"
          placeholder="Short Description"
          value={team.description}
          onChange={(e) => setTeam({ ...team, description: e.target.value })}
        />

        {/* Logo Upload */}
        <div className="text-sm text-gray-300">
          <label>Team Logo</label>
          <input
            type="file"
            className="mt-2"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          onClick={saveTeam}
          className="w-full bg-green-400 text-black hover:bg-green-300"
        >
          {loading ? "Saving..." : "Save Team"}
        </Button>
      </div>
    </div>
  );
}
