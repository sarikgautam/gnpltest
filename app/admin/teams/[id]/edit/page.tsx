"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditTeamPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    setTeam(data as Team);
    setLoading(false);
  };

  const uploadLogo = async () => {
    if (!logoFile) return team?.logo ?? "";

    const fileName = `team_${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("team-logos")
      .upload(fileName, logoFile);

    if (error) {
      alert("Error uploading logo");
      return team?.logo ?? "";
    }

    const url =
      supabase.storage.from("team-logos").getPublicUrl(fileName).data.publicUrl;

    return url;
  };

  const saveTeam = async () => {
    if (!team) return;

    let uploadedLogo = team.logo;
    if (logoFile) uploadedLogo = await uploadLogo();

    const { error } = await supabase
      .from("teams")
      .update({
        name: team.name,
        caption: team.captain,
        owner: team.owner,
        last_season_rank: team.last_season_rank,
        description: team.description,
        logo: uploadedLogo,
      })
      .eq("id", teamId);

    if (error) alert(error.message);
    else {
      alert("Team updated!");
      router.push("/admin/teams");
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  if (loading || !team) {
    return (
      <AdminGuard>
        <div className="text-center text-gray-300 mt-20">Loading…</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-3xl mx-auto mt-10 text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Edit Team – {team.name}
        </h1>

        <div className="p-6 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl space-y-4">

          <div>
            <label className="block text-sm text-gray-300">Team Name</label>
            <input
              value={team.name}
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Captain</label>
            <input
              value={team.captain}
              onChange={(e) => setTeam({ ...team, captain: e.target.value })}
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Owner</label>
            <input
              value={team.owner}
              onChange={(e) => setTeam({ ...team, owner: e.target.value })}
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Last Season Rank</label>
            <input
              value={team.last_season_rank}
              onChange={(e) =>
                setTeam({ ...team, last_season_rank: e.target.value })
              }
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Description</label>
            <textarea
              value={team.description ?? ""}
              onChange={(e) =>
                setTeam({ ...team, description: e.target.value })
              }
              className="input-style h-24"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Logo</label>
            <input
              type="file"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="text-white mt-1"
            />
            <img
              src={team.logo}
              className="h-20 mt-3 rounded-md object-contain"
            />
          </div>

          <Button
            onClick={saveTeam}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </AdminGuard>
  );
}
