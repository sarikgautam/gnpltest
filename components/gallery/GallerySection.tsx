"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GallerySection() {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12); // show latest 12

    setImages(data || []);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (!images.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20">
      <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>

      <div className="grid md:grid-cols-4 gap-4">
        {images.map((img: any) => (
          <img
            key={img.id}
            src={img.url}
            className="w-full h-48 object-cover rounded shadow hover:scale-105 transition"
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <a
          href="/gallery"
          className="text-blue-600 underline"
        >
          View Full Gallery
        </a>
      </div>
    </section>
  );
}
