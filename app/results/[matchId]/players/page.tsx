"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Fixture = {
  id: string;
  match_no: number;
  team_a: string | null;
  team_b: string | null;
};

type Team = {
  id: string;
  name: string;
};

type Player = {
  id: string;
  name: string;
  team_id: string | null;
};

type PlayerStatRow = {
  player_id: string;
  player_name: string;
  team_id: string | null;
  runs: string;
  wickets: string;
};

function EditPlayerStatsInner() {
  const params = useParams();
  const matchId = params.matchId as string;

  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rows, setRows] = useState<PlayerStatRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const inputClass =
    "w-full rounded-md bg-white/10 border border-white/20 px-2 py-1 text-xs text-white";

  const fetchData = async () => {
    // 1) Fixture
    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .eq("id", matchId)
      .single();

    if (!fixtureData) {
      setLoading(false);
      return;
    }

    setFixture(fixtureData as Fixture);

    // 2) Teams
    const { data: teamsData } = await supabase.from("teams").select("*");
    const allTeams = (teamsData || []) as Team[];

    const tA = allTeams.find((t) => t.id === fixtureData.team_a) || null;
    const tB = allTeams.find((t) => t.id === fixtureData.team_b) || null;

    setTeamA(tA);
    setTeamB(tB);

    // 3) Players of both teams
    const { data: playersData } = await supabase
      .from("players")
      .select("*")
      .in("team_id", [fixtureData.team_a, fixtureData.team_b]);

    const allPlayers = (playersData || []) as Player[];
    setPlayers(allPlayers);

    // 4) Existing stats (if already saved before)
    const { data: statsData } = await supabase
      .from("player_match_stats")
      .select("*")
      .eq("match_id", matchId);

    const existingStats = (statsData || []) as any[];
    // ---- FETCH PLAYER OF THE MATCH ----
let playerOfMatchName = null;

if (result?.player_of_match) {
  const { data: pomPlayer } = await supabase
    .from("players")
    .select("name")
    .eq("id", result.player_of_match)
    .single();

  playerOfMatchName = pomPlayer?.name || null;
}


    // 5) Build rows state
    const newRows: PlayerStatRow[] = allPlayers.map((p) => {
      const existing = existingStats.find((s) => s.player_id === p.id);
      return {
        player_id: p.id,
        player_name: p.name,
        team_id: p.team_id,
        runs: existing?.runs?.toString() ?? "",
        wickets: existing?.wickets?.toString() ?? "",
      };
    });

    setRows(newRows);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const handleChange = (
    index: number,
    field: "runs" | "wickets",
    value: string
  ) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const saveStats = async () => {
    setSaving(true);

    // Build upsert payload
    const payload = rows
      .filter((r) => r.runs !== "" || r.wickets !== "")
      .map((r) => ({
        match_id: matchId,
        player_id: r.player_id,
        team_id: r.team_id,
        runs: r.runs === "" ? 0 : Number(r.runs),
        wickets: r.wickets === "" ? 0 : Number(r.wickets),
      }));

    // Upsert by (match_id, player_id)
    const { error } = await supabase.from("player_match_stats").upsert(
      payload,
      {
        onConflict: "match_id,player_id",
      }
    );

    setSaving(false);

    if (error) {
      alert("Error saving stats: " + error.message);
    } else {
      alert("Player stats saved!");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-300 py-10">
        Loading player stats…
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="text-center text-red-400 py-10">
        Match not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-2">
        Player Stats – Match #{fixture.match_no}
      </h1>

      <p className="text-sm text-gray-300 mb-6">
        {teamA?.name} vs {teamB?.name}
      </p>

      <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-300 border-b border-white/20 pb-2 mb-2">
          <span className="col-span-6">Player</span>
          <span className="col-span-3 text-center">Runs</span>
          <span className="col-span-3 text-center">Wickets</span>
        </div>

        {rows.map((row, idx) => (
          <div
            key={row.player_id}
            className="grid grid-cols-12 gap-2 items-center py-1 border-b border-white/10 last:border-b-0 text-xs"
          >
            <span className="col-span-6">
              {row.player_name}{" "}
              <span className="text-[0.65rem] text-gray-400">
                ({row.team_id === teamA?.id ? teamA?.name : teamB?.name})
              </span>
            </span>
            <div className="col-span-3">
              <input
                className={inputClass}
                value={row.runs}
                onChange={(e) => handleChange(idx, "runs", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="col-span-3">
              <input
                className={inputClass}
                value={row.wickets}
                onChange={(e) => handleChange(idx, "wickets", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          disabled={saving}
          onClick={saveStats}
          className="bg-green-500 hover:bg-green-400 text-black"
        >
          {saving ? "Saving…" : "Save Player Stats"}
        </Button>
      </div>
    </div>
  );
}

export default function EditPlayerStatsPage() {
  return (
    <AdminGuard>
      <EditPlayerStatsInner />
    </AdminGuard>
  );
}
