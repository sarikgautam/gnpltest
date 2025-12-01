"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SponsorsPage() {
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
    <div className="max-w-7xl mx-auto px-4 py-20 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-12 text-center">
        Our Sponsors
      </h1>

      {sponsors.length === 0 && (
        <p className="text-center text-gray-400">No sponsors added yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-xl backdrop-blur-xl bg-black/20 border border-white/20
                       shadow-lg hover:shadow-2xl hover:border-green-400 transition-all"
          >
            <img
              src={s.logo}
              alt={s.name}
              className="w-full h-32 object-contain mx-auto 
                         drop-shadow-[0_0_15px_rgba(0,255,150,0.5)]"
            />

            <p className="text-center mt-4 font-semibold">{s.name}</p>
            <p className="text-center text-sm text-gray-400 capitalize">
              {s.category}
            </p>

            {s.link && (
              <a
                href={s.link}
                target="_blank"
                className="block text-center text-green-400 hover:underline text-sm mt-2"
              >
                Visit Website
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
