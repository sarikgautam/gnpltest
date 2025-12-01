"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Sponsor {
  id: string;
  name: string;
  category: string;
  logo: string;
  link?: string;
}

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("created", { ascending: false });

    if (!error && data) setSponsors(data as Sponsor[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gnpl-green">Sponsors</h2>
        <p className="text-gray-500">Loading sponsors...</p>
      </section>
    );
  }

  if (!sponsors.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gnpl-green">Sponsors</h2>
        <p className="text-gray-500">No sponsors added yet.</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10 text-gnpl-green">
        Our Sponsors
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:scale-[1.06] transition-all border border-white/20 w-full flex flex-col items-center"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-32 h-32 object-contain mb-3"
            />
            <h3 className="text-white font-semibold">{sponsor.name}</h3>
            <p className="text-gray-300 text-sm">{sponsor.category}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
