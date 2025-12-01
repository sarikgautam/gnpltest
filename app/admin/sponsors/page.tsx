"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("sponsors")
      .select("*")
      .then(({ data }) => setSponsors(data || []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Sponsors</h1>

      <a
        href="/admin/sponsors/add"
        className="px-4 py-2 bg-green-500 text-black rounded-md mb-6 inline-block"
      >
        Add Sponsor
      </a>

      <div className="grid gap-4">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="p-4 justify-between flex bg-white/10 rounded-xl backdrop-blur-md border border-white/20"
          >
            <div>
              <h3 className="text-xl font-bold">{s.name}</h3>
              <p className="text-gray-300 text-sm">{s.category}</p>
            </div>
            <img src={s.logo} alt={s.name} className="w-20 h-20 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <SponsorsAdminPage />
    </AdminGuard>
  );
}
