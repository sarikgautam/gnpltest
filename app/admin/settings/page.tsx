"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SeasonSettingsPage() {
  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSeason = async () => {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .eq("active", true)
      .single();

    if (!error && data) {
      setSeason(data);
    }
    setLoading(false);
  };

  const saveSeason = async () => {
    const { error } = await supabase
      .from("seasons")
      .update({
        name: season.name,
        start_date: season.start_date,
        hero_bg: season.hero_bg,
      })
      .eq("id", season.id);

    if (error) alert("Error saving: " + error.message);
    else alert("Season updated!");
  };

  useEffect(() => {
    fetchSeason();
  }, []);

  if (loading || !season) {
    return <p className="p-6 text-gray-500">Loading season settings…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Season Settings</h1>

      {/* Season Name */}
      <label className="text-sm font-semibold">Season Name</label>
      <Input
        value={season.name}
        onChange={(e) => setSeason({ ...season, name: e.target.value })}
        className="mb-4"
      />

      {/* Start Date */}
      <label className="text-sm font-semibold">Season Start Date & Time</label>
      <Input
        type="datetime-local"
        value={
          season.start_date
            ? new Date(season.start_date).toISOString().slice(0, 16)
            : ""
        }
        onChange={(e) =>
          setSeason({ ...season, start_date: new Date(e.target.value).toISOString() })
        }
        className="mb-4"
      />

      {/* Hero Banner URL */}
      <label className="text-sm font-semibold">Hero Background Image URL</label>
      <Input
        value={season.hero_bg}
        onChange={(e) => setSeason({ ...season, hero_bg: e.target.value })}
        className="mb-4"
      />

      {/* Save Button */}
      <Button onClick={saveSeason} className="bg-cyan-500 hover:bg-cyan-400">
        Save Settings
      </Button>
    </div>
  );
}
