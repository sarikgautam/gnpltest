"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setImages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const deleteImage = async (img: any) => {
    const ok = confirm("Are you sure you want to delete this image?");
    if (!ok) return;

    // Delete from Supabase Storage (if uploaded)
    if (img.url.includes("supabase")) {
      try {
        const filePath = img.url.split("/gnpl-gallery/")[1];
        await supabase.storage.from("gnpl-gallery").remove([filePath]);
      } catch (err) {
        console.error("Storage delete error:", err);
      }
    }

    // Delete record from database
    await supabase.from("gallery").delete().eq("id", img.id);

    alert("Image deleted");
    fetchGallery();
  };

  if (loading) return <div className="p-10">Loading gallery…</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>

        <Button asChild>
          <a href="/admin/gallery/add">Add Images</a>
        </Button>
      </div>

      {/* IMAGE GRID */}
      <div className="grid md:grid-cols-4 gap-6">
        {images.map((img) => (
          <Card key={img.id}>
            <CardContent className="p-2">

              {/* Image */}
              <img
                src={img.url}
                alt={img.title || "GNPL Image"}
                className="w-full h-40 object-cover rounded"
              />

              {/* Title */}
              {img.title && (
                <p className="font-semibold mt-2">{img.title}</p>
              )}

              {/* Caption */}
              {img.caption && (
                <p className="text-sm text-gray-500">{img.caption}</p>
              )}

              {/* Category */}
              {img.category && (
                <p className="text-xs text-blue-600 mt-1">
                  {img.category}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-3">

                {/* EDIT */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/admin/gallery/${img.id}/edit`}>Edit</a>
                </Button>

                {/* DELETE */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteImage(img)}
                >
                  Delete
                </Button>

              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No images in gallery. Add some!
        </p>
      )}
    </div>
  );
}
