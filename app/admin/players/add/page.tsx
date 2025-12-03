"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function AddPlayerPage() {
  const [player, setPlayer] = useState({
    name: "",
    role: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const uploadPhoto = async () => {
    if (!photoFile) return null;

    const fileName = `player_${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("player-photos")
      .upload(fileName, photoFile);

    if (error) {
      alert("Error uploading photo");
      return null;
    }

    return supabase.storage.from("player-photos").getPublicUrl(fileName).data
      .publicUrl;
  };

  const addPlayer = async () => {
    const photoUrl = await uploadPhoto();

    const { error } = await supabase.from("players").insert({
      name: player.name,
      role: player.role,
      photo: photoUrl,
      team_id: null,
    });

    if (error) alert(error.message);
    else {
      alert("Player added!");
      window.location.href = "/admin/players";
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-xl mx-auto mt-10 text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Add Player
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
              <option value="">Select role</option>
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
              className="text-white mt-1"
            />
          </div>

          <Button
            className="w-full bg-green-500 hover:bg-green-400 text-black"
            onClick={addPlayer}
          >
            Save Player
          </Button>
        </div>
      </div>
    </AdminGuard>
  );
}
