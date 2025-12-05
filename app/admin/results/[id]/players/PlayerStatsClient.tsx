"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import AdminGuard from "@/components/admin/AdminGuard";

export default function PlayerStatsClient({ matchId }: { matchId: string }) {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<any[]>([]);
  const [fixture, setFixture] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const loadData = async () => {
    // 1) Load fixture
    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .eq("id", matchId)
      .single();

    setFixture(fixtureData);

    // 2) Load teams
    const { data: teamsData } = await supabase.from("teams").select("*");
    setTeams(teamsData || []);

    // 3) Load players from both teams
    const { data: pData } = await supabase
      .from("players")
      .select("*")
      .or(
        `team_id.eq.${fixtureData.team_a},team_id.eq.${fixtureData.team_b}`
      );

    setPlayers(pData || []);

    // 4) Load existing stats
    const { data: sData } = await supabase
      .from("player_match_stats")
      .select("*")
      .eq("match_id", matchId);

    const map: any = {};
    sData?.forEach((s) => {
      map[s.player_id] = s;
    });

    setStats(map);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (pid: string, key: string, value: string) => {
    setStats((prev: any) => ({
      ...prev,
      [pid]: { ...prev[pid], [key]: value },
    }));
  };

  const saveAll = async () => {
    setLoading(true);

    const updates = Object.entries(stats).map(([player_id, data]: any) => ({
      match_id: matchId,
      player_id,
      runs: Number(data.runs || 0),
      balls: Number(data.balls || 0),
      fours: Number(data.fours || 0),
      sixes: Number(data.sixes || 0),
      wickets: Number(data.wickets || 0),
      overs: data.overs || "0",
      catches: Number(data.catches || 0),
      runouts: Number(data.runouts || 0),
    }));

    await supabase.from("player_match_stats").delete().eq("match_id", matchId);
    await supabase.from("player_match_stats").insert(updates);

    setLoading(false);
    alert("Player stats updated!");
  };

  if (loading || !fixture)
    return (
      <AdminGuard>
        <p className="text-center text-white mt-10">Loading…</p>
      </AdminGuard>
    );

  return (
    <AdminGuard>
      <div className="p-6 text-white max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Edit Player Stats – Match #{fixture.match_no}
        </h1>

        <div className="bg-white/10 p-6 rounded-xl border-white/20 backdrop-blur-lg space-y-6">

          {players.map((p) => {
            const s = stats[p.id] || {};
            return (
              <div
                key={p.id}
                className="border border-white/20 rounded-lg p-4 bg-black/20"
              >
                <p className="text-lg font-semibold">{p.name}</p>
                <p className="text-xs text-gray-300 mb-3">{p.role}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="Runs"
                    value={s.runs || ""}
                    onChange={(e) => handleChange(p.id, "runs", e.target.value)}
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="Balls"
                    value={s.balls || ""}
                    onChange={(e) => handleChange(p.id, "balls", e.target.value)}
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="4s"
                    value={s.fours || ""}
                    onChange={(e) => handleChange(p.id, "fours", e.target.value)}
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="6s"
                    value={s.sixes || ""}
                    onChange={(e) => handleChange(p.id, "sixes", e.target.value)}
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="Wickets"
                    value={s.wickets || ""}
                    onChange={(e) =>
                      handleChange(p.id, "wickets", e.target.value)
                    }
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="Overs"
                    value={s.overs || ""}
                    onChange={(e) => handleChange(p.id, "overs", e.target.value)}
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="Catches"
                    value={s.catches || ""}
                    onChange={(e) =>
                      handleChange(p.id, "catches", e.target.value)
                    }
                  />

                  <input
                    className="bg-white/10 border border-white/20 rounded p-2"
                    placeholder="Run Outs"
                    value={s.runouts || ""}
                    onChange={(e) =>
                      handleChange(p.id, "runouts", e.target.value)
                    }
                  />
                </div>
              </div>
            );
          })}

          <Button
            onClick={saveAll}
            className="w-full bg-green-500 text-black hover:bg-green-400"
          >
            Save Player Stats
          </Button>
        </div>
      </div>
    </AdminGuard>
  );
}
