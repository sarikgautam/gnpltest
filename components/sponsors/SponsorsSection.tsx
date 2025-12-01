"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  const fetchSponsors = async () => {
    const { data } = await supabase
      .from("sponsors")
      .select("*")
      .order("created", { ascending: false });

    if (data) setSponsors(data);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-24 mb-20">
      <h2 className="text-3xl font-bold text-center text-green-400 mb-12">
        Sponsors
      </h2>

      {sponsors.length === 0 && (
        <p className="text-center text-gray-400">No sponsors added yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="backdrop-blur-xl bg-black/20 border border-white/20 
                       p-4 rounded-xl shadow-lg hover:shadow-2xl
                       transition-all hover:border-green-400"
          >
            <img
              src={s.logo}
              alt={s.name}
              className="w-full h-32 object-contain 
                         drop-shadow-[0_0_15px_rgba(0,255,140,0.5)]"
            />

            <p className="text-center mt-3 font-semibold">{s.name}</p>
            <p className="text-center text-sm text-gray-400 capitalize">
              {s.category}
            </p>

            {s.link && (
              <a
                href={s.link}
                target="_blank"
                className="text-green-400 underline text-center block mt-2 text-sm"
              >
                Visit Website
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
