"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  const fetchData = async () => {
    const { data: teamData } = await supabase.from("teams").select("*");

    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .order("date_time", { ascending: true });

    setTeams(teamData || []);
    setFixtures(fixtureData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTeam = (id: string) => teams.find((t) => t.id === id);

  if (loading) {
    return (
      <div className="text-center text-white mt-20">Loading fixtures...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-20">
      <h1 className="text-4xl font-bold text-green-400 text-center mb-10">
        All Fixtures
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {fixtures.map((match) => {
          const teamA = getTeam(match.team_a);
          const teamB = getTeam(match.team_b);

          return (
            <Card
              key={match.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 rounded-2xl"
            >
              {/* Match Info */}
              <p className="text-gray-300 text-sm mb-2">
                Match #{match.match_no} • {match.stage} • {match.overs || 20} overs
              </p>

              <p className="font-semibold text-green-300 mb-1">
                {new Date(match.date_time).toLocaleString("en-AU")}
              </p>

              <p className="text-sm text-gray-400 mb-4">{match.venue}</p>

              {/* Teams */}
              <div className="flex items-center justify-between mb-4">
                {/* Team A */}
                <div className="flex flex-col items-center">
                  <img
                    src={teamA?.logo}
                    className="w-16 h-16 object-contain"
                    alt={teamA?.name}
                  />
                  <p className="text-white mt-2">{teamA?.name}</p>
                </div>

                <span className="text-white font-semibold text-xl">VS</span>

                {/* Team B */}
                <div className="flex flex-col items-center">
                  <img
                    src={teamB?.logo}
                    className="w-16 h-16 object-contain"
                    alt={teamB?.name}
                  />
                  <p className="text-white mt-2">{teamB?.name}</p>
                </div>
              </div>

              {/* View Button */}
              <Button
                asChild
                className="w-full bg-green-500 hover:bg-green-400 text-black"
              >
                <a href={`/fixtures/${match.id}`}>View Fixture</a>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
