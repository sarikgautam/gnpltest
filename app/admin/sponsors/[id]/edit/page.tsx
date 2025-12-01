"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditSponsor() {
  const params = useParams();
  const router = useRouter();
  const sponsorId = params.id;

  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Title Sponsor",
    "Gold Sponsor",
    "Silver Sponsor",
    "Bronze Sponsor",
    "Partner",
    "Supporter",
  ];

  const fetchSponsor = async () => {
    const { data } = await supabase
      .from("sponsors")
      .select("*")
      .eq("id", sponsorId)
      .single();

    setSponsor(data);
  };

  useEffect(() => {
    fetchSponsor();
  }, []);

  const saveSponsor = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("sponsors")
      .update(sponsor)
      .eq("id", sponsorId);

    setLoading(false);

    if (!error) {
      alert("Sponsor updated!");
      router.push("/admin/sponsors");
    }
  };

  if (!sponsor) return <div className="p-10">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Sponsor</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <Input
            value={sponsor.name}
            onChange={(e) =>
              setSponsor({ ...sponsor, name: e.target.value })
            }
          />

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="border rounded p-2 w-full"
              value={sponsor.category}
              onChange={(e) =>
                setSponsor({ ...sponsor, category: e.target.value })
              }
            >
              {categories.map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            value={sponsor.logo}
            onChange={(e) =>
              setSponsor({ ...sponsor, logo: e.target.value })
            }
          />

          <Input
            value={sponsor.link}
            onChange={(e) =>
              setSponsor({ ...sponsor, link: e.target.value })
            }
          />

          <Button onClick={saveSponsor} disabled={loading}>
            {loading ? "Saving…" : "Save Sponsor"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
