"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Sponsor = {
  id: string;
  name: string;
  category: string;
  logo: string;
  link: string;
};

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("category", { ascending: true });

    if (!error && data) setSponsors(data as Sponsor[]);
    setLoading(false);
  };

  const deleteSponsor = async (id: string) => {
    if (!confirm("Delete this sponsor?")) return;

    const { error } = await supabase
      .from("sponsors")
      .delete()
      .eq("id", id);

    if (error) alert(error.message);
    else {
      alert("Sponsor deleted!");
      fetchSponsors();
    }
  };

  useEffect(() => { fetchSponsors(); }, []);

  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto text-white mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-400">Manage Sponsors</h1>

          <Button asChild className="bg-green-500 text-black hover:bg-green-400">
            <a href="/admin/sponsors/add">+ Add Sponsor</a>
          </Button>
        </div>

        {loading && <p className="text-center text-gray-300">Loading…</p>}

        {!loading && sponsors.length === 0 && (
          <p className="text-center text-gray-400">No sponsors added yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
            >
              <img
                src={s.logo}
                alt={s.name}
                className="h-20 w-auto object-contain"
              />

              <h2 className="text-xl font-bold text-green-300 mt-2">
                {s.name}
              </h2>

              <p className="text-gray-300">{s.category}</p>
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  className="text-blue-300 text-sm underline"
                >
                  Visit Sponsor
                </a>
              )}

              <div className="flex gap-2 mt-3">
                <Button
                  asChild
                  className="bg-blue-500 hover:bg-blue-400"
                  size="sm"
                >
                  <a href={`/admin/sponsors/edit/${s.id}`}>Edit</a>
                </Button>

                <Button
                  className="bg-red-500 hover:bg-red-400"
                  size="sm"
                  onClick={() => deleteSponsor(s.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
