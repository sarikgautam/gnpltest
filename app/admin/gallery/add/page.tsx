"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddGallery() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImages = async () => {
    if (!files || files.length === 0) {
      alert("No files selected.");
      return;
    }

    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("gnpl-gallery")
        .upload(fileName, file);

      if (error) {
        console.error(error);
        continue;
      }

      const { data: publicURL } = supabase.storage
        .from("gnpl-gallery")
        .getPublicUrl(fileName);

      await supabase.from("gallery").insert({
        title,
        caption,
        category,
        url: publicURL.publicUrl,
      });
    }

    setLoading(false);
    alert("Images uploaded!");
    window.location.href = "/admin/gallery";
  };

  const addExternalImage = async () => {
    if (!externalUrl) return alert("Enter a valid URL.");

    setLoading(true);

    await supabase.from("gallery").insert({
      title,
      caption,
      category,
      url: externalUrl,
    });

    setLoading(false);
    alert("Image added!");
    window.location.href = "/admin/gallery";
  };

  const categories = [
    "Match Day",
    "Presentation",
    "Team Photos",
    "Training",
    "Highlights",
    "Behind the Scenes",
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Add to Gallery</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <Input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Caption"
            onChange={(e) => setCaption(e.target.value)}
          />

          <div>
            <label className="text-sm font-semibold">Category</label>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Upload from PC */}
          <div>
            <label className="text-sm font-semibold">Upload Images</label>
            <Input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <Button
              className="mt-3"
              onClick={uploadImages}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>

          {/* Add from URL */}
          <div>
            <label className="text-sm font-semibold">Add Image by URL</label>
            <Input
              placeholder="https://example.com/image.jpg"
              onChange={(e) => setExternalUrl(e.target.value)}
            />
            <Button
              variant="outline"
              className="mt-3"
              onClick={addExternalImage}
              disabled={loading}
            >
              Add via URL
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
