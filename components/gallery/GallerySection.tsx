"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Gallery item type
interface GalleryImage {
  id: string;
  image_url: string;
  title?: string | null;
  created_at?: string;
}

export default function GallerySection() {
  // FIXED — typed state
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);

    if (!error && data) {
      setImages(data as GalleryImage[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      <h2 className="text-3xl font-bold text-center text-green-400 mb-8">
        Gallery
      </h2>

      {loading && (
        <p className="text-center text-gray-400 py-10">Loading photos...</p>
      )}

      {!loading && images.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          No photos added yet.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-xl bg-black/20 border border-white/10 backdrop-blur-xl shadow-lg"
          >
            <img
              src={img.image_url}
              alt={img.title || "Gallery image"}
              className="w-full h-40 object-cover hover:scale-110 transition duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
