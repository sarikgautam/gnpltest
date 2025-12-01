"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*").order("name");
    if (data) setTeams(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) {
    return <p className="text-center py-20 text-gray-400">Loading teams…</p>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-white tracking-wide">
        GNPL Teams
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="
              bg-black/30 border border-white/10 
              rounded-xl overflow-hidden shadow-xl backdrop-blur-lg
              hover:scale-[1.02] transition-transform
            "
          >
            {/* Header Background */}
            <div
              className="h-32 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${team.banner || "/hero.jpg"})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <img
                src={team.logo}
                alt={team.name}
                className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 
                           w-20 h-20 rounded-full border-4 border-black shadow-xl object-cover"
              />
            </div>

            <div className="pt-12 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold text-white">{team.name}</h2>

              <p className="text-gray-400 text-sm mt-2">{team.short_desc}</p>

              <div className="mt-4 flex flex-col gap-1 text-sm text-gray-300">
                <p>
                  <span className="font-semibold text-green-300">Captain:</span>{" "}
                  {team.captain || "TBA"}
                </p>
                <p>
                  <span className="font-semibold text-green-300">Owner:</span>{" "}
                  {team.owner || "TBA"}
                </p>
                <p>
                  <span className="font-semibold text-green-300">Manager:</span>{" "}
                  {team.manager || "TBA"}
                </p>
              </div>

              <Link
                href={`/teams/${team.id}`}
                className="inline-block mt-6 px-6 py-2 rounded-full 
                         bg-green-400 text-black font-semibold 
                         hover:bg-green-300 transition-all shadow-md"
              >
                View Squad
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
