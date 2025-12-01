"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function UpcomingFixtures() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*");
    if (data) setTeams(data);
  };

  const fetchFixtures = async () => {
    const { data } = await supabase
      .from("fixtures")
      .select("*")
      .eq("status", "upcoming")
      .order("date_time", { ascending: true })
      .limit(3);

    if (data) setFixtures(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
    fetchFixtures();
  }, []);

  const getTeam = (id: string) => teams.find((t) => t.id === id);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-24">
      <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
        Upcoming Fixtures
      </h2>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading fixtures…</p>
      )}

      {/* No Fixtures */}
      {!loading && fixtures.length === 0 && (
        <p className="text-center text-gray-400">No upcoming fixtures.</p>
      )}

      {/* Fixtures Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {fixtures.map((match) => {
          const teamA = getTeam(match.team_a);
          const teamB = getTeam(match.team_b);

          return (
            <div
              key={match.id}
              className="
                backdrop-blur-xl bg-black/20 border border-white/30 
                rounded-2xl shadow-xl p-6 
                transition-all hover:-translate-y-2 hover:shadow-2xl
              "
            >
              {/* Match Header */}
              <div className="text-center mb-6">
                <p className="text-green-300 font-bold">Match #{match.match_no}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {new Date(match.date_time).toLocaleString("en-AU")}
                </p>
                <p className="text-sm text-gray-400">{match.venue}</p>
              </div>

              {/* Teams Row */}
              <div className="flex items-center justify-between px-2">
                {/* Team A */}
                <div className="flex flex-col items-center">
                  <img
                    src={teamA?.logo}
                    className="w-20 h-20 object-contain drop-shadow-lg"
                  />
                  <p className="text-sm text-white mt-2">{teamA?.name}</p>
                </div>

                <p className="text-green-400 font-bold text-xl">VS</p>

                {/* Team B */}
                <div className="flex flex-col items-center">
                  <img
                    src={teamB?.logo}
                    className="w-20 h-20 object-contain drop-shadow-lg"
                  />
                  <p className="text-sm text-white mt-2">{teamB?.name}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-6">
                <Link href={`/fixtures/${match.id}`}>
                  <Button
                    size="sm"
                    className="bg-green-400 text-black hover:bg-green-300"
                  >
                    View Fixture
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Fixtures Button */}
      <div className="text-center mt-10">
        <Link href="/fixtures">
          <Button variant="outline" className="border-green-400 text-green-400">
            View All Fixtures
          </Button>
        </Link>
      </div>
    </section>
  );
}
