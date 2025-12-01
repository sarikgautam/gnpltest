"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditGalleryItem() {
  const params = useParams();
  const router = useRouter();
  const galleryId = params.id;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Match Day",
    "Presentation",
    "Team Photos",
    "Training",
    "Highlights",
    "Behind the Scenes",
  ];

  const fetchItem = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", galleryId)
      .single();

    setItem(data);
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const saveChanges = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("gallery")
      .update({
        title: item.title,
        caption: item.caption,
        category: item.category,
      })
      .eq("id", galleryId);

    setLoading(false);

    if (!error) {
      alert("Gallery item updated!");
      router.push("/admin/gallery");
    }
  };

  if (!item) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Gallery Item</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <img
            src={item.url}
            className="w-full h-60 object-cover rounded"
          />

          <Input
            value={item.title || ""}
            placeholder="Title"
            onChange={(e) =>
              setItem({ ...item, title: e.target.value })
            }
          />

          <Textarea
            value={item.caption || ""}
            placeholder="Caption"
            onChange={(e) =>
              setItem({ ...item, caption: e.target.value })
            }
          />

          <select
            className="border p-2 rounded w-full"
            value={item.category || ""}
            onChange={(e) =>
              setItem({ ...item, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Button onClick={saveChanges} disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
