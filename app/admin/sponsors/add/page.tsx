"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddSponsorPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    logo: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase.from("sponsors").insert({
      name: form.name,
      category: form.category,
      logo: form.logo,
      link: form.link,
      created: new Date().toISOString(),
    });

    setLoading(false);

    if (error) alert(error.message);
    else alert("Sponsor added!");
  };

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Add Sponsor
      </h1>

      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <Input
          placeholder="Logo URL"
          value={form.logo}
          onChange={(e) => setForm({ ...form, logo: e.target.value })}
        />

        <Input
          placeholder="Link (optional)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-500 text-black"
        >
          {loading ? "Saving..." : "Save Sponsor"}
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AddSponsorPage />
    </AdminGuard>
  );
}
