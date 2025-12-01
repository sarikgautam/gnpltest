"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { calculateStandings } from "@/lib/standings";
import { Card, CardContent } from "@/components/ui/card";

export default function StandingsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: teams } = await supabase.from("teams").select("*");
    const { data: fixtures } = await supabase.from("fixtures").select("*");
    const { data: results } = await supabase.from("results").select("*");

    if (teams && fixtures && results) {
      const table = calculateStandings(teams, fixtures, results);
      setStandings(table);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Points Table</h1>

      <Card>
        <CardContent className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">Team</th>
                <th className="p-3">P</th>
                <th className="p-3">W</th>
                <th className="p-3">L</th>
                <th className="p-3">Pts</th>
                <th className="p-3">NRR</th>
              </tr>
            </thead>

            <tbody>
              {standings.map((row) => (
                <tr key={row.team_id} className="border-b">
                  <td className="p-3 font-semibold">{row.team_name}</td>
                  <td className="p-3">{row.played}</td>
                  <td className="p-3">{row.won}</td>
                  <td className="p-3">{row.lost}</td>
                  <td className="p-3 font-bold">{row.points}</td>
                  <td className="p-3 text-green-600 font-medium">{row.nrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
