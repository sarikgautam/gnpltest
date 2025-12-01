"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function AddResultPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id;

  const [match, setMatch] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /** TEAM SCORES (Auto JSON Builder Inputs) */
  const [teamAStats, setTeamAStats] = useState({
    runs: "",
    wickets: "",
    overs: "",
  });

  const [teamBStats, setTeamBStats] = useState({
    runs: "",
    wickets: "",
    overs: "",
  });

  /** MAIN RESULT FIELDS */
  const [result, setResult] = useState({
    winner: "",
    score_summary: "",
    player_of_match: "",
    commentary: "",
  });

  /** Convert 19.4 → 19.6666 automatically */
  const convertOvers = (val: string) => {
    if (!val.includes(".")) return Number(val);

    const [ov, balls] = val.split(".");
    const o = Number(ov);
    const b = Number(balls);

    // Valid balls are 0–5
    if (b < 0 || b > 5) return Number(o);

    return Number(o) + b / 6;
  };

  /** FETCH MATCH, TEAMS, PLAYERS */
  const fetchData = async () => {
    const { data: fixture } = await supabase
      .from("fixtures")
      .select("*")
      .eq("id", matchId)
      .single();

    const { data: teamsData } = await supabase.from("teams").select("*");
    const { data: playersData } = await supabase.from("players").select("*");

    setMatch(fixture);
    setTeams(teamsData || []);
    setPlayers(playersData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** HANDLE SAVE RESULT */
  const saveResult = async () => {
    setLoading(true);

    // Build the JSON automatically
    const jsonData = {
      team_a: {
        runs: Number(teamAStats.runs),
        wickets: Number(teamAStats.wickets),
        overs: convertOvers(teamAStats.overs),
      },
      team_b: {
        runs: Number(teamBStats.runs),
        wickets: Number(teamBStats.wickets),
        overs: convertOvers(teamBStats.overs),
      },
    };

    /** INSERT INTO RESULTS */
    const { error } = await supabase.from("results").insert({
      match_id: matchId,
      winner: result.winner,
      score_summary: result.score_summary,
      player_of_match: result.player_of_match || null,
      runs_wickets: jsonData,
      commentary: result.commentary,
    });

    if (error) {
      alert("Error saving result: " + error.message);
      setLoading(false);
      return;
    }

    /** UPDATE FIXTURE STATUS TO COMPLETED */
    await supabase
      .from("fixtures")
      .update({ status: "completed" })
      .eq("id", matchId);

    alert("Result added successfully!");
    router.push("/admin/results");
  };

  if (!match)
    return <div className="p-10 text-center">Loading match…</div>;

  const teamA = teams.find((t) => t.id === match.team_a);
  const teamB = teams.find((t) => t.id === match.team_b);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Result – Match #{match.match_no}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* WINNER */}
          <div>
            <label className="text-sm font-semibold">Winner</label>
            <select
              className="border p-2 rounded w-full"
              value={result.winner}
              onChange={(e) =>
                setResult({ ...result, winner: e.target.value })
              }
            >
              <option value="">Select winner</option>
              <option value={teamA?.id}>{teamA?.name}</option>
              <option value={teamB?.id}>{teamB?.name}</option>
            </select>
          </div>

          {/* SCORE SUMMARY */}
          <Textarea
            placeholder="Score Summary (Example: HH 145/8 beat YS by 3 runs)"
            value={result.score_summary}
            onChange={(e) =>
              setResult({ ...result, score_summary: e.target.value })
            }
          />

          {/* PLAYER OF MATCH */}
          <div>
            <label className="text-sm font-semibold">Player of Match</label>
            <select
              className="border p-2 rounded w-full"
              value={result.player_of_match}
              onChange={(e) =>
                setResult({ ...result, player_of_match: e.target.value })
              }
            >
              <option value="">Select player</option>
              {players.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* AUTO JSON BUILDER */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* TEAM A STATS */}
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2 text-center">
                {teamA?.name} – Team A
              </h3>

              <Input
                placeholder="Runs"
                value={teamAStats.runs}
                onChange={(e) =>
                  setTeamAStats({ ...teamAStats, runs: e.target.value })
                }
              />
              <Input
                placeholder="Wickets"
                className="mt-2"
                value={teamAStats.wickets}
                onChange={(e) =>
                  setTeamAStats({ ...teamAStats, wickets: e.target.value })
                }
              />
              <Input
                placeholder="Overs (e.g., 19.4)"
                className="mt-2"
                value={teamAStats.overs}
                onChange={(e) =>
                  setTeamAStats({ ...teamAStats, overs: e.target.value })
                }
              />
            </div>

            {/* TEAM B STATS */}
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2 text-center">
                {teamB?.name} – Team B
              </h3>

              <Input
                placeholder="Runs"
                value={teamBStats.runs}
                onChange={(e) =>
                  setTeamBStats({ ...teamBStats, runs: e.target.value })
                }
              />
              <Input
                placeholder="Wickets"
                className="mt-2"
                value={teamBStats.wickets}
                onChange={(e) =>
                  setTeamBStats({ ...teamBStats, wickets: e.target.value })
                }
              />
              <Input
                placeholder="Overs (e.g., 18.2)"
                className="mt-2"
                value={teamBStats.overs}
                onChange={(e) =>
                  setTeamBStats({ ...teamBStats, overs: e.target.value })
                }
              />
            </div>
          </div>

          {/* COMMENTARY */}
          <Textarea
            placeholder="Commentary"
            value={result.commentary}
            onChange={(e) =>
              setResult({ ...result, commentary: e.target.value })
            }
            rows={4}
          />

          {/* SAVE BUTTON */}
          <Button onClick={saveResult} disabled={loading}>
            {loading ? "Saving..." : "Save Result"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
