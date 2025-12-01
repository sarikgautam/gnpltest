"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddFixturePage() {
  const [fixture, setFixture] = useState({
    match_no: "",
    date_time: "",
    venue: "",
    team_a: "",
    team_b: "",
    status: "upcoming",
  });

  const saveFixture = async () => {
    const { error } = await supabase.from("fixtures").insert(fixture);

    if (error) alert(error.message);
    else alert("Fixture added!");
  };

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Add Fixture
      </h1>

      <div className="space-y-4">
        <Input
          placeholder="Match No"
          onChange={(e) =>
            setFixture({ ...fixture, match_no: e.target.value })
          }
        />
        <Input
          type="datetime-local"
          onChange={(e) =>
            setFixture({ ...fixture, date_time: e.target.value })
          }
        />
        <Input
          placeholder="Venue"
          onChange={(e) =>
            setFixture({ ...fixture, venue: e.target.value })
          }
        />
        <Input
          placeholder="Team A ID"
          onChange={(e) =>
            setFixture({ ...fixture, team_a: e.target.value })
          }
        />
        <Input
          placeholder="Team B ID"
          onChange={(e) =>
            setFixture({ ...fixture, team_b: e.target.value })
          }
        />

        <Button onClick={saveFixture} className="bg-green-500 text-black">
          Save Fixture
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AddFixturePage />
    </AdminGuard>
  );
}
