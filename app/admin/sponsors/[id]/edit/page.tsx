"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Sponsor = {
  id: string;
  name: string;
  category: string;
  logo: string;
  link: string;
};

export default function EditSponsorPage() {
  const params = useParams();
  const router = useRouter();
  const sponsorId = params.id as string;

  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSponsor = async () => {
    const { data } = await supabase
      .from("sponsors")
      .select("*")
      .eq("id", sponsorId)
      .single();

    setSponsor(data as Sponsor);
    setLoading(false);
  };

  const uploadLogo = async () => {
    if (!logoFile) return sponsor?.logo ?? "";

    const fileName = `sponsor_${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("sponsor-logos")
      .upload(fileName, logoFile);

    if (error) {
      alert("Error uploading logo");
      return sponsor?.logo ?? "";
    }

    const url =
      supabase.storage.from("sponsor-logos").getPublicUrl(fileName).data
        .publicUrl;

    return url;
  };

  const saveSponsor = async () => {
    if (!sponsor) return;

    let uploadedLogo = sponsor.logo;
    if (logoFile) uploadedLogo = await uploadLogo();

    const { error } = await supabase
      .from("sponsors")
      .update({
        name: sponsor.name,
        category: sponsor.category,
        link: sponsor.link,
        logo: uploadedLogo,
      })
      .eq("id", sponsorId);

    if (error) alert(error.message);
    else {
      alert("Sponsor updated!");
      router.push("/admin/sponsors");
    }
  };

  useEffect(() => {
    fetchSponsor();
  }, []);

  if (loading || !sponsor) {
    return (
      <AdminGuard>
        <div className="text-center text-gray-300 mt-20">Loading…</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-3xl mx-auto mt-10 text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-6">
          Edit Sponsor – {sponsor.name}
        </h1>

        <div className="p-6 bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl space-y-4">

          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input
              value={sponsor.name}
              onChange={(e) =>
                setSponsor({ ...sponsor, name: e.target.value })
              }
              className="input-style"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Category</label>
            <input
              value={sponsor.category}
              onChange={(e) =>
                setSponsor({ ...sponsor, category: e.target.value })
              }
              className="input-style"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Website Link</label>
            <input
              value={sponsor.link}
              onChange={(e) =>
                setSponsor({ ...sponsor, link: e.target.value })
              }
              className="input-style"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Logo</label>
            <input
              type="file"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="text-white mt-1"
            />
            <img
              src={sponsor.logo}
              className="h-20 mt-3 rounded-md object-contain"
            />
          </div>

          <Button
            onClick={saveSponsor}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </AdminGuard>
  );
}
