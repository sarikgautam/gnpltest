"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function TeamsSection() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("teams").select("*").order("name").then(({ data }) => {
      if (data) setTeams(data);
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      <h2 className="text-3xl font-bold text-center text-green-400 mb-10">
        Teams of GNPL
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teams.map((team) => (
          <div
            key={team.id}
            className="
              backdrop-blur-xl bg-black/20 border border-white/30 
              p-6 rounded-2xl shadow-xl 
              hover:-translate-y-2 hover:shadow-2xl 
              transition-all cursor-pointer
            "
          >
            {/* Full real logo */}
            <img
              src={team.logo}
              className="w-32 h-32 mx-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
            />

            <h3 className="text-xl font-bold mt-4 text-green-400">{team.name}</h3>
            <p className="text-gray-300 text-sm mt-1">{team.short_desc}</p>

            <Link
              href={`/teams/${team.id}`}
              className="
                inline-block mt-5 px-4 py-2 bg-green-400 
                hover:bg-green-300 text-black rounded-full 
                font-semibold text-sm shadow-md transition
              "
            >
              View Squad
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
