"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);

  const fetchSponsors = async () => {
    const { data } = await supabase
      .from("sponsors")
      .select("*")
      .order("created", { ascending: false });

    setSponsors(data || []);
  };

  const addSponsor = async () => {
    if (!name || !logo) {
      alert("Name and logo are required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("sponsors").insert([
      {
        name,
        logo,
        link,
        category,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error adding sponsor.");
      return;
    }

    setName("");
    setLogo("");
    setLink("");
    setCategory("general");
    fetchSponsors();
  };

  const deleteSponsor = async (id: string) => {
    await supabase.from("sponsors").delete().eq("id", id);
    fetchSponsors();
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-white">

      <h1 className="text-4xl font-bold text-green-400 mb-10">
        Admin: Manage Sponsors
      </h1>

      {/* Add Form */}
      <div className="glass-card backdrop-blur-xl bg-black/30 p-6 rounded-2xl border border-white/20 shadow-xl mb-12">
        <h2 className="text-2xl font-semibold text-green-300 mb-6">Add Sponsor</h2>

        <div className="space-y-4">
          <input
            className="input w-full p-3 rounded-lg bg-black/40 border border-white/20"
            placeholder="Sponsor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input w-full p-3 rounded-lg bg-black/40 border border-white/20"
            placeholder="Logo Path (/logos/abc.png)"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />

          <input
            className="input w-full p-3 rounded-lg bg-black/40 border border-white/20"
            placeholder="Website Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-lg bg-black/40 border border-white/20"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="title">Title Sponsor</option>
            <option value="gold">Gold Sponsor</option>
            <option value="silver">Silver Sponsor</option>
            <option value="partner">Partner</option>
            <option value="general">General Sponsor</option>
          </select>

          <Button
            onClick={addSponsor}
            className="w-full bg-green-400 text-black hover:bg-green-300"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Sponsor"}
          </Button>
        </div>
      </div>

      {/* Existing Sponsors */}
      <h2 className="text-2xl font-semibold text-green-300 mb-4">
        Existing Sponsors
      </h2>

      {sponsors.length === 0 && (
        <p className="text-gray-400">No sponsors found.</p>
      )}

      <div className="space-y-6">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between 
                       backdrop-blur-xl bg-black/20 border border-white/20 
                       p-4 rounded-xl shadow-lg"
          >
            <img
              src={s.logo}
              className="w-24 h-24 object-contain"
              alt={s.name}
            />

            <div className="ml-4 flex-1">
              <p className="font-bold text-lg">{s.name}</p>
              <p className="text-sm text-gray-400 capitalize">{s.category}</p>

              {s.link && (
                <a
                  className="text-green-400 underline text-sm"
                  target="_blank"
                  href={s.link}
                >
                  Visit Website
                </a>
              )}
            </div>

            <Button
              onClick={() => deleteSponsor(s.id)}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
