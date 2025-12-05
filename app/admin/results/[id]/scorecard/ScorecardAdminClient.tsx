"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";

type Team = {
  id: string;
  name: string;
};

type Player = {
  id: string;
  name: string;
  team_id: string | null;
  role?: string | null;
};

type BattingRow = {
  runs: string;
  balls: string;
  fours: string;
  sixes: string;
  how_out: string;
  bowler_id: string;
  fielder_id: string;
  batting_order: string;
};

type BowlingRow = {
  overs: string;
  maidens: string;
  runs_conceded: string;
  wickets: string;
  wides: string;
  no_balls: string;
};

const inputClass =
  "bg-white/10 border border-white/25 rounded-md px-2 py-1 text-xs text-white w-full";

const selectClass =
  "bg-white/10 border border-white/25 rounded-md px-2 py-1 text-xs text-white w-full";

export default function ScorecardAdminClient({ matchId }: { matchId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fixture, setFixture] = useState<any | null>(null);
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);
  const [playersA, setPlayersA] = useState<Player[]>([]);
  const [playersB, setPlayersB] = useState<Player[]>([]);

  // keyed by player_id
  const [battingA, setBattingA] = useState<Record<string, BattingRow>>({});
  const [battingB, setBattingB] = useState<Record<string, BattingRow>>({});
  const [bowlingA, setBowlingA] = useState<Record<string, BowlingRow>>({}); // team B bowling to A
  const [bowlingB, setBowlingB] = useState<Record<string, BowlingRow>>({}); // team A bowling to B

  const loadData = async () => {
    setLoading(true);

    // 1) Fixture + result
    const { data: fixtureData, error: fErr } = await supabase
      .from("fixtures")
      .select("*")
      .eq("id", matchId)
      .single();

    if (fErr || !fixtureData) {
      setLoading(false);
      return;
    }

    setFixture(fixtureData);

    // 2) Teams
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .in("id", [fixtureData.team_a, fixtureData.team_b]);

    const tA = teamsData?.find((t: any) => t.id === fixtureData.team_a) || null;
    const tB = teamsData?.find((t: any) => t.id === fixtureData.team_b) || null;

    setTeamA(tA);
    setTeamB(tB);

    // 3) Players for each team
    const { data: playersData } = await supabase
      .from("players")
      .select("*")
      .in("team_id", [fixtureData.team_a, fixtureData.team_b]);

    const listA =
      (playersData || []).filter((p: any) => p.team_id === fixtureData.team_a) ||
      [];
    const listB =
      (playersData || []).filter((p: any) => p.team_id === fixtureData.team_b) ||
      [];

    setPlayersA(listA);
    setPlayersB(listB);

    // 4) Existing batting scorecards
    const { data: battingData } = await supabase
      .from("batting_scorecard")
      .select("*")
      .eq("match_id", matchId);

    const batA: Record<string, BattingRow> = {};
    const batB: Record<string, BattingRow> = {};

    (battingData || []).forEach((row: any) => {
      const target =
        row.team_id === fixtureData.team_a ? batA : batB;

      target[row.player_id] = {
        runs: row.runs?.toString() ?? "",
        balls: row.balls?.toString() ?? "",
        fours: row.fours?.toString() ?? "",
        sixes: row.sixes?.toString() ?? "",
        how_out: row.how_out ?? "",
        bowler_id: row.bowler_id ?? "",
        fielder_id: row.fielder_id ?? "",
        batting_order: row.batting_order?.toString() ?? "",
      };
    });

    setBattingA(batA);
    setBattingB(batB);

    // 5) Existing bowling scorecards
    const { data: bowlingData } = await supabase
      .from("bowling_scorecard")
      .select("*")
      .eq("match_id", matchId);

    const bowlA: Record<string, BowlingRow> = {};
    const bowlB: Record<string, BowlingRow> = {};

    (bowlingData || []).forEach((row: any) => {
      const target =
        row.team_id === fixtureData.team_b
          ? bowlA // team B bowling to team A
          : bowlB; // team A bowling to team B

      target[row.player_id] = {
        overs: row.overs?.toString() ?? "",
        maidens: row.maidens?.toString() ?? "",
        runs_conceded: row.runs_conceded?.toString() ?? "",
        wickets: row.wickets?.toString() ?? "",
        wides: row.wides?.toString() ?? "",
        no_balls: row.no_balls?.toString() ?? "",
      };
    });

    setBowlingA(bowlA);
    setBowlingB(bowlB);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const handleBatChange = (
    side: "A" | "B",
    playerId: string,
    field: keyof BattingRow,
    value: string
  ) => {
    const setter = side === "A" ? setBattingA : setBattingB;
    const state = side === "A" ? battingA : battingB;

    setter({
      ...state,
      [playerId]: {
        ...(state[playerId] || {
          runs: "",
          balls: "",
          fours: "",
          sixes: "",
          how_out: "",
          bowler_id: "",
          fielder_id: "",
          batting_order: "",
        }),
        [field]: value,
      },
    });
  };

  const handleBowlChange = (
    side: "A" | "B",
    playerId: string,
    field: keyof BowlingRow,
    value: string
  ) => {
    const setter = side === "A" ? setBowlingA : setBowlingB;
    const state = side === "A" ? bowlingA : bowlingB;

    setter({
      ...state,
      [playerId]: {
        ...(state[playerId] || {
          overs: "",
          maidens: "",
          runs_conceded: "",
          wickets: "",
          wides: "",
          no_balls: "",
        }),
        [field]: value,
      },
    });
  };

  const saveAll = async () => {
    if (!fixture || !teamA || !teamB) return;

    setSaving(true);

    // Build batting payloads
    const batPayload: any[] = [];

    playersA.forEach((p) => {
      const row = battingA[p.id];
      if (!row) return;
      const anyFilled =
        row.runs || row.balls || row.fours || row.sixes || row.how_out;
      if (!anyFilled) return;

      batPayload.push({
        match_id: matchId,
        team_id: teamA.id,
        player_id: p.id,
        runs: Number(row.runs || 0),
        balls: Number(row.balls || 0),
        fours: Number(row.fours || 0),
        sixes: Number(row.sixes || 0),
        how_out: row.how_out || null,
        bowler_id: row.bowler_id || null,
        fielder_id: row.fielder_id || null,
        batting_order: row.batting_order
          ? Number(row.batting_order)
          : null,
      });
    });

    playersB.forEach((p) => {
      const row = battingB[p.id];
      if (!row) return;
      const anyFilled =
        row.runs || row.balls || row.fours || row.sixes || row.how_out;
      if (!anyFilled) return;

      batPayload.push({
        match_id: matchId,
        team_id: teamB.id,
        player_id: p.id,
        runs: Number(row.runs || 0),
        balls: Number(row.balls || 0),
        fours: Number(row.fours || 0),
        sixes: Number(row.sixes || 0),
        how_out: row.how_out || null,
        bowler_id: row.bowler_id || null,
        fielder_id: row.fielder_id || null,
        batting_order: row.batting_order
          ? Number(row.batting_order)
          : null,
      });
    });

    // Build bowling payloads
    const bowlPayload: any[] = [];

    // Team B bowling to Team A
    playersB.forEach((p) => {
      const row = bowlingA[p.id];
      if (!row) return;
      const anyFilled =
        row.overs ||
        row.maidens ||
        row.runs_conceded ||
        row.wickets ||
        row.wides ||
        row.no_balls;
      if (!anyFilled) return;

      const oversNum = row.overs ? Number(row.overs) : 0;
      const runsNum = row.runs_conceded ? Number(row.runs_conceded) : 0;

      bowlPayload.push({
        match_id: matchId,
        team_id: teamB.id, // bowling team
        player_id: p.id,
        overs: oversNum,
        maidens: Number(row.maidens || 0),
        runs_conceded: runsNum,
        wickets: Number(row.wickets || 0),
        wides: Number(row.wides || 0),
        no_balls: Number(row.no_balls || 0),
        economy: oversNum > 0 ? runsNum / oversNum : null,
      });
    });

    // Team A bowling to Team B
    playersA.forEach((p) => {
      const row = bowlingB[p.id];
      if (!row) return;
      const anyFilled =
        row.overs ||
        row.maidens ||
        row.runs_conceded ||
        row.wickets ||
        row.wides ||
        row.no_balls;
      if (!anyFilled) return;

      const oversNum = row.overs ? Number(row.overs) : 0;
      const runsNum = row.runs_conceded ? Number(row.runs_conceded) : 0;

      bowlPayload.push({
        match_id: matchId,
        team_id: teamA.id,
        player_id: p.id,
        overs: oversNum,
        maidens: Number(row.maidens || 0),
        runs_conceded: runsNum,
        wickets: Number(row.wickets || 0),
        wides: Number(row.wides || 0),
        no_balls: Number(row.no_balls || 0),
        economy: oversNum > 0 ? runsNum / oversNum : null,
      });
    });

    // Clear existing rows then insert fresh
    await supabase.from("batting_scorecard").delete().eq("match_id", matchId);
    await supabase.from("bowling_scorecard").delete().eq("match_id", matchId);

    if (batPayload.length) {
      const { error: batErr } = await supabase
        .from("batting_scorecard")
        .insert(batPayload);
      if (batErr) {
        alert("Error saving batting: " + batErr.message);
      }
    }

    if (bowlPayload.length) {
      const { error: bowlErr } = await supabase
        .from("bowling_scorecard")
        .insert(bowlPayload);
      if (bowlErr) {
        alert("Error saving bowling: " + bowlErr.message);
      }
    }

    setSaving(false);
    alert("Scorecard saved!");
  };

  if (loading || !fixture || !teamA || !teamB) {
    return (
      <AdminGuard>
        <div className="text-center text-white mt-10">Loading scorecard…</div>
      </AdminGuard>
    );
  }

  const allFielders = [...playersA, ...playersB];
  const allBowlers = [...playersA, ...playersB];

  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-2">
          Edit Scorecard – Match #{fixture.match_no}
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          {teamA.name} vs {teamB.name} • {fixture.stage} •{" "}
          {fixture.overs || 20} overs
        </p>

        {/* TEAM A BATTING */}
        <section className="mb-8 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            {teamA.name} Batting
          </h2>
          <div className="text-[0.7rem] text-gray-300 mb-2">
            Tip: Fill <b>batting order</b> (1,2,3...) to show who opened etc.
          </div>

          <div className="space-y-3">
            {playersA.map((p) => {
              const row = battingA[p.id] || {
                runs: "",
                balls: "",
                fours: "",
                sixes: "",
                how_out: "",
                bowler_id: "",
                fielder_id: "",
                batting_order: "",
              };

              return (
                <div
                  key={p.id}
                  className="border border-white/15 rounded-lg p-3 bg-black/30"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <input
                      className="w-16 text-center bg-white/10 border border-white/25 rounded-md px-1 py-0.5 text-[0.7rem]"
                      placeholder="#"
                      value={row.batting_order}
                      onChange={(e) =>
                        handleBatChange(
                          "A",
                          p.id,
                          "batting_order",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-6 gap-2 mb-2">
                    <input
                      className={inputClass}
                      placeholder="Runs"
                      value={row.runs}
                      onChange={(e) =>
                        handleBatChange("A", p.id, "runs", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Balls"
                      value={row.balls}
                      onChange={(e) =>
                        handleBatChange("A", p.id, "balls", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="4s"
                      value={row.fours}
                      onChange={(e) =>
                        handleBatChange("A", p.id, "fours", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="6s"
                      value={row.sixes}
                      onChange={(e) =>
                        handleBatChange("A", p.id, "sixes", e.target.value)
                      }
                    />
                    <select
                      className={selectClass}
                      value={row.bowler_id}
                      onChange={(e) =>
                        handleBatChange("A", p.id, "bowler_id", e.target.value)
                      }
                    >
                      <option value="">Bowler</option>
                      {allBowlers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className={selectClass}
                      value={row.fielder_id}
                      onChange={(e) =>
                        handleBatChange(
                          "A",
                          p.id,
                          "fielder_id",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Fielder</option>
                      {allFielders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    className={`${inputClass} text-[0.7rem]`}
                    placeholder='How out (e.g. "c Everest b Sujan", "run out (Binod)", "lbw")'
                    value={row.how_out}
                    onChange={(e) =>
                      handleBatChange("A", p.id, "how_out", e.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* TEAM B BOWLING vs A */}
        <section className="mb-8 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            {teamB.name} Bowling
          </h2>

          <div className="space-y-3">
            {playersB.map((p) => {
              const row = bowlingA[p.id] || {
                overs: "",
                maidens: "",
                runs_conceded: "",
                wickets: "",
                wides: "",
                no_balls: "",
              };

              return (
                <div
                  key={p.id}
                  className="border border-white/15 rounded-lg p-3 bg-black/30"
                >
                  <div className="font-semibold text-sm mb-2">{p.name}</div>
                  <div className="grid md:grid-cols-6 gap-2">
                    <input
                      className={inputClass}
                      placeholder="Overs"
                      value={row.overs}
                      onChange={(e) =>
                        handleBowlChange("A", p.id, "overs", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Maidens"
                      value={row.maidens}
                      onChange={(e) =>
                        handleBowlChange("A", p.id, "maidens", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Runs"
                      value={row.runs_conceded}
                      onChange={(e) =>
                        handleBowlChange(
                          "A",
                          p.id,
                          "runs_conceded",
                          e.target.value
                        )
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Wickets"
                      value={row.wickets}
                      onChange={(e) =>
                        handleBowlChange("A", p.id, "wickets", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Wides"
                      value={row.wides}
                      onChange={(e) =>
                        handleBowlChange("A", p.id, "wides", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="No Balls"
                      value={row.no_balls}
                      onChange={(e) =>
                        handleBowlChange(
                          "A",
                          p.id,
                          "no_balls",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TEAM B BATTING */}
        <section className="mb-8 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            {teamB.name} Batting
          </h2>

          <div className="space-y-3">
            {playersB.map((p) => {
              const row = battingB[p.id] || {
                runs: "",
                balls: "",
                fours: "",
                sixes: "",
                how_out: "",
                bowler_id: "",
                fielder_id: "",
                batting_order: "",
              };

              return (
                <div
                  key={p.id}
                  className="border border-white/15 rounded-lg p-3 bg-black/30"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <input
                      className="w-16 text-center bg-white/10 border border-white/25 rounded-md px-1 py-0.5 text-[0.7rem]"
                      placeholder="#"
                      value={row.batting_order}
                      onChange={(e) =>
                        handleBatChange(
                          "B",
                          p.id,
                          "batting_order",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-6 gap-2 mb-2">
                    <input
                      className={inputClass}
                      placeholder="Runs"
                      value={row.runs}
                      onChange={(e) =>
                        handleBatChange("B", p.id, "runs", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Balls"
                      value={row.balls}
                      onChange={(e) =>
                        handleBatChange("B", p.id, "balls", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="4s"
                      value={row.fours}
                      onChange={(e) =>
                        handleBatChange("B", p.id, "fours", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="6s"
                      value={row.sixes}
                      onChange={(e) =>
                        handleBatChange("B", p.id, "sixes", e.target.value)
                      }
                    />
                    <select
                      className={selectClass}
                      value={row.bowler_id}
                      onChange={(e) =>
                        handleBatChange("B", p.id, "bowler_id", e.target.value)
                      }
                    >
                      <option value="">Bowler</option>
                      {allBowlers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className={selectClass}
                      value={row.fielder_id}
                      onChange={(e) =>
                        handleBatChange(
                          "B",
                          p.id,
                          "fielder_id",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Fielder</option>
                      {allFielders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    className={`${inputClass} text-[0.7rem]`}
                    placeholder='How out (e.g. "c Binod b Sujan", "run out (Everest)", "lbw")'
                    value={row.how_out}
                    onChange={(e) =>
                      handleBatChange("B", p.id, "how_out", e.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* TEAM A BOWLING vs B */}
        <section className="mb-8 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            {teamA.name} Bowling
          </h2>

          <div className="space-y-3">
            {playersA.map((p) => {
              const row = bowlingB[p.id] || {
                overs: "",
                maidens: "",
                runs_conceded: "",
                wickets: "",
                wides: "",
                no_balls: "",
              };

              return (
                <div
                  key={p.id}
                  className="border border-white/15 rounded-lg p-3 bg-black/30"
                >
                  <div className="font-semibold text-sm mb-2">{p.name}</div>
                  <div className="grid md:grid-cols-6 gap-2">
                    <input
                      className={inputClass}
                      placeholder="Overs"
                      value={row.overs}
                      onChange={(e) =>
                        handleBowlChange("B", p.id, "overs", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Maidens"
                      value={row.maidens}
                      onChange={(e) =>
                        handleBowlChange("B", p.id, "maidens", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Runs"
                      value={row.runs_conceded}
                      onChange={(e) =>
                        handleBowlChange(
                          "B",
                          p.id,
                          "runs_conceded",
                          e.target.value
                        )
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Wickets"
                      value={row.wickets}
                      onChange={(e) =>
                        handleBowlChange("B", p.id, "wickets", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Wides"
                      value={row.wides}
                      onChange={(e) =>
                        handleBowlChange("B", p.id, "wides", e.target.value)
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="No Balls"
                      value={row.no_balls}
                      onChange={(e) =>
                        handleBowlChange(
                          "B",
                          p.id,
                          "no_balls",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            disabled={saving}
            onClick={saveAll}
            className="bg-green-500 hover:bg-green-400 text-black"
          >
            {saving ? "Saving…" : "Save Scorecard"}
          </Button>
        </div>
      </div>
    </AdminGuard>
  );
}
