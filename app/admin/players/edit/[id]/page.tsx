"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<Player | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchPlayer = async () => {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    setPlayer(data as Player);
  };

  const uploadPhoto = async () => {
    if (!photoFile) return player?.photo ?? null;

    const fileName = `player_${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("player-photos")
      .upload(fileName, photoFile);

    if (error) {
      alert("Error uploading");
      return player?.photo ?? null;
    }

    return supabase.storage.from("player-photos").getPublicUrl(fileName).data
      .publicUrl;
  };

  const savePlayer = async () => {
    if (!player) return;

    const photoUrl = await uploadPhoto();

    const { error } = await supabase
      .from("players")
      .update({
        name: player.name,
        role: player.role,
        photo: photoUrl,
      })
      .eq("id", playerId);

    if (error) alert(error.message);
    else {
      alert("Player updated!");
      router.push("/admin/players");
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  if (!player) {
    return (
      <AdminGuard>
        <div className="text-center text-gray-300 mt-20">Loading…</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-xl mx-auto mt-10 text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Edit Player
        </h1>

        <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-lg space-y-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input
              className="input-style"
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Role</label>
            <select
              className="input-style"
              value={player.role}
              onChange={(e) => setPlayer({ ...player, role: e.target.value })}
            >
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="all-rounder">All-Rounder</option>
              <option value="keeper">Wicket Keeper</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Photo</label>
            <input
              type="file"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="text-white"
            />
            {player.photo && (
              <img
                src={player.photo}
                className="h-20 w-20 object-cover rounded-full mt-3 border"
              />
            )}
          </div>

          <Button
            onClick={savePlayer}
            className="w-full bg-green-500 hover:bg-green-400 text-black"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </AdminGuard>
  );
}
