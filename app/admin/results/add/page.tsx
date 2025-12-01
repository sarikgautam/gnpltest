"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddResultPage() {
  const [form, setForm] = useState({
    match_id: "",
    winner: "",
    score_summary: "",
  });

  const saveResult = async () => {
    const { error } = await supabase.from("results").insert({
      ...form,
      created_at: new Date().toISOString(),
    });

    if (error) alert(error.message);
    else alert("Result saved!");
  };

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Add Result
      </h1>

      <div className="space-y-4">
        <Input
          placeholder="Match ID"
          onChange={(e) =>
            setForm({ ...form, match_id: e.target.value })
          }
        />
        <Input
          placeholder="Winner Team ID"
          onChange={(e) =>
            setForm({ ...form, winner: e.target.value })
          }
        />
        <Input
          placeholder="Score Summary"
          onChange={(e) =>
            setForm({ ...form, score_summary: e.target.value })
          }
        />

        <Button onClick={saveResult} className="bg-green-500 text-black">
          Save Result
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AddResultPage />
    </AdminGuard>
  );
}
