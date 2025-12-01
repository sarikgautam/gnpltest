"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddGalleryPage() {
  const [url, setUrl] = useState("");

  const saveImage = async () => {
    const { error } = await supabase.from("gallery").insert({
      url,
      created: new Date().toISOString(),
    });

    if (error) alert(error.message);
    else alert("Image added to gallery!");
  };

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Add Image
      </h1>

      <Input
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4"
      />

      <Button onClick={saveImage} className="bg-green-500 text-black">
        Save
      </Button>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AddGalleryPage />
    </AdminGuard>
  );
}
