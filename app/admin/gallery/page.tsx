"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function GalleryAdminPage() {
  const [images, setImages] = useState<any[]>([]);

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*");
    setImages(data || []);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Gallery
      </h1>

      <a
        href="/admin/gallery/add"
        className="px-4 py-2 bg-green-500 text-black rounded-md mb-6 inline-block"
      >
        Add Image
      </a>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20"
          >
            <img
              src={img.url}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <GalleryAdminPage />
    </AdminGuard>
  );
}
