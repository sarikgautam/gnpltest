"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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

      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-400 mb-12">
        GNPL Teams
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {teams.map((team) => (
          <div
            key={team.id}
            className="
              backdrop-blur-xl bg-black/20 border border-white/30
              rounded-2xl shadow-xl overflow-hidden 
              hover:scale-[1.02] transition-all duration-300
            "
          >
            {/* Banner */}
            <div
              className="h-48 w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${team.banner || "/hero.jpg"})` }}
            >
              <div className="absolute inset-0 bg-black/50" />

              {/* REAL LOGO — NO CIRCLE */}
              <img
                src={team.logo}
                alt={team.name}
                className="
                  absolute -bottom-14 left-1/2 -translate-x-1/2
                  w-40 h-40 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]
                "
              />
            </div>

            {/* Glass Content */}
            <div className="pt-20 px-6 pb-10 text-center">
              <h2 className="text-2xl font-bold text-green-400">{team.name}</h2>

              <p className="text-gray-300 text-sm mt-2">
                {team.short_desc || "No description provided."}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 text-center mt-8 text-gray-200 text-sm">
                <div>
                  <p className="text-green-300 font-bold">Captain</p>
                  <p>{team.captain || "TBA"}</p>
                </div>

                <div>
                  <p className="text-green-300 font-bold">Owner</p>
                  <p>{team.owner || "TBA"}</p>
                </div>

                <div>
                  <p className="text-green-300 font-bold">Manager</p>
                  <p>{team.manager || "TBA"}</p>
                </div>
              </div>

              <Link
                href={`/teams/${team.id}`}
                className="
                  inline-block mt-8 px-6 py-2 rounded-full text-black 
                  bg-green-400 hover:bg-green-300
                  font-semibold shadow-lg transition
                "
              >
                View Squad
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
