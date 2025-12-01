"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function FixturesAdminPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);

  const fetchFixtures = async () => {
    const { data } = await supabase.from("fixtures").select("*");
    setFixtures(data || []);
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Fixtures</h1>

      <a
        href="/admin/fixtures/add"
        className="px-4 py-2 bg-green-500 text-black rounded-md mb-6 inline-block"
      >
        Add Fixture
      </a>

      <div className="grid gap-4">
        {fixtures.map((f) => (
          <div
            key={f.id}
            className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20"
          >
            <h3 className="text-xl font-bold">
              Match #{f.match_no} — {f.venue}
            </h3>
            <p className="text-gray-300">{new Date(f.date_time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <FixturesAdminPage />
    </AdminGuard>
  );
}
