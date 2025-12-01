"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddSponsor() {
  const [sponsor, setSponsor] = useState({
    name: "",
    category: "",
    logo: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);

  const saveSponsor = async () => {
    setLoading(true);

    const { error } = await supabase.from("sponsors").insert(sponsor);

    setLoading(false);

    if (!error) {
      alert("Sponsor added!");
      window.location.href = "/admin/sponsors";
    }
  };

  const categories = [
    "Title Sponsor",
    "Gold Sponsor",
    "Silver Sponsor",
    "Bronze Sponsor",
    "Partner",
    "Supporter",
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Sponsor</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <Input
            placeholder="Sponsor Name"
            onChange={(e) =>
              setSponsor({ ...sponsor, name: e.target.value })
            }
          />

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSponsor({ ...sponsor, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            placeholder="Logo URL"
            onChange={(e) =>
              setSponsor({ ...sponsor, logo: e.target.value })
            }
          />

          <Input
            placeholder="Website Link (optional)"
            onChange={(e) =>
              setSponsor({ ...sponsor, link: e.target.value })
            }
          />

          <Button onClick={saveSponsor} disabled={loading}>
            {loading ? "Saving..." : "Save Sponsor"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
