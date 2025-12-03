"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EditResult() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    match_id: "",
    winner: "",
    score_summary: "",
  });

  const fetchResult = async () => {
    const { data } = await supabase
      .from("results")
      .select("*")
      .eq("id", id)
      .single();

    if (data) setForm(data);
  };

  const updateResult = async () => {
    const { error } = await supabase
      .from("results")
      .update(form)
      .eq("id", id);

    if (error) alert(error.message);
    else {
      alert("Result updated!");
      router.push("/admin/results");
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Edit Result
      </h1>

      <div className="space-y-4">
        <Input
          value={form.match_id}
          onChange={(e) =>
            setForm({ ...form, match_id: e.target.value })
          }
        />
        <Input
          value={form.winner}
          onChange={(e) => setForm({ ...form, winner: e.target.value })}
        />
        <Input
          value={form.score_summary}
          onChange={(e) =>
            setForm({ ...form, score_summary: e.target.value })
          }
        />

        <Button onClick={updateResult} className="bg-green-500 text-black">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <EditResult />
    </AdminGuard>
  );
}
