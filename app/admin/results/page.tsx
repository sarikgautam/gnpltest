"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function ResultsAdminPage() {
  const [results, setResults] = useState<any[]>([]);

  const fetchResults = async () => {
    const { data } = await supabase.from("results").select("*");
    setResults(data || []);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Results</h1>

      <div className="grid gap-4">
        {results.map((r) => (
          <div
            key={r.id}
            className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20"
          >
            <h3 className="text-xl font-bold">Match #{r.match_id}</h3>
            <p className="text-gray-300">Winner: {r.winner}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <ResultsAdminPage />
    </AdminGuard>
  );
}
